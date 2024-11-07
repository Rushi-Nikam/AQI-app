import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AQIGraph = () => {
  // Predefined locations with AQI value set to null initially
  const predefinedLocations = [
    { location: 'Nigdi', aqi: null },
    { location: 'Wakad', aqi: null },
    { location: 'Hinjawadi', aqi: null },
    { location: 'Dehu', aqi: null },
    { location: 'Kothrud', aqi: null },
    { location: 'Shivajinagar', aqi: null },
    { location: 'Hadapsar', aqi: null },
    { location: 'Kharadi', aqi: null },
    { location: 'Undri', aqi: null },
    { location: 'Baner', aqi: null },
    { location: 'Shivajinagar', aqi: null },
    { location: 'Viman Nagar', aqi: null },
    { location: 'Wagholi', aqi: null },
    
  ];

  // State to hold the dynamic AQI data
  const [aqiData, setAqiData] = useState(predefinedLocations);

  // Function to determine the color based on AQI value
  const getColorByAQI = (aqi) => {
    if (aqi <= 50) return "#00e400"; // Good
    if (aqi <= 100) return "#ffff00"; // Moderate
    if (aqi <= 150) return "#ff7e00"; // Unhealthy for Sensitive Groups
    if (aqi <= 200) return "#ff0000"; // Unhealthy
    if (aqi <= 300) return "#7e0023"; // Very Unhealthy
    return "#800000"; // Hazardous
  };

  useEffect(() => {
    // Fetch AQI data from the API
    const fetchAQIData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:5000/api/aqi');
        const data = await response.json();

        // Map the database data with predefined locations based on locality
        const updatedData = predefinedLocations.map((location) => {
          // Find the matching locality from API data
          const match = data.find(item => item.locality === location.location); 
          return match ? { ...location, aqi: match.aqi } : location;
        });

        // Update the state with the fetched and matched AQI data
        setAqiData(updatedData);
      } catch (error) {
        console.error('Error fetching AQI data:', error);
      }
    };

    // Fetch AQI data when the component mounts
    fetchAQIData();
  }, []);

  // Prepare chart data
  const chartData = {
    labels: aqiData
      .filter((data) => data.aqi !== null) // Filter out the data where AQI is still null
      .map(data => data.location), // Locations for the chart labels
    datasets: [
      {
        label: 'AQI Value',
        data: aqiData
          .filter((data) => data.aqi !== null) // Only include data with a valid AQI value
          .map(data => data.aqi), // AQI values for the chart
        backgroundColor: aqiData
          .filter((data) => data.aqi !== null) // Only include data with a valid AQI value
          .map(data => getColorByAQI(data.aqi)), // Apply color based on AQI value
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
