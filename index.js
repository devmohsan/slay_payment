require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Set EJS as viewing engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes Integration
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

// View Routes
app.get('/', (req, res) => {
  res.render('payment', { 
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY 
  });
});

app.get('/success', (req, res) => {
  res.render('success');
});

// Start Server
app.listen(port, () => {
    console.log(`
  🚀 SlayPayment Server is up and running!
  📡 Listening on port: ${port}
  🔗 URL: http://localhost:${port}
  `);
});
