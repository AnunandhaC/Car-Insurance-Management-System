const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ GET all agents with user info
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      a.agent_id,
      a.user_id,
      a.total_customers,
      u.name,
      u.email
    FROM agents a
    JOIN users u ON a.user_id = u.user_id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Failed to fetch agents', error: err });
    }
    res.json(results);
  });
});

// ✅ POST new agent (auto-create user if needed)
router.post('/', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  // Check if the user already exists
  db.query('SELECT user_id FROM users WHERE email = ?', [email], (err, users) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });

    if (users.length > 0) {
      // User already exists
      const userId = users[0].user_id;
      insertAgent(userId, res);
    } else {
      // Create a new user with role = 'agent'
      const insertUser = 'INSERT INTO users (name, email, role) VALUES (?, ?, "agent")';
      db.query(insertUser, [name, email], (err2, result) => {
        if (err2) return res.status(500).json({ message: 'User insert error', error: err2 });
        insertAgent(result.insertId, res);
      });
    }
  });
});

// Helper to insert agent record
function insertAgent(userId, res) {
  const sql = 'INSERT INTO agents (user_id, total_customers) VALUES (?, 0)';
  db.query(sql, [userId], (err) => {
    if (err) return res.status(500).json({ message: 'Agent insert error', error: err });
    res.json({ message: 'Agent added successfully' });
  });
}

// ✅ PUT update agent
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email)
    return res.status(400).json({ message: 'Name and email are required.' });

  // Update the user linked to the agent
  const sql = `
    UPDATE users 
    SET name = ?, email = ?
    WHERE user_id = (SELECT user_id FROM agents WHERE agent_id = ?)
  `;
  db.query(sql, [name, email, id], (err) => {
    if (err) return res.status(500).json({ message: 'Agent update error', error: err });
    res.json({ message: 'Agent updated successfully' });
  });
});

// ✅ DELETE agent (optionally, also delete user if needed)
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM agents WHERE agent_id = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Agent delete error', error: err });
    res.json({ message: 'Agent deleted successfully' });
  });
});

module.exports = router;
