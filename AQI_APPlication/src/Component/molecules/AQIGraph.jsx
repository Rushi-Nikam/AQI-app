import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AQIGraph = () => {
  // AQI data from your markers
  const aqiData = [
    { location: 'Nigdi', aqiValue: 50, backgroundColor: "#00e400" },
    { location: 'Wakad', aqiValue: 150, backgroundColor: "#ff7e00" },
    { location: 'Hinjawadi', aqiValue: 200, backgroundColor: "#ff0000" },
    { location: 'Dehu', aqiValue: 300, backgroundColor: "#7e0023" },
    { location: 'Kothrud', aqiValue: 90, backgroundColor: "#ffff00" },
    { location: 'Shivajinagar', aqiValue: 120, backgroundColor: "#ffcc00" },
    { location: 'Hadapsar', aqiValue: 175, backgroundColor: "#ff7e00" },
    { location: 'Kharadi', aqiValue: 180, backgroundColor: "#ff7e00" },
    { location: 'Undri', aqiValue: 130, backgroundColor: "#ffcc00" },
    { location: 'Baner', aqiValue: 100, backgroundColor: "#ffff00" },
  ];

  // Prepare chart data
  const chartData = {
    labels: aqiData.map(data => data.location), // Location names
    datasets: [
      {
        label: 'AQI Value',
        data: aqiData.map(data => data.aqiValue), // AQI values
        backgroundColor: aqiData.map(data => data.backgroundColor), // AQI colors
        borderColor: '#333',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend if not needed
      },
      title: {
        display: true,
        text: 'Air Quality Index (AQI) Levels by Location',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 400, // Maximum AQI value for scaling
      },
    },
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default AQIGraph;
