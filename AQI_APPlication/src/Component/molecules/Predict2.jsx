import React, { useEffect, useState } from "react";

const Predict2 = ({ isdarkMode }) => {
  const [aqiData, setAqiData] = useState([]);

  const dummyData = [
    { date: "2025-02-10", category: "Good", aqi: 50 },
    { date: "2025-02-11", category: "Moderate", aqi: 100 },
    { date: "2025-02-12", category: "Unhealthy", aqi: 250 },
    { date: "2025-02-13", category: "Good", aqi: 40 },
    { date: "2025-02-14", category: "Moderate", aqi: 80 },
  ];

  useEffect(() => {
    const fetchAqiData = async () => {
      try {
        const response = await fetch(
          `http://34.30.30.232:8000/aqi_values/predict_next_5_days/`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const apiData = await response.json();
        setAqiData(apiData);
      } catch (error) {
        console.error("Error fetching AQI data:", error);
        setAqiData(dummyData);
      }
    };
    fetchAqiData();
  }, []);

  const getStrokeDasharray = (aqi) => {
    const maxAqi = 500;
    return (aqi / maxAqi) * 251.2;
  };

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return "#00b050";
    if (aqi <= 100) return "#92d050";
    if (aqi <= 200) return "#ffff00";
    if (aqi <= 300) return "#ff9900";
    if (aqi <= 400) return "#ff0000";
    return "#c00000";
  };

  return (
    <div className="p-6 dark:bg-gray-900">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
        Predicted AQI Levels for Next 5 Days
      </h2>

      {/* Horizontal scroll with snapping and custom scrollbar */}
      <div className="overflow-x-auto flex space-x-6 p-2 scroll-smooth snap-x snap-mandatory overflow-y-hidden [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-track]:bg-gray-200 dark:[&::-webkit-scrollbar-track]:bg-gray-800 rounded-md">
        {aqiData.map((data, index) => (
          <div
            key={index}
            className="flex-shrink-0 snap-center flex flex-col items-center p-6 bg-gradient-to-r shadow-2xl rounded-xl w-52 transform transition-transform duration-300 hover:scale-105"
          >
            <svg width="90" height="90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="gray"
                strokeWidth="5"
                fill="none"
                opacity="0.3"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={getAqiColor(data.aqi)}
                strokeWidth="5"
                fill="none"
                strokeDasharray={`${getStrokeDasharray(data.aqi)} 251.2`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
                className="transition-all duration-500"
              />
              {/* AQI value inside circle */}
              <text
                x="50"
                y="55"
                textAnchor="middle"
                fontSize="22"
                fill={isdarkMode ? "white" : "black"}
                fontWeight="bold"
              >
                {data.aqi}
              </text>
            </svg>
            <p
              className={`${
                isdarkMode ? "text-white" : "text-gray-500"
              } mt-3 text-center text-xl font-semibold`}
            >
              {data.category} Air
            </p>
            <p
              className={`${
                isdarkMode ? "text-white" : "text-gray-500"
              } mt-2 text-sm`}
            >
              {data.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Predict2;
