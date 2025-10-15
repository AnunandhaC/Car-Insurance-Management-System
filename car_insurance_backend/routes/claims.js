const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all claims
router.get("/", (req, res) => {
  const query = "SELECT * FROM claims";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching claims:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

// POST add new claim
router.post("/", (req, res) => {
  const { policy_id, claim_date, amount, description } = req.body;
  if (!policy_id || !claim_date || !amount || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `
    INSERT INTO claims (policy_id, claim_date, amount, status, description)
    VALUES (?, ?, ?, 'pending', ?)
  `;

  db.query(query, [policy_id, claim_date, amount, description], (err, result) => {
    if (err) {
      console.error("Error adding claim:", err);
      return res.status(500).json({ message: "Failed to add claim" });
    }
    res.json({ message: "Claim added successfully", claim_id: result.insertId });
  });
});

module.exports = router;
