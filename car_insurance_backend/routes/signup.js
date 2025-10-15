/*const express = require('express');
const router = express.Router();
const db = require('../db');

// Register a new customer
router.post('/', (req, res) => {
  const { name, email, password, phone, address } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email, and password are required.' });

  // Check if email already exists in users table
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (results.length > 0)
      return res.status(400).json({ message: 'Email already registered' });

    // Step 1: Insert into users table first
    const userQuery =
      'INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, "customer", ?, ?)';
    db.query(userQuery, [name, email, password, phone || null, address || null], (err2, userResult) => {
      if (err2) return res.status(500).json({ message: 'User insert failed', error: err2 });

      // Get the auto-generated user_id from users table
      const userId = userResult.insertId;

      // Step 2: Insert into customers table
       const customerQuery = `
        INSERT INTO customers (name, email, phone, address)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(customerQuery, [name, email, phone || null, address || null], (err3) => {
        if (err3) return res.status(500).json({ message: 'Customer insert failed', error: err3 });

        res.json({ message: 'Customer registered successfully!' });
    });
});
  });
});*/

//module.exports = router;*/
const express = require('express');
const router = express.Router();
const db = require('../db'); // adjust path if needed

// Register a new customer
router.post('/', (req, res) => {
  const { name, email, password, phone, address } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email, and password are required.' });

  // Check if email already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (results.length > 0)
      return res.status(400).json({ message: 'Email already registered' });

    // Insert new customer
    db.query(
      'INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, "customer", ?, ?)',
      [name, email, password, phone || null, address || null],
      (err2) => {
        if (err2) return res.status(500).json({ message: 'Insert error', error: err2 });
        res.json({ message: 'Customer registered successfully' });
      }
    );
  });
});

module.exports = router;
