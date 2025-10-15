const express = require('express');
const router = express.Router();
const db = require('../db'); // Make sure this exports a MySQL connection

// GET all policies (optionally filter by vehicle_id)
router.get('/', (req, res) => {
  const vehicle_id = req.query.vehicle_id;
  let query = 'SELECT * FROM policies';
  const params = [];

  if (vehicle_id) {
    query += ' WHERE vehicle_id = ?';
    params.push(vehicle_id);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json(results);
  });
});

// POST add new policy
router.post('/', (req, res) => {
  const { vehicle_id, policy_type, start_date, end_date, premium, status } = req.body;

  // Validate
  if (!vehicle_id || !policy_type || !start_date || !end_date || !premium || !status) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `
    INSERT INTO policies 
    (vehicle_id, policy_type, start_date, end_date, premium, status) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [vehicle_id, policy_type, start_date, end_date, premium, status], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Failed to add policy', error: err.message });
    }
    res.json({ message: 'Policy added successfully', policy_id: result.insertId });
  });
});

module.exports = router;
