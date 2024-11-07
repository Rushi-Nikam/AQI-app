// Assuming you have mongoose already set up
import mongoose from 'mongoose';

// Define the gases schema
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
  }
}, { collection: 'gases' });

const Gas = mongoose.model('Gas', gasSchema);
