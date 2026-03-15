const express = require('express');
const { users } = require('../mock-db');

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// GET /api/auth/users (for admin)
router.get('/users', (req, res) => {
  res.json(users.map(({ password, ...u }) => u));
});

module.exports = router;
