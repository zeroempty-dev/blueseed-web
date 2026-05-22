/**
 * orders.js — Order & Commodity routes
 *
 * Mounted at /api/orders in src/index.js.
 *
 * Endpoints:
 *  GET    /          — list orders for the authenticated supplier
 *  GET    /:id       — single order with commodity
 *  POST   /          — create order + commodity (atomic)
 *  PATCH  /:id       — update order fields + commodity
 *  PATCH  /:id/status — move order through status states
 *  DELETE /:id       — cancel/remove an order
 *
 * Auth: uses optionalAuth so the app keeps working in demo mode
 * (no token → falls back to DEMO_SUPPLIER_ID=1).
 */

const express = require('express');
const pool    = require('../db/pool');
const { optionalAuth, requireAuth } = require('../middleware/auth');

const router = express.Router();

// Demo supplier used when no JWT is present (backwards-compat during migration)
const DEMO_SUPPLIER_ID = 1;

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Formats a raw DB row into the camelCase order object the app expects.
 */
function formatOrder(row) {
  return {
    id:                   row.id,
    supplierId:           row.supplier_id,
    pickupLocation:       row.pickup_location,
    dropLocation:         row.drop_location,
    pickupDate:           row.pickup_date,
    transportType:        row.transport_type,
    deliveryType:         row.delivery_type,
    deliveryDeadline:     row.delivery_deadline,
    status:               row.status,
    estimatedDistanceKm:  row.estimated_distance_km ? parseFloat(row.estimated_distance_km) : null,
    estimatedTimeHrs:     row.estimated_time_hrs    ? parseFloat(row.estimated_time_hrs)    : null,
    createdAt:            row.created_at,
    updatedAt:            row.updated_at,
    commodity: row.commodity_name
      ? {
          name:     row.commodity_name,
          type:     row.commodity_type,
          weightKg: parseFloat(row.weight_kg),
          lengthCm: row.length_cm ? parseFloat(row.length_cm) : null,
          widthCm:  row.width_cm  ? parseFloat(row.width_cm)  : null,
          heightCm: row.height_cm ? parseFloat(row.height_cm) : null,
        }
      : null,
  };
}

/** Shared JOIN query used by GET / and GET /:id */
const ORDER_SELECT = `
  SELECT o.*,
         c.name    AS commodity_name,
         c.type    AS commodity_type,
         c.weight_kg,
         c.length_cm,
         c.width_cm,
         c.height_cm
  FROM orders o
  LEFT JOIN LATERAL (
    SELECT * FROM commodities WHERE order_id = o.id LIMIT 1
  ) c ON true
`;

// ─────────────────────────────────────────────────────────────
//  GET /api/orders
// ─────────────────────────────────────────────────────────────

/**
 * Returns all orders for the logged-in supplier, newest first.
 * Falls back to DEMO_SUPPLIER_ID when no JWT is present.
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const supplierId = req.user?.id
      ? parseInt(req.user.id, 10)
      : parseInt(req.query.supplierId, 10) || DEMO_SUPPLIER_ID;

    const { rows } = await pool.query(
      `${ORDER_SELECT} WHERE o.supplier_id = $1 ORDER BY o.created_at DESC`,
      [supplierId]
    );

    res.json(rows.map(formatOrder));
  } catch (err) {
    console.error('GET /orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ─────────────────────────────────────────────────────────────
//  GET /api/orders/:id
// ─────────────────────────────────────────────────────────────

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `${ORDER_SELECT} WHERE o.id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(formatOrder(rows[0]));
  } catch (err) {
    console.error('GET /orders/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// ─────────────────────────────────────────────────────────────
//  POST /api/orders
// ─────────────────────────────────────────────────────────────

/**
 * Creates a new order + commodity in a single transaction.
 *
 * Body shape (from RouteSummaryScreen.js):
 * {
 *   pickupLocation, dropLocation, pickupDate,
 *   transportType, deliveryType, deliveryDeadline?,
 *   estimatedDistanceKm?, estimatedTimeHrs?,   ← NEW fields from distance calc
 *   commodity: {
 *     name, type, weightTons,                  ← app sends weightTons
 *     lengthCm?, widthCm?, heightCm?
 *   }
 * }
 *
 * Note: The app sends `weightTons`. We convert → kg before storing.
 */
router.post('/', optionalAuth, async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      pickupLocation,
      dropLocation,
      pickupDate,
      transportType,
      deliveryType         = 'non_timed',
      deliveryDeadline,
      estimatedDistanceKm,
      estimatedTimeHrs,
      commodity,
    } = req.body;

    // ── Validation ─────────────────────────────────────────────
    if (!pickupLocation || !dropLocation || !pickupDate) {
      return res.status(400).json({
        error: 'pickupLocation, dropLocation, and pickupDate are required',
      });
    }
    if (deliveryType === 'timed' && !deliveryDeadline) {
      return res.status(400).json({
        error: 'deliveryDeadline is required for timed delivery',
      });
    }

    // ── Resolve supplier ────────────────────────────────────────
    const supplierId = req.user?.id
      ? parseInt(req.user.id, 10)
      : DEMO_SUPPLIER_ID;

    // ── Transaction ─────────────────────────────────────────────
    await client.query('BEGIN');

    const orderResult = await client.query(
      `INSERT INTO orders (
         supplier_id, pickup_location, drop_location, pickup_date,
         transport_type, delivery_type, delivery_deadline,
         estimated_distance_km, estimated_time_hrs, status
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending')
       RETURNING *`,
      [
        supplierId,
        pickupLocation,
        dropLocation,
        pickupDate,
        transportType        || null,
        deliveryType,
        deliveryDeadline     || null,
        estimatedDistanceKm  || null,
        estimatedTimeHrs     || null,
      ]
    );
    const order = orderResult.rows[0];

    // Insert commodity if provided
    // The app sends `weightTons` — convert to kg (×1000) before storing.
    if (commodity?.name) {
      const weightKg =
        commodity.weightKg
          ? parseFloat(commodity.weightKg)
          : parseFloat(commodity.weightTons || 0) * 1000;

      if (weightKg > 0) {
        await client.query(
          `INSERT INTO commodities
             (order_id, name, type, weight_kg, length_cm, width_cm, height_cm)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [
            order.id,
            commodity.name,
            commodity.type    || 'bulk',
            weightKg,
            commodity.lengthCm || null,
            commodity.widthCm  || null,
            commodity.heightCm || null,
          ]
        );
      }
    }

    await client.query('COMMIT');

    // Return the full order with commodity joined
    const { rows } = await pool.query(`${ORDER_SELECT} WHERE o.id = $1`, [order.id]);
    res.status(201).json(formatOrder(rows[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('POST /orders error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

// ─────────────────────────────────────────────────────────────
//  PATCH /api/orders/:id
// ─────────────────────────────────────────────────────────────

router.patch('/:id', optionalAuth, async (req, res) => {
  const client = await pool.connect();
  try {
    const orderId = req.params.id;
    const {
      pickupLocation,
      dropLocation,
      pickupDate,
      transportType,
      deliveryType,
      deliveryDeadline,
      estimatedDistanceKm,
      estimatedTimeHrs,
      commodity,
    } = req.body;

    await client.query('BEGIN');

    const updates = [];
    const values  = [];
    let   i       = 1;

    if (pickupLocation       !== undefined) { updates.push(`pickup_location = $${i++}`);        values.push(pickupLocation); }
    if (dropLocation         !== undefined) { updates.push(`drop_location = $${i++}`);          values.push(dropLocation); }
    if (pickupDate           !== undefined) { updates.push(`pickup_date = $${i++}`);            values.push(pickupDate); }
    if (transportType        !== undefined) { updates.push(`transport_type = $${i++}`);         values.push(transportType); }
    if (deliveryType         !== undefined) { updates.push(`delivery_type = $${i++}`);          values.push(deliveryType); }
    if (deliveryDeadline     !== undefined) { updates.push(`delivery_deadline = $${i++}`);      values.push(deliveryDeadline); }
    if (estimatedDistanceKm  !== undefined) { updates.push(`estimated_distance_km = $${i++}`); values.push(estimatedDistanceKm); }
    if (estimatedTimeHrs     !== undefined) { updates.push(`estimated_time_hrs = $${i++}`);    values.push(estimatedTimeHrs); }

    if (updates.length > 0) {
      updates.push('updated_at = NOW()');
      values.push(orderId);
      await client.query(
        `UPDATE orders SET ${updates.join(', ')} WHERE id = $${i}`,
        values
      );
    }

    if (commodity) {
      const existing = await client.query(
        'SELECT id FROM commodities WHERE order_id = $1 LIMIT 1',
        [orderId]
      );

      const weightKg = commodity.weightKg
        ? parseFloat(commodity.weightKg)
        : commodity.weightTons ? parseFloat(commodity.weightTons) * 1000 : null;

      if (existing.rows.length > 0) {
        await client.query(
          `UPDATE commodities SET
             name      = COALESCE($1, name),
             type      = COALESCE($2, type),
             weight_kg = COALESCE($3, weight_kg),
             length_cm = $4,
             width_cm  = $5,
             height_cm = $6
           WHERE order_id = $7`,
          [commodity.name, commodity.type, weightKg,
           commodity.lengthCm ?? null, commodity.widthCm ?? null, commodity.heightCm ?? null,
           orderId]
        );
      } else if (commodity.name && weightKg) {
        await client.query(
          `INSERT INTO commodities
             (order_id, name, type, weight_kg, length_cm, width_cm, height_cm)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [orderId, commodity.name, commodity.type || 'bulk', weightKg,
           commodity.lengthCm || null, commodity.widthCm || null, commodity.heightCm || null]
        );
      }
    }

    await client.query('COMMIT');

    const { rows } = await pool.query(`${ORDER_SELECT} WHERE o.id = $1`, [orderId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(formatOrder(rows[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('PATCH /orders/:id error:', err);
    res.status(500).json({ error: 'Failed to update order' });
  } finally {
    client.release();
  }
});

// ─────────────────────────────────────────────────────────────
//  PATCH /api/orders/:id/status  ← NEW
// ─────────────────────────────────────────────────────────────

/**
 * Moves an order through its status lifecycle.
 * Body: { status: 'accepted' | 'in_transit' | 'delivered' | 'completed' | 'cancelled' }
 */
router.patch('/:id/status', optionalAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'accepted', 'in_transit', 'delivered', 'completed', 'cancelled'];

    if (!valid.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${valid.join(', ')}` });
    }

    const { rows } = await pool.query(
      `UPDATE orders SET status = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(formatOrder(rows[0]));
  } catch (err) {
    console.error('PATCH /orders/:id/status error:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// ─────────────────────────────────────────────────────────────
//  DELETE /api/orders/:id  ← NEW
// ─────────────────────────────────────────────────────────────

router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM orders WHERE id = $1',
      [req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /orders/:id error:', err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router;
