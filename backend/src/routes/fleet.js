/**
 * fleet.js — Fleet & Booking routes (Order Service)
 *
 * Mounted at /api/fleet and /api/bookings in src/index.js.
 *
 * Endpoints:
 *  GET  /api/fleet/types            — vehicle type summary for TransportScreen
 *  GET  /api/fleet/vehicles         — list all vehicles (with type info)
 *  POST /api/fleet/vehicles         — register a new vehicle
 *  PATCH /api/fleet/vehicles/:id    — update vehicle details / status
 *  DELETE /api/fleet/vehicles/:id   — remove vehicle
 *
 *  GET  /api/bookings               — list bookings (order ↔ vehicle)
 *  POST /api/bookings               — assign vehicle + driver to an order
 *  PATCH /api/bookings/:id/status   — update booking status
 */

const express = require('express');
const pool    = require('../db/pool');
const { optionalAuth, requireAuth } = require('../middleware/auth');

const router = express.Router();

// ─────────────────────────────────────────────────────────────
//  FLEET / VEHICLE TYPES
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/fleet/types
 * Returns vehicle type summary: each type with total vehicle count
 * and how many are available vs in_transit.
 * This is the endpoint that replaces the hardcoded VEHICLE_TYPES
 * array in TransportScreen.js.
 */
router.get('/types', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        vt.id,
        vt.name,
        vt.icon,
        vt.min_capacity_kg,
        vt.max_capacity_kg,
        vt.status,
        COUNT(v.id)::int                                                AS total_count,
        COUNT(v.id) FILTER (WHERE v.status = 'available')::int         AS available_count,
        COUNT(v.id) FILTER (WHERE v.status = 'in_transit')::int        AS in_transit_count
      FROM vehicle_types vt
      LEFT JOIN vehicles v ON v.vehicle_type_id = vt.id
      GROUP BY vt.id
      ORDER BY vt.id
    `);

    // Format for the mobile app: capacity as a human-readable string
    const formatted = rows.map((r) => ({
      id:            r.id,
      type:          r.name,
      icon:          r.icon,
      capacityRange: formatCapacity(r.min_capacity_kg, r.max_capacity_kg),
      minCapacityKg: parseFloat(r.min_capacity_kg),
      maxCapacityKg: parseFloat(r.max_capacity_kg),
      status:        r.total_count === 0
                       ? r.status                           // use seeded status if no vehicles yet
                       : r.available_count > 0 ? 'available' : 'limited',
      count:         r.total_count,
      available:     r.available_count,
      inTransit:     r.in_transit_count,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('GET /fleet/types error:', err);
    res.status(500).json({ error: 'Failed to fetch vehicle types' });
  }
});

/**
 * GET /api/fleet/vehicles
 * List all vehicles with their type name and owner name.
 */
router.get('/vehicles', requireAuth, async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        v.*,
        vt.name  AS type_name,
        u.name   AS owner_name
      FROM vehicles v
      LEFT JOIN vehicle_types vt ON vt.id = v.vehicle_type_id
      LEFT JOIN users          u  ON u.id  = v.owner_id
      ORDER BY v.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /fleet/vehicles error:', err);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

/**
 * POST /api/fleet/vehicles
 * Register a new vehicle.
 * Body: { vehicleTypeId, capacityKg, registrationNumber, model?, make?, status? }
 */
router.post('/vehicles', requireAuth, async (req, res) => {
  try {
    const {
      vehicleTypeId,
      capacityKg,
      registrationNumber,
      model,
      make,
      status = 'available',
    } = req.body;

    if (!capacityKg || !registrationNumber) {
      return res.status(400).json({ error: 'capacityKg and registrationNumber are required' });
    }

    const { rows } = await pool.query(
      `INSERT INTO vehicles
         (owner_id, vehicle_type_id, category, capacity_kg, registration_number, model, make, status)
       VALUES ($1, $2,
         (SELECT name FROM vehicle_types WHERE id = $2),
         $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, vehicleTypeId || null, capacityKg, registrationNumber, model || null, make || null, status]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Registration number already exists' });
    }
    console.error('POST /fleet/vehicles error:', err);
    res.status(500).json({ error: 'Failed to register vehicle' });
  }
});

/**
 * PATCH /api/fleet/vehicles/:id
 * Update vehicle status, type, model, make.
 * Body: { vehicleTypeId?, status?, model?, make?, capacityKg? }
 */
router.patch('/vehicles/:id', requireAuth, async (req, res) => {
  try {
    const { vehicleTypeId, status, model, make, capacityKg } = req.body;
    const updates = [];
    const values  = [];
    let   i       = 1;

    if (vehicleTypeId !== undefined) { updates.push(`vehicle_type_id = $${i++}`); values.push(vehicleTypeId); }
    if (status        !== undefined) { updates.push(`status = $${i++}`);          values.push(status); }
    if (model         !== undefined) { updates.push(`model = $${i++}`);           values.push(model); }
    if (make          !== undefined) { updates.push(`make = $${i++}`);            values.push(make); }
    if (capacityKg    !== undefined) { updates.push(`capacity_kg = $${i++}`);     values.push(capacityKg); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.params.id);
    const { rows } = await pool.query(
      `UPDATE vehicles SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('PATCH /fleet/vehicles/:id error:', err);
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

/**
 * DELETE /api/fleet/vehicles/:id
 */
router.delete('/vehicles/:id', requireAuth, async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM vehicles WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /fleet/vehicles/:id error:', err);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

// ─────────────────────────────────────────────────────────────
//  BOOKINGS  (order ↔ vehicle assignments)
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/bookings
 * List all bookings with order route and vehicle info.
 */
router.get('/bookings', requireAuth, async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        b.*,
        o.pickup_location, o.drop_location, o.status AS order_status,
        v.registration_number,
        u.name AS driver_name
      FROM bookings b
      LEFT JOIN orders   o ON o.id = b.order_id
      LEFT JOIN vehicles v ON v.id = b.vehicle_id
      LEFT JOIN users    u ON u.id = b.driver_id
      ORDER BY b.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('GET /bookings error:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

/**
 * POST /api/bookings
 * Assign a vehicle and driver to an order.
 * Body: { orderId, vehicleId?, driverId?, price? }
 */
router.post('/bookings', requireAuth, async (req, res) => {
  try {
    const { orderId, vehicleId, driverId, price } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    const { rows } = await pool.query(
      `INSERT INTO bookings (order_id, vehicle_id, driver_id, price, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`,
      [orderId, vehicleId || null, driverId || null, price || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /bookings error:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

/**
 * PATCH /api/bookings/:id/status
 * Move a booking through its lifecycle.
 * Body: { status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled' }
 */
router.patch('/bookings/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
    }

    const completedAt = status === 'completed' ? 'NOW()' : 'completed_at';
    const { rows } = await pool.query(
      `UPDATE bookings
       SET status = $1, completed_at = ${completedAt}
       WHERE id = $2
       RETURNING *`,
      [status, req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('PATCH /bookings/:id/status error:', err);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

/** Converts kg range to a human-readable string, e.g. "20 – 40 T" */
function formatCapacity(minKg, maxKg) {
  const fmt = (kg) => {
    const t = kg / 1000;
    return t >= 1 ? `${t % 1 === 0 ? t : t.toFixed(1)} T` : `${kg} kg`;
  };
  return `${fmt(minKg)} – ${fmt(maxKg)}`;
}

module.exports = router;
