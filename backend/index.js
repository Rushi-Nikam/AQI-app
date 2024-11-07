// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/AQI_data')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// AQI Schema
const aqiSchema = new mongoose.Schema({
    locality: String,
    aqi: Number,
    so2: Number,
    co: Number,
    no2: Number,
    pm25: Number,
    pm10: Number,
    o3: Number,
  }, { collection: 'AQI_Table' });

const AQI = mongoose.model('AQI', aqiSchema);

// API endpoint to get AQI data
app.get('/api/aqi', async (req, res) => {
  try {
    const data = await AQI.find().sort({ aqi: -1 }); // Sorted by AQI in descending order
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
