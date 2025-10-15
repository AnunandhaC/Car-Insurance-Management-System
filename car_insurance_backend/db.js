const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  //port: 3306,          // default MySQL port
  user: 'root',        // your MySQL username
  password: 'Anu@123**', // your MySQL password
  database: 'car_insurance1'
});

db.connect(err => {
  if (err) {
    console.error('❌ Connection error:', err);
  } else {
    console.log('✅ Connected to MySQL');
  }
});

module.exports = db;
