const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { shipments, loads, trucks, drivers } = require('../mock-db');

const router = express.Router();

// GET /api/shipments
router.get('/', (req, res) => {
  const { driverId, truckId, status } = req.query;
  let result = [...shipments];
  if (driverId) result = result.filter(s => s.driverId === driverId);
  if (truckId)  result = result.filter(s => s.truckId === truckId);
  if (status)   result = result.filter(s => s.status === status);
  res.json(result);
});

// GET /api/shipments/:id
router.get('/:id', (req, res) => {
  const shipment = shipments.find(s => s.id === req.params.id);
  if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
  res.json(shipment);
});

// POST /api/shipments  (accept a load → creates a shipment)
router.post('/', (req, res) => {
  const { loadId, truckId, driverId } = req.body;
  
  const load = loads.find(l => l.id === loadId);
  if (!load) return res.status(404).json({ error: 'Load not found' });
  
  const newShipment = {
    id: 's' + uuidv4().slice(0, 6),
    loadId,
    truckId,
    driverId: driverId || null,
    status: 'matched',
    pickupCity: load.pickupCity,
    dropCity: load.dropCity,
    progress: 0,
    startedAt: null,
    updatedAt: new Date().toISOString(),
    statusHistory: [
      { status: 'matched', at: new Date().toISOString() },
    ],
  };
  
  // Update load status
  load.status = 'matched';
  load.matchedTruckId = truckId;
  load.assignedDriverId = driverId || null;
  
  shipments.push(newShipment);
  res.status(201).json(newShipment);
});

// PATCH /api/shipments/:id/status
router.patch('/:id/status', (req, res) => {
  const shipment = shipments.find(s => s.id === req.params.id);
  if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
  
  const { status } = req.body;
  const validStatuses = ['matched', 'picked-up', 'in-transit', 'delivered'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  shipment.status = status;
  shipment.updatedAt = new Date().toISOString();
  shipment.statusHistory.push({ status, at: new Date().toISOString() });
  
  // Update progress
  const progressMap = { 'matched': 0, 'picked-up': 0.1, 'in-transit': 0.5, 'delivered': 1.0 };
  shipment.progress = progressMap[status] || shipment.progress;
  
  if (status === 'picked-up') shipment.startedAt = new Date().toISOString();
  
  // Update related load
  const load = loads.find(l => l.id === shipment.loadId);
  if (load) {
    const loadStatusMap = { 'matched': 'matched', 'picked-up': 'picked-up', 'in-transit': 'in-transit', 'delivered': 'delivered' };
    load.status = loadStatusMap[status] || load.status;
  }
  
  res.json(shipment);
});

// PATCH /api/shipments/:id/assign-driver
router.patch('/:id/assign-driver', (req, res) => {
  const shipment = shipments.find(s => s.id === req.params.id);
  if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
  
  const { driverId } = req.body;
  shipment.driverId = driverId;
  shipment.updatedAt = new Date().toISOString();
  
  // Update load
  const load = loads.find(l => l.id === shipment.loadId);
  if (load) load.assignedDriverId = driverId;
  
  // Update driver status
  const driver = drivers.find(d => d.id === driverId);
  if (driver) {
    driver.status = 'assigned';
    driver.assignedTruckId = shipment.truckId;
  }
  
  res.json(shipment);
});

module.exports = router;
