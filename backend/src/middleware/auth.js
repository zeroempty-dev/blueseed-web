/**
 * auth.js — JWT verification middleware (Order Service)
 *
 * Reads the Bearer token from the Authorization header, verifies it,
 * and attaches req.user = { id, email } for downstream route handlers.
 *
 * Usage:
 *   router.get('/protected', auth, (req, res) => { ... })
 *
 * If the token is missing the middleware still calls next() but does NOT
 * attach req.user — this allows optional-auth routes (e.g. the demo mode
 * that falls back to DEMO_SUPPLIER_ID) to keep working during the JWT
 * migration period.
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'zeroempty_dev_secret_change_in_prod';

/**
 * requireAuth  — hard gate. Returns 401 if no valid token.
 */
function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * optionalAuth  — soft gate. Attaches req.user if a valid token is present
 *                 but does NOT block requests without one.
 *                 Used during migration to keep demo mode working.
 */
function optionalAuth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = { id: payload.sub, email: payload.email };
    } catch {
      // invalid token — ignore, continue as unauthenticated
    }
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
