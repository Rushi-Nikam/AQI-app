import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const AQIChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchAQIData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/city'); // Replace with your API endpoint
        const data = await response.json();

        // Prepare data for the chart
        const labels = data.map((item) => item.locality); // Locality names
        const aqiValues = data.map((item) => item.aqi); // AQI values

        // Render Chart
        const ctx = chartRef.current.getContext('2d');
        new Chart(ctx, {
          type: 'line', // Change to 'line', 'pie', etc., as needed
          data: {
            labels,
            datasets: [
              {
                label: 'Air Quality Index (AQI)',
                data: aqiValues,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
              },
              tooltip: {
                enabled: true,
              },
            },
          },
        });
      } catch (error) {
        console.error('Error fetching AQI data:', error);
      }
    };

    fetchAQIData();
  }, []);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default AQIChart;
