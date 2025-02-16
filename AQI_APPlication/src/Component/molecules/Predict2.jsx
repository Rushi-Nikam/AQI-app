import React, { useEffect, useState } from "react";

const Predict2 = () => {
  // State to hold AQI data fetched from API
  const [aqiData, setAqiData] = useState([]);

  // Dummy data for fallback
  const dummyData = [
    { date: "2025-02-10", category: "Good", aqi: 50 },
    { date: "2025-02-11", category: "Moderate", aqi: 100 },
    { date: "2025-02-12", category: "Unhealthy", aqi: 250 },
    { date: "2025-02-13", category: "Good", aqi: 40 },
    { date: "2025-02-14", category: "Moderate", aqi: 80 },
  ];

  // Fetch AQI data from API
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
        setAqiData(apiData); // Replace with actual API response if needed
      } catch (error) {
        console.error("Error fetching AQI data:", error);
        // Fallback to dummy data if fetch fails
        setAqiData(dummyData);
      }
    };
    fetchAqiData();
  }, []);

  const getStrokeDasharray = (aqi) => {
    const maxAqi = 300; // Max AQI for the circle progress
    const dasharray = (aqi / maxAqi) * 251.2; // 251.2 is the circumference of a circle with radius 40
    return dasharray;
  };

  return (
    <div className="p-6 dark:bg-gray-900">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
        Predicted AQI Levels for Next 5 Days
      </h2>
      <div className="flex space-x-6 overflow-x-auto justify-center">
        {/* Render AQI Data Cards */}
        {aqiData.map((data, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-6 bg-gradient-to-r shadow-2xl rounded-xl w-52 transform transition-transform duration-300 hover:scale-105"
          >
            {/* Circular AQI Indicator with Progress */}
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
                stroke={
                  data.category === "Good"
                    ? "green"
                    : data.category === "Moderate"
                    ? "yellow"
                    : "red"
                }
                strokeWidth="5"
                fill="none"
                strokeDasharray={`${getStrokeDasharray(data.aqi)} 251.2`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
                className="transition-all duration-500"
              />
              {/* AQI value inside the circle */}
              <text
                x="50"
                y="55"
                textAnchor="middle"
                fontSize="22"
                fill="black"
                fontWeight="bold"
              >
                {data.aqi}
              </text>
            </svg>
            <p className="mt-3 text-center text-xl text-gray-500 dark:text-gray-600 font-semibold">
              {data.category} Air
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {data.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Predict2;
