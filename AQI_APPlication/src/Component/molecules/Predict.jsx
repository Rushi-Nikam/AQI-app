import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Function to format timestamp
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toDateString(); // Format: e.g., "Mon Dec 23 2024"
};

const getIndicatorColor = (AQI) => {
  if (AQI <= 50) return "green";
  if (AQI <= 100) return "yellow";
  if (AQI <= 150) return "orange";
  if (AQI <= 200) return "red";
  if (AQI <= 300) return "purple";
  return "maroon"; // Hazardous
};

const Predict = ({ isdarkMode }) => {
  const [data, setData] = useState([]);

  // Function to fetch data
  useEffect(() => {
    const fetchGases = async () => {
      try {
        const response = await fetch(
          `http://34.30.30.232:8000/aqi_values/predict_next_5_days/` // Replace with your actual API URL
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch gases data: ${response.status}`);
        }
        const data = await response.json();
        setData(data); 
        // console.log({data})// Set fetched data to state
        // console.log("Fetched data:", data);
      } catch (error) {
        console.error("Error fetching gases:", error);
      }
    };
    fetchGases();
  }, []);

  return (
    <div className={`flex flex-col items-center text-center justify-center min-h-screen rounded`}>
      <h1 className="text-3xl font-bold mb-6 rounded">Next 5 Days Prediction</h1>
      {data.map((item, index) => (
        <Link
          key={index}
          to={`/detail/${item.AQI}`}  // Add the specific detail page route
          className={`flex flex-col sm:flex-row items-center justify-between ${isdarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-400"} shadow-lg p-6 m-4 w-[90%] sm:w-[80%] lg:w-[70%] rounded-lg border-2`}
        >
          <div className={`font-medium ${isdarkMode ? "text-gray-300" : "text-gray-700"}`}>
            <div className="text-lg">{formatTime(item.Timestamp)}</div>
          </div>
          <div className={`font-medium ${isdarkMode ? "text-gray-300" : "text-gray-700"}`}>
            <div className="text-lg flex flex-col text-center items-center">
              <span className="font-bold">Indicator:</span>
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: getIndicatorColor(item.AQI) }}
              ></div>
            </div>
          </div>
          <div className={`font-medium ${isdarkMode ? "text-gray-300" : "text-gray-700"}`}>
            <div className="text-lg flex flex-col">
              <div className="font-bold">AQI:</div> {Math.round(Math.floor(item.AQI))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Predict;
