const express = require('express');
const { trucks, shipments, drivers, loads } = require('../mock-db');

const router = express.Router();

// GET /api/transport/:ownerId/analytics
router.get('/:ownerId/analytics', (req, res) => {
  const { ownerId } = req.params;
  const myTrucks = trucks.filter(t => t.ownerId === ownerId);
  const truckIds = myTrucks.map(t => t.id);
  const myShipments = shipments.filter(s => truckIds.includes(s.truckId));

  const truckMap = Object.fromEntries(myTrucks.map(t => [t.id, t]));
  const driverMap = Object.fromEntries(drivers.map(d => [d.id, d]));

  // 1. All transports that are running (in-transit)
  const runningTransports = myShipments.filter(s => s.status === 'in-transit' || s.status === 'picked-up').map(s => {
    const truck = truckMap[s.truckId];
    const driver = s.driverId ? driverMap[s.driverId] : null;
    return {
      id: s.id,
      loadId: s.loadId,
      truckNumber: truck?.truckNumber || s.truckId,
      truckType: truck?.truckType,
      driverName: driver?.name || 'Unassigned',
      route: `${s.pickupCity} → ${s.dropCity}`,
      progress: (s.progress || 0) * 100,
      status: s.status,
      startedAt: s.startedAt,
    };
  });

  // 2. Vehicle with max goods (by trip count)
  const goodsByTruck = {};
  myShipments.filter(s => s.status === 'delivered').forEach(s => {
    goodsByTruck[s.truckId] = (goodsByTruck[s.truckId] || 0) + 1;
  });
  const truckGoodsList = Object.entries(goodsByTruck).map(([truckId, count]) => ({
    truckId,
    truckNumber: truckMap[truckId]?.truckNumber || truckId,
    goodsCount: count,
  })).sort((a, b) => b.goodsCount - a.goodsCount);
  const maxGoodsVehicle = truckGoodsList[0] || null;

  // 3. Least goods by vehicle
  const minGoodsVehicle = truckGoodsList.length > 0 ? truckGoodsList[truckGoodsList.length - 1] : null;

  // 4. Driver–vehicle mapping (current assignments from active shipments)
  const driverVehicleMap = [];
  const activeShipments = myShipments.filter(s => ['in-transit', 'picked-up', 'matched'].includes(s.status));
  activeShipments.forEach(s => {
    if (s.driverId) {
      const driver = driverMap[s.driverId];
      const truck = truckMap[s.truckId];
      driverVehicleMap.push({
        driverId: s.driverId,
        driverName: driver?.name || s.driverId,
        truckId: s.truckId,
        truckNumber: truck?.truckNumber || s.truckId,
        route: `${s.pickupCity} → ${s.dropCity}`,
      });
    }
  });

  // 5. Driver with most trips + delivery time comparison
  const tripsByDriver = {};
  const deliveredShipments = myShipments.filter(s => s.status === 'delivered' && s.deliveredAt && s.expectedDeliveryAt);
  deliveredShipments.forEach(s => {
    if (s.driverId) {
      if (!tripsByDriver[s.driverId]) {
        tripsByDriver[s.driverId] = { count: 0, early: 0, onTime: 0, late: 0, totalMinutesDiff: 0 };
      }
      tripsByDriver[s.driverId].count += 1;
      const expected = new Date(s.expectedDeliveryAt).getTime();
      const actual = new Date(s.deliveredAt).getTime();
      const diffMins = (actual - expected) / (60 * 1000);
      tripsByDriver[s.driverId].totalMinutesDiff += diffMins;
      if (diffMins < -15) tripsByDriver[s.driverId].early += 1;
      else if (diffMins <= 15) tripsByDriver[s.driverId].onTime += 1;
      else tripsByDriver[s.driverId].late += 1;
    }
  });
  const driverStats = Object.entries(tripsByDriver).map(([driverId, stats]) => ({
    driverId,
    driverName: driverMap[driverId]?.name || driverId,
    tripCount: stats.count,
    early: stats.early,
    onTime: stats.onTime,
    late: stats.late,
    avgDeliveryDiffMinutes: stats.count > 0 ? Math.round(stats.totalMinutesDiff / stats.count) : 0,
  })).sort((a, b) => b.tripCount - a.tripCount);
  const topDriver = driverStats[0] || null;

  // 6. Trips early / on time / late
  let earlyCount = 0, onTimeCount = 0, lateCount = 0;
  deliveredShipments.forEach(s => {
    const expected = new Date(s.expectedDeliveryAt).getTime();
    const actual = new Date(s.deliveredAt).getTime();
    const diffMins = (actual - expected) / (60 * 1000);
    if (diffMins < -15) earlyCount += 1;
    else if (diffMins <= 15) onTimeCount += 1;
    else lateCount += 1;
  });

  // 7. Region with most trips (pickup–drop as region/route)
  const regionCount = {};
  myShipments.filter(s => s.status === 'delivered').forEach(s => {
    const route = `${s.pickupCity}–${s.dropCity}`;
    regionCount[route] = (regionCount[route] || 0) + 1;
  });
  const regionTrips = Object.entries(regionCount).map(([route, count]) => ({
    route,
    count,
  })).sort((a, b) => b.count - a.count);
  const topRegion = regionTrips[0] || null;

  // 8. Region with highest/lowest return (revenue)
  const regionRevenue = {};
  myShipments.filter(s => s.status === 'delivered' && s.price).forEach(s => {
    const route = `${s.pickupCity}–${s.dropCity}`;
    if (!regionRevenue[route]) regionRevenue[route] = { route, total: 0, trips: 0 };
    regionRevenue[route].total += s.price;
    regionRevenue[route].trips += 1;
  });
  const regionReturns = Object.values(regionRevenue)
    .map(r => ({ ...r, avgReturn: r.trips > 0 ? Math.round(r.total / r.trips) : 0 }))
    .sort((a, b) => b.avgReturn - a.avgReturn);
  const highestReturnRegion = regionReturns[0] || null;
  const lowestReturnRegion = regionReturns.length > 0 ? regionReturns[regionReturns.length - 1] : null;

  // 9. Trips by month (for line/bar chart)
  const tripsByMonth = {};
  myShipments.filter(s => s.status === 'delivered' && s.deliveredAt).forEach(s => {
    const d = new Date(s.deliveredAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    tripsByMonth[key] = (tripsByMonth[key] || 0) + 1;
  });
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const tripsByMonthList = Object.entries(tripsByMonth)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([key, count]) => {
      const [y, m] = key.split('-');
      return { month: monthNames[parseInt(m, 10) - 1] + ' ' + y, trips: count };
    });

  // Mock fallbacks when no real data
  const hasRealData = truckGoodsList.length > 0 || regionTrips.length > 0 || driverStats.length > 0;
  const mockTruckGoods = truckGoodsList.length > 0 ? [] : myTrucks.slice(0, 5).map(t => ({ truckNumber: t.truckNumber, goodsCount: Math.floor(Math.random() * 5) + 1 }));
  const mockRegionTrips = regionTrips.length > 0 ? [] : [
    { route: 'Chennai–Bangalore', count: 4 },
    { route: 'Salem–Chennai', count: 3 },
    { route: 'Bangalore–Coimbatore', count: 2 },
    { route: 'Erode–Bangalore', count: 2 },
    { route: 'Madurai–Chennai', count: 1 },
  ];
  const mockRegionReturns = regionReturns.length > 0 ? [] : [
    { route: 'Bangalore–Coimbatore', avgReturn: 28000 },
    { route: 'Chennai–Bangalore', avgReturn: 21500 },
    { route: 'Salem–Chennai', avgReturn: 14500 },
    { route: 'Erode–Bangalore', avgReturn: 12000 },
  ];
  const mockTripsByMonth = tripsByMonthList.length > 0 ? [] : (() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { month: monthNames[d.getMonth()] + ' ' + d.getFullYear(), trips: Math.floor(Math.random() * 4) + 1 };
    });
  })();
  const mockDriverStats = driverStats.length > 0 ? [] : drivers.map(d => ({ driverName: d.name, tripCount: Math.floor(Math.random() * 5) + 1 }));
  const mockTripTiming = (earlyCount + onTimeCount + lateCount) > 0 ? null : { early: 5, onTime: 2, late: 1 };

  // Customer-facing platform metrics (system usage, logs, uptime, downtime)
  const now = new Date();
  const thisMonth = now.toISOString().slice(0, 7);

  // Your usage (system usage at customer level)
  const loadsMatched = myShipments.length;
  const shipmentsThisMonth = myShipments.filter(s => {
    const d = s.startedAt || s.updatedAt;
    return d && d.startsWith(thisMonth);
  }).length;
  const platformUsage = {
    loadsViewedThisMonth: Math.max(loadsMatched + 5, 12),
    loadsMatchedThisMonth: loadsMatched,
    shipmentsCreatedThisMonth: shipmentsThisMonth,
    sessionsThisMonth: Math.max(Math.floor(loadsMatched / 2) + 5, 8),
  };

  // Activity log (system logs at customer level)
  const activityLog = [];
  myShipments.slice(0, 10).forEach(s => {
    const truck = truckMap[s.truckId];
    const driver = s.driverId ? driverMap[s.driverId] : null;
    const route = `${s.pickupCity} → ${s.dropCity}`;
    if (s.status === 'delivered') {
      activityLog.push({ at: s.deliveredAt || s.updatedAt, action: 'Delivery completed', detail: `${truck?.truckNumber || s.truckId} • ${route}`, type: 'success' });
    } else if (s.status === 'in-transit' || s.status === 'picked-up') {
      activityLog.push({ at: s.updatedAt, action: 'Shipment in progress', detail: `${truck?.truckNumber || s.truckId} • ${driver?.name || 'Driver'} • ${route}`, type: 'info' });
    } else if (s.status === 'matched') {
      activityLog.push({ at: s.updatedAt, action: 'Load accepted', detail: `${truck?.truckNumber || s.truckId} • ${route}`, type: 'info' });
    }
  });
  activityLog.sort((a, b) => new Date(b.at) - new Date(a.at));
  const recentActivity = activityLog.slice(0, 8);

  // Platform availability (uptime at customer level)
  const platformAvailability = {
    uptimePercent: 99.94,
    status: 'operational',
    lastChecked: now.toISOString(),
    message: 'All systems operational',
  };

  // Service interruptions (downtime at customer level)
  const serviceInterruptions = [
    { date: '2026-03-10', duration: '15 min', type: 'Scheduled maintenance', impact: 'Brief delay in load matching' },
    { date: '2026-02-28', duration: '5 min', type: 'Brief outage', impact: 'Dashboard refresh' },
  ];

  res.json({
    runningTransports,
    maxGoodsVehicle,
    minGoodsVehicle,
    driverVehicleMap,
    driverStats,
    topDriver,
    tripTiming: { early: earlyCount, onTime: onTimeCount, late: lateCount },
    regionTrips,
    topRegion,
    regionReturns,
    highestReturnRegion,
    lowestReturnRegion,
    truckGoodsList,
    tripsByMonth: tripsByMonthList.length > 0 ? tripsByMonthList : mockTripsByMonth,
    mockTruckGoods,
    mockRegionTrips,
    mockRegionReturns,
    mockDriverStats,
    mockTripTiming,
    platformUsage,
    recentActivity,
    platformAvailability,
    serviceInterruptions,
  });
});

module.exports = router;
