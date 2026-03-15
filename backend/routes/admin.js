const express = require('express');
const { trucks, loads, shipments, businesses, drivers, users } = require('../mock-db');

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  res.json({
    totalTrucks: trucks.length,
    activeLoads: loads.filter(l => l.status !== 'delivered').length,
    completedDeliveries: loads.filter(l => l.status === 'delivered').length,
    activeTrips: shipments.filter(s => s.status === 'in-transit').length,
    totalDrivers: drivers.length,
    totalBusinesses: businesses.length,
    totalUsers: users.length,
    postedLoads: loads.filter(l => l.status === 'posted').length,
    matchedLoads: loads.filter(l => l.status === 'matched').length,
  });
});

// GET /api/admin/trucks
router.get('/trucks', (req, res) => {
  res.json(trucks);
});

// GET /api/admin/businesses
router.get('/businesses', (req, res) => {
  res.json(businesses);
});

// GET /api/admin/drivers
router.get('/drivers', (req, res) => {
  res.json(drivers);
});

// PATCH /api/admin/verify/truck/:id
router.patch('/verify/truck/:id', (req, res) => {
  const truck = trucks.find(t => t.id === req.params.id);
  if (!truck) return res.status(404).json({ error: 'Not found' });
  truck.verified = true;
  res.json(truck);
});

// PATCH /api/admin/verify/business/:id
router.patch('/verify/business/:id', (req, res) => {
  const biz = businesses.find(b => b.id === req.params.id);
  if (!biz) return res.status(404).json({ error: 'Not found' });
  biz.verified = true;
  res.json(biz);
});

module.exports = router;
