const express = require('express');
const cors = require('cors');

const authRoutes      = require('./routes/auth');
const loadsRoutes     = require('./routes/loads');
const trucksRoutes    = require('./routes/trucks');
const matchingRoutes  = require('./routes/matching');
const shipmentsRoutes = require('./routes/shipments');
const trackingRoutes  = require('./routes/tracking');
const adminRoutes     = require('./routes/admin');
const driversRoutes   = require('./routes/drivers');
const businessAnalyticsRoutes = require('./routes/business-analytics');
const transportAnalyticsRoutes = require('./routes/transport-analytics');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',      authRoutes);
app.use('/api/loads',     loadsRoutes);
app.use('/api/trucks',    trucksRoutes);
app.use('/api/matching',  matchingRoutes);
app.use('/api/shipments', shipmentsRoutes);
app.use('/api/tracking',  trackingRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/drivers',   driversRoutes);
app.use('/api/business',  businessAnalyticsRoutes);
app.use('/api/transport', transportAnalyticsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'ZeroEmpty API', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`🚛 ZeroEmpty API running on http://localhost:${PORT}`);
});
