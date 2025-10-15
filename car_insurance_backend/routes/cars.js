// routes/cars.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET cars by customer_id
router.get('/', (req, res) => {
  const customer_id = req.query.customer_id;
  let query = 'SELECT * FROM vehicles';
  const params = [];

  if (customer_id) {
    query += ' WHERE customer_id = ?';
    params.push(customer_id);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json(results);
  });
});

// POST add new car
router.post('/', (req, res) => {
  const { customer_id, model, registration_number, year } = req.body;

  if (!customer_id || !model || !registration_number || !year) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'INSERT INTO vehicles (customer_id, model, reg_number, year) VALUES (?, ?, ?, ?)';
  db.query(query, [customer_id, model, registration_number, year], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Failed to add car', error: err.message });
    }
    res.json({ message: 'Car added successfully', vehicle_id: results.insertId });
  });
});

module.exports = router;
