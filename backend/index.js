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

// City Schema
const citySchema = new mongoose.Schema({
  locality: String,
  aqi: Number,
  so2: Number,
  co: Number,
  no2: Number,
  pm25: Number,
  pm10: Number,
  o3: Number,
}, { collection: 'City_Table' });

const City = mongoose.model('City', citySchema); // Capitalized model name

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

// Pollutant Schema
const pollutantSchema = new mongoose.Schema({
  locality: String,
  aqi: Number,
  so2: Number,
  co: Number,
  no2: Number,
  pm25: Number,
  pm10: Number,
  o3: Number,
  timestamp: { type: Date, default: Date.now },
}, { collection: 'Pollucity' });

const Pollution = mongoose.model('Pollucity', pollutantSchema);

// API Route to fetch all pollution data
app.get('/data', async (req, res) => {
  try {
    const data = await Pollution.find(); // Retrieve all data from the 'pollutant' collection
    res.json(data);
    // console.log("Fetched data:", data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// Endpoint to get AQI data
app.get('/api/aqi', async (req, res) => {
  try {
    const data = await AQI.find().sort({ aqi: -1 }); // Sorted by AQI in descending order
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching AQI data' });
  }
});

// Endpoint to get AQI data from Metro Cities
app.get('/api/city', async (req, res) => {
  try {
    const data = await City.find().sort({ aqi: -1 });
    res.status(200).json(data);
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

// Endpoint to get AQI data for a specific locality
app.get('/api/aqi/:locality', async (req, res) => {
  try {
    const localityData = await AQI.findOne({ locality: req.params.locality });
    if (!localityData) {
      return res.status(404).json({ error: 'Locality not found' });
    }
    res.json(localityData);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching locality data' });
  }
});

// Endpoint to get AQI data for a specific locality in the City Table
app.get('/api/city/:locality', async (req, res) => {
  try {
    const localityData = await City.findOne({ locality: req.params.locality });
    if (!localityData) {
      return res.status(404).json({ error: 'Locality not found' });
    }
    res.json(localityData);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching locality data' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
