import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

// Function to get color based on AQI value
const getAqiColor = (value) => {
  if (value <= 50) return "rgb(76, 175, 80)"; // Good
  if (value <= 100) return "rgb(255, 235, 59)"; // Moderate
  if (value <= 200) return "rgb(255, 152, 0)"; // Unhealthy for Sensitive Groups
  if (value <= 300) return "rgb(244, 67, 54)"; // Unhealthy
  if (value <= 400) return "rgb(156, 39, 176)"; // Very Unhealthy
  return "rgb(139, 0, 0)"; // Hazardous
};

const LiveAQI = ({ isdarkMode }) => {
  const [hourlyAQI, setHourlyAQI] = useState(null);

  // Dummy data for fallback (24 hours of AQI data for Pune)
  const dummyData = Array.from({ length: 24 }, (_, index) => ({
    AQI: Math.floor(Math.random() * 150) + 50, // Random AQI between 50 and 200
    location: "Pune",
    timestamp: new Date(Date.now() - index * 3600000).toISOString(), // Each entry is 1 hour apart
  })).reverse(); // Oldest first, latest last

  useEffect(() => {
    // Fetching live AQI data (API call)
    const fetchHourlyAQI = async () => {
      try {
        const response = await fetch(
          `http://34.30.30.232:8000/aqi_values/24_hours/` // Updated API endpoint
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch live AQI data: ${response.status}`);
        }
        const data = await response.json();
        setHourlyAQI(data);
      } catch (error) {
        console.error("Error fetching live AQI:", error);
        // Fallback to dummy data in case of an error
        setHourlyAQI(dummyData);
      }
    };

    fetchHourlyAQI();
  }, []);

  if (!hourlyAQI) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div
      className={`${
        isdarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
      } p-6 h-[500px]`}
    >
      <h1 className="text-3xl font-bold text-center mb-8">
        24-Hour Air Quality Index
      </h1>

      {/* Container for horizontal scroll */}
      <div className="overflow-x-auto">
        <div className="flex space-x-6">
          {hourlyAQI.map((item, index) => (
            <NavLink
              key={index}
              to="/pre"
              className={`flex flex-col items-center justify-center border-2 rounded-lg shadow-lg p-6 ${
                isdarkMode
                  ? "bg-gray-700 border-gray-500"
                  : "bg-gray-200 border-gray-300"
              }`}
            >
              {/* SVG Circle for AQI */}
              <div className="relative w-32 h-32">
                <svg width="100%" height="100%" viewBox="0 0 120 120">
                  {/* Background circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={
                      isdarkMode
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(0, 0, 0, 0.1)"
                    }
                    strokeWidth="10"
                  />

                  {/* Progress circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={getAqiColor(item.AQI)} // Dynamic color based on AQI value
                    strokeWidth="10"
                    strokeDasharray="314"
                    strokeDashoffset={314 - (item.AQI / 500) * 314} // Max value is 500
                    style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-semibold">
                  {item.AQI}
                </div>
              </div>

              <p className="mt-4 text-center">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveAQI;
