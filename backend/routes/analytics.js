const express = require('express');
const { users, loads, shipments, trucks, drivers, businesses } = require('../mock-db');

const router = express.Router();

// Shared platform availability and interruptions (same for all)
const platformAvailability = {
  uptimePercent: 99.94,
  status: 'operational',
  message: 'All systems operational',
};

const serviceInterruptions = [
  { date: '2026-03-10', duration: '15 min', type: 'Scheduled maintenance', impact: 'Brief delay in load matching' },
  { date: '2026-02-28', duration: '5 min', type: 'Brief outage', impact: 'Dashboard refresh' },
];

// GET /api/analytics/:userId
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const now = new Date();
  const thisMonth = now.toISOString().slice(0, 7);
  const role = user.role;

  let platformUsage = { items: [] };
  let recentActivity = [];

  if (role === 'business') {
    const bizLoads = loads.filter(l => l.businessId === userId);
    const loadsPosted = bizLoads.length;
    const loadsMatched = bizLoads.filter(l => ['matched', 'picked-up', 'in-transit', 'delivered'].includes(l.status)).length;
    const loadsThisMonth = bizLoads.filter(l => l.createdAt?.startsWith(thisMonth)).length;
    platformUsage = {
      items: [
        { label: 'Loads posted', value: loadsPosted },
        { label: 'Loads matched', value: loadsMatched },
        { label: 'Posted this month', value: loadsThisMonth },
        { label: 'Sessions', value: Math.max(Math.floor(loadsPosted / 2) + 6, 10) },
      ],
    };
    recentActivity = bizLoads.slice(0, 8).map(l => ({
      at: l.createdAt || l.pickupTime,
      action: l.status === 'delivered' ? 'Delivery completed' : l.status === 'posted' ? 'Load posted' : 'Load matched',
      detail: `${l.pickupCity} → ${l.dropCity} • ${l.cargoType}`,
    })).sort((a, b) => new Date(b.at) - new Date(a.at));
  } else if (role === 'transport') {
    const driver = drivers.find(d => d.userId === userId);
    const driverId = driver?.id;
    const myTrucks = trucks.filter(t => t.ownerId === userId);
    const truckIds = myTrucks.map(t => t.id);
    const myShipments = shipments.filter(s => truckIds.includes(s.truckId));
    const loadsMatched = myShipments.length;
    const shipmentsThisMonth = myShipments.filter(s => (s.startedAt || s.updatedAt)?.startsWith(thisMonth)).length;
    platformUsage = {
      items: [
        { label: 'Loads viewed', value: Math.max(loadsMatched + 5, 12) },
        { label: 'Loads matched', value: loadsMatched },
        { label: 'Shipments created', value: shipmentsThisMonth },
        { label: 'Sessions', value: Math.max(Math.floor(loadsMatched / 2) + 5, 8) },
      ],
    };
    const truckMap = Object.fromEntries(myTrucks.map(t => [t.id, t]));
    const driverMap = Object.fromEntries(drivers.map(d => [d.id, d]));
    recentActivity = myShipments.slice(0, 8).map(s => {
      const truck = truckMap[s.truckId];
      const drv = s.driverId ? driverMap[s.driverId] : null;
      const route = `${s.pickupCity} → ${s.dropCity}`;
      let action = 'Load accepted';
      if (s.status === 'delivered') action = 'Delivery completed';
      else if (s.status === 'in-transit' || s.status === 'picked-up') action = 'Shipment in progress';
      return { at: s.deliveredAt || s.updatedAt, action, detail: `${truck?.truckNumber || s.truckId} • ${drv?.name || 'Driver'} • ${route}` };
    }).sort((a, b) => new Date(b.at) - new Date(a.at));
  } else if (role === 'driver') {
    const driver = drivers.find(d => d.userId === userId);
    const driverId = driver?.id;
    const myShipments = shipments.filter(s => s.driverId === driverId);
    const tripsCompleted = myShipments.filter(s => s.status === 'delivered').length;
    const tripsThisMonth = myShipments.filter(s => (s.deliveredAt || s.updatedAt)?.startsWith(thisMonth)).length;
    platformUsage = {
      items: [
        { label: 'Trips assigned', value: myShipments.length },
        { label: 'Trips completed', value: tripsCompleted },
        { label: 'Completed this month', value: tripsThisMonth },
        { label: 'Sessions', value: Math.max(Math.floor(myShipments.length) + 4, 8) },
      ],
    };
    recentActivity = myShipments.slice(0, 8).map(s => ({
      at: s.deliveredAt || s.updatedAt,
      action: s.status === 'delivered' ? 'Delivery completed' : s.status === 'in-transit' ? 'Trip in progress' : 'Trip assigned',
      detail: `${s.pickupCity} → ${s.dropCity}`,
    })).sort((a, b) => new Date(b.at) - new Date(a.at));
  } else if (role === 'admin') {
    const verifiedTrucks = trucks.filter(t => t.verified).length;
    const verifiedBiz = businesses.filter(b => b.verified).length;
    const totalLoads = loads.length;
    const matchedLoads = loads.filter(l => ['matched', 'picked-up', 'in-transit', 'delivered'].includes(l.status)).length;
    platformUsage = {
      items: [
        { label: 'Trucks verified', value: verifiedTrucks },
        { label: 'Businesses verified', value: verifiedBiz },
        { label: 'Total loads', value: totalLoads },
        { label: 'Matched loads', value: matchedLoads },
      ],
    };
    recentActivity = [
      { at: now.toISOString(), action: 'Dashboard viewed', detail: 'Platform overview' },
      { at: new Date(now - 3600000).toISOString(), action: 'Truck verified', detail: 'TN-04-GH-3456' },
      { at: new Date(now - 7200000).toISOString(), action: 'Load reviewed', detail: 'Bangalore → Chennai' },
    ];
  }

  res.json({
    platformUsage,
    recentActivity,
    platformAvailability,
    serviceInterruptions,
  });
});

module.exports = router;
