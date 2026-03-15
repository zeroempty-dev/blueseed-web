const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { trucks } = require('../mock-db');

const router = express.Router();

// GET /api/trucks
router.get('/', (req, res) => {
  const { ownerId, status } = req.query;
  let result = [...trucks];
  if (ownerId) result = result.filter(t => t.ownerId === ownerId);
  if (status)  result = result.filter(t => t.status === status);
  res.json(result);
});

// GET /api/trucks/:id
router.get('/:id', (req, res) => {
  const truck = trucks.find(t => t.id === req.params.id);
  if (!truck) return res.status(404).json({ error: 'Truck not found' });
  res.json(truck);
});

// POST /api/trucks
router.post('/', (req, res) => {
  const { ownerId, truckNumber, truckType, capacity, currentCity, destinationCity } = req.body;
  const newTruck = {
    id: 't' + uuidv4().slice(0, 6),
    ownerId,
    truckNumber,
    truckType,
    capacity: Number(capacity),
    currentCity,
    destinationCity,
    status: 'available',
    verified: false,
  };
  trucks.push(newTruck);
  res.status(201).json(newTruck);
});

// PATCH /api/trucks/:id
router.patch('/:id', (req, res) => {
  const truck = trucks.find(t => t.id === req.params.id);
  if (!truck) return res.status(404).json({ error: 'Truck not found' });
  Object.assign(truck, req.body);
  res.json(truck);
});

module.exports = router;
