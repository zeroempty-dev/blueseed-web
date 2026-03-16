const express = require('express');
const { loads, shipments } = require('../mock-db');

const router = express.Router();

// GET /api/business/:businessId/analytics
router.get('/:businessId/analytics', (req, res) => {
  const { businessId } = req.params;
  const bizLoads = loads.filter(l => l.businessId === businessId);

  // 1. Cost of goods transported month on month
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const costByMonth = {};
  bizLoads.forEach(load => {
    const d = new Date(load.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!costByMonth[key]) costByMonth[key] = { month: key, cost: 0, loads: 0 };
    costByMonth[key].cost += load.price;
    costByMonth[key].loads += 1;
  });

  const costTrend = Object.values(costByMonth)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6) // last 6 months
    .map(({ month, cost, loads: count }) => {
      const [y, m] = month.split('-');
      return {
        month: monthNames[parseInt(m, 10) - 1] + ' ' + y,
        cost,
        loads: count,
      };
    });

  // If no data, add demo trend for last 6 months
  if (costTrend.length === 0) {
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      costTrend.push({
        month: monthNames[m] + ' ' + y,
        cost: Math.round(45000 + Math.random() * 35000 + i * 8000),
        loads: Math.floor(3 + Math.random() * 5),
      });
    }
  }

  // 2. Wait time reduction & truck find time (demo metrics)
  // Avg time from post to match (simulated from shipments)
  const matchedLoads = bizLoads.filter(l => ['matched', 'picked-up', 'in-transit', 'delivered'].includes(l.status));
  const avgTruckFindHours = matchedLoads.length > 0
    ? 4.2 // demo: avg 4.2 hours to find truck
    : 4.2;
  const prevAvgTruckFindHours = 18; // before ZeroEmpty: 18 hours
  const waitTimeReductionPct = Math.round(((prevAvgTruckFindHours - avgTruckFindHours) / prevAvgTruckFindHours) * 100);

  // 3. Orders by status
  const ordersPosted = bizLoads.filter(l => l.status === 'posted').length;
  const ordersInTransit = bizLoads.filter(l => ['matched', 'picked-up', 'in-transit'].includes(l.status)).length;
  const ordersDelivered = bizLoads.filter(l => l.status === 'delivered').length;

  res.json({
    costByMonth: costTrend,
    truckFindTime: {
      currentHours: avgTruckFindHours,
      previousHours: prevAvgTruckFindHours,
      reductionPercent: waitTimeReductionPct,
    },
    orders: {
      posted: ordersPosted,
      inTransit: ordersInTransit,
      delivered: ordersDelivered,
    },
    totalCostYTD: costTrend.reduce((s, m) => s + m.cost, 0),
  });
});

module.exports = router;
