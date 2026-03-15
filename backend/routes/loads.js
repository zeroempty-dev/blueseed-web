const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { loads } = require('../mock-db');

const router = express.Router();

// GET /api/loads
router.get('/', (req, res) => {
  const { status, businessId, pickupCity, dropCity } = req.query;
  let result = [...loads];
  if (status)     result = result.filter(l => l.status === status);
  if (businessId) result = result.filter(l => l.businessId === businessId);
  if (pickupCity)  result = result.filter(l => l.pickupCity === pickupCity);
  if (dropCity)    result = result.filter(l => l.dropCity === dropCity);
  res.json(result);
});

// GET /api/loads/:id
router.get('/:id', (req, res) => {
  const load = loads.find(l => l.id === req.params.id);
  if (!load) return res.status(404).json({ error: 'Load not found' });
  res.json(load);
});

// POST /api/loads
router.post('/', (req, res) => {
  const { businessId, pickupCity, dropCity, cargoType, weight, price, pickupTime } = req.body;
  const newLoad = {
    id: 'l' + uuidv4().slice(0, 6),
    businessId,
    pickupCity,
    dropCity,
    cargoType,
    weight: Number(weight),
    price: Number(price),
    pickupTime,
    status: 'posted',
    matchedTruckId: null,
    assignedDriverId: null,
    createdAt: new Date().toISOString(),
  };
  loads.push(newLoad);
  res.status(201).json(newLoad);
});

// PATCH /api/loads/:id
router.patch('/:id', (req, res) => {
  const load = loads.find(l => l.id === req.params.id);
  if (!load) return res.status(404).json({ error: 'Load not found' });
  Object.assign(load, req.body);
  res.json(load);
});

module.exports = router;
