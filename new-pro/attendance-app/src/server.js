const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all origins or specify your React app's URL
app.use(cors({
  origin: 'http://localhost:3000', // React app's URL
  methods: 'GET,POST,PUT,DELETE',
  credentials: true, // Include cookies if needed
}));

// Example API route
app.get('/api/data', (req, res) => {
  res.json({ message: 'CORS enabled for React app!' });
});

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
