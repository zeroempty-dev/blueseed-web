/**
 * ZeroEmpty — Order Service  (port 4002)
 * ========================================
 * Handles orders, commodities, fleet / vehicle types, and bookings.
 *
 * Routes:
 *  GET  /api/health
 *  GET  /api/orders
 *  GET  /api/orders/:id
 *  POST /api/orders
 *  PATCH /api/orders/:id
 *  PATCH /api/orders/:id/status
 *  DELETE /api/orders/:id
 *  GET  /api/fleet/types
 *  GET  /api/fleet/vehicles
 *  POST /api/fleet/vehicles
 *  PATCH /api/fleet/vehicles/:id
 *  DELETE /api/fleet/vehicles/:id
 *  GET  /api/bookings
 *  POST /api/bookings
 *  PATCH /api/bookings/:id/status
 */

const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const ordersRouter = require('./routes/orders');
const fleetRouter  = require('./routes/fleet');

const app  = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

// ── Health check ───────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'zeroempty-order-service', port: PORT });
});

// ── Domain routers ─────────────────────────────────────────────
app.use('/api/orders',   ordersRouter);
app.use('/api/fleet',    fleetRouter);
app.use('/api/bookings', fleetRouter); // bookings sit in fleet router

// ── 404 catch-all ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ───────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`ZeroEmpty Order Service running on http://localhost:${PORT}`);
});
