// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = require('./db'); // Ensure db.js exports your MySQL connection

// Import routes
const customerRoutes = require('./routes/customers');
const carRoutes = require('./routes/cars');
const policyRoutes = require('./routes/policies');
const claimRoutes = require('./routes/claims');
const loginRoutes = require('./routes/login');
const paymentRoutes = require('./routes/payments'); // ✅ New route
const signupRoutes = require('./routes/signup');
const agentRoutes = require('./routes/agents');


// Use routes
app.use('/api/customers', customerRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/payments', paymentRoutes); // ✅ Added
app.use('/api/signup', signupRoutes); 
app.use('/api/agents', agentRoutes);



// Root test route
app.get('/', (req, res) => res.send('🚗 Car Insurance API is running'));

// Connect to DB and start server
db.connect(err => {
  if (err) {
    console.error('❌ MySQL Connection Failed:', err);
    process.exit(1); // Stop server if DB fails
  }
  console.log('✅ Connected to MySQL');

  const PORT = 5000;
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
});
