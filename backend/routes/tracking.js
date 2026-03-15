const express = require('express');
const { shipments, cityCoords } = require('../mock-db');

const router = express.Router();

// GET /api/tracking/:shipmentId
// Returns simulated GPS position along the route
router.get('/:shipmentId', (req, res) => {
  const shipment = shipments.find(s => s.id === req.params.shipmentId);
  if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
  
  const pickup = cityCoords[shipment.pickupCity];
  const drop = cityCoords[shipment.dropCity];
  
  if (!pickup || !drop) {
    return res.status(400).json({ error: 'Unknown city coordinates' });
  }
  
  // Simulate progress: increases by ~2% each call if in-transit
  if (shipment.status === 'in-transit' && shipment.progress < 0.95) {
    shipment.progress = Math.min(shipment.progress + 0.02, 0.95);
  }
  
  // Interpolate position
  const lat = pickup.lat + (drop.lat - pickup.lat) * shipment.progress;
  const lng = pickup.lng + (drop.lng - pickup.lng) * shipment.progress;
  
  res.json({
    shipmentId: shipment.id,
    status: shipment.status,
    progress: shipment.progress,
    currentPosition: { lat, lng },
    pickup: { city: shipment.pickupCity, ...pickup },
    drop: { city: shipment.dropCity, ...drop },
    truckId: shipment.truckId,
    driverId: shipment.driverId,
  });
});

module.exports = router;
