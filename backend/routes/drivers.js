const express = require('express');
const { drivers } = require('../mock-db');

const router = express.Router();

// GET /api/drivers
router.get('/', (req, res) => {
  res.json(drivers);
});

// GET /api/drivers/:id
router.get('/:id', (req, res) => {
  const driver = drivers.find(d => d.id === req.params.id);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  res.json(driver);
});

module.exports = router;
