// routes/login.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    if (result.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = result[0];
    res.json({
      message: 'Login successful',
      role: user.role,
      user_id: user.user_id, // matches your DB
      user
    });
  });
});

module.exports = router;
