const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all payments
router.get('/', (req, res) => {
  db.query('SELECT * FROM payments ORDER BY payment_id DESC', (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(results);
  });
});

// POST add new payment
router.post('/', (req, res) => {
  const { policy_id, customer_id, payment_date, amount, method } = req.body;
  if (!policy_id || !customer_id || !payment_date || !amount || !method) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  db.query(
    'INSERT INTO payments (policy_id, customer_id, payment_date, amount, method) VALUES (?, ?, ?, ?, ?)',
    [policy_id, customer_id, payment_date, amount, method],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB insert error', error: err });
      res.json({ message: 'Payment added successfully', payment_id: result.insertId });
    }
  );
});

module.exports = router;
