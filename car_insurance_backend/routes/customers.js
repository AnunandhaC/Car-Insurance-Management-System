const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM customers', (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { name, email, phone } = req.body;
  db.query('INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)', [name, email, phone], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB insert error', error: err });
    res.json({ message: 'Customer added', customer_id: result.insertId });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params; // id corresponds to customer_id
  const { name, email, phone } = req.body;
  db.query('UPDATE customers SET name=?, email=?, phone=? WHERE customer_id=?', [name, email, phone, id], err => {
    if (err) return res.status(500).json({ message: 'DB update error', error: err });
    res.json({ message: 'Customer updated' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params; // id corresponds to customer_id
  db.query('DELETE FROM customers WHERE customer_id=?', [id], err => {
    if (err) return res.status(500).json({ message: 'DB delete error', error: err });
    res.json({ message: 'Customer deleted' });
  });
});

module.exports = router;