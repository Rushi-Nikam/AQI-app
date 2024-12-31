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
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
      } catch (error) {
        console.error("Error fetching gases:", error);
      }
    };
    fetchGases();
  }, []);

  return (
    <div className={`flex  flex-col items-center text-center justify-center min-h-screen p-4 rounded`}>
    <h1 className="text-3xl font-bold mb-6">Next 5 Days Prediction</h1>
    {data.map((item, index) => (
      
      <div
        key={index}
        onMouseEnter={() => setHoveredIndex(index)} 
        onMouseLeave={() => setHoveredIndex(null)} 
        className={`relative cursor-pointer flex flex-col sm:flex-row items-center justify-between ${isdarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-400"} shadow-lg p-6 m-4 w-[90%] sm:w-[80%] lg:w-[64%] rounded-lg border-2`}
      >
      {/* <Link  to={`/detail/${item.AQI}`}> */}
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
  
        {/* Popup for additional details */}
        {hoveredIndex === index && (
          <div
            className={`absolute top-full left-1/2 transform -translate-x-1/2 lg:left-auto lg:transform-none lg:ml-[870px] lg:mt-[-50px] p-4 rounded-lg shadow-lg border-2 ${
              isdarkMode ? "bg-gray-700 text-gray-200 border-gray-500" : "bg-white text-gray-800 border-gray-300"
            }`}
            style={{ zIndex: 1000 }}
          >
           <div
  style={{ zIndex: 1000 }}
>
  <div className="p-4">
    <table className="table-auto w-full border-collaps border-none">
      <thead>
        <tr>
          <th className=" px-4 py-2">Parameter</th>
          <th className=" px-4 py-2">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className=" px-4 py-2">PM10</td>
          <td className=" px-4 py-2">{item.pm10 || "12"}</td>
        </tr>
        <tr>
          <td className=" px-4 py-2">PM2.5</td>
          <td className=" px-4 py-2">{item.pm2_5 || "22"}</td>
        </tr>
        <tr>
          <td className=" px-4 py-2">NO2</td>
          <td className=" px-4 py-2">{item.no2 || "31"}</td>
        </tr>
        <tr>
          <td className=" px-4 py-2">SO2</td>
          <td className=" px-4 py-2">{item.so2 || "43.1"}</td>
        </tr>
        <tr>
          <td className=" px-4 py-2">NH3</td>
          <td className=" px-4 py-2">{item.nh3 || "34"}</td>
        </tr>
        <tr>
          <td className=" px-4 py-2">Temperature</td>
          <td className=" px-4 py-2">{item.temperature || "26.21"}°C</td>
        </tr>
        <tr>
          <td className=" px-4 py-2">Humidity</td>
          <td className=" px-4 py-2">{item.humidity || "34"}%</td>
        </tr>
        <tr>
          <td className=" px-4 py-2">O3</td>
          <td className=" px-4 py-2">{item.o3 || "40"}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
          </div>
        )}
      {/* </Link> */}
      </div>
    ))}
  </div>
  
  );
};

export default Predict;
