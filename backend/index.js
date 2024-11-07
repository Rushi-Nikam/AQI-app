// index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

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

// Gases Schema
const gasSchema = new mongoose.Schema({
  name: String,
  label: String,
  unit: String,
  value: Number,
  range: {
    low: Number,
    high: Number,
  },
  index: {
    low: Number,
    high: Number,
  },
}, { collection: 'Gas' });

const Gas = mongoose.model('Gas', gasSchema);

// Endpoint to get AQI data
app.get('/api/aqi', async (req, res) => {
  try {
    const data = await AQI.find().sort({ aqi: -1 }); // Sorted by AQI in descending order
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching AQI data' });
  }
});

// Endpoint to get Gases data
app.get('/api/gases', async (req, res) => {
  try {
    const gasesData = await Gas.find();
    res.json(gasesData);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching gases data' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});