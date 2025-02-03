import React, { useEffect, useState } from "react";
import GreenImage from "../../../public/Images/1.png";
import YellowImage from "../../../public/Images/2.png";
import OrangeImage from "../../../public/Images/3.png";
import RedImage from "../../../public/Images/4.png";

// Function to format timestamp for next hour
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString(); // Format: e.g., "Mon Dec 23 2024, 14:00 PM"
};

// Function to get the color indicator based on the value
const getIndicatorColor = (value) => {
  if (value <= 50) return <img src={GreenImage} alt="Green Indicator" className="w-12 h-20" />;
  if (value <= 100) return <img src={YellowImage} alt="Yellow Indicator" className="w-12 h-20" />;
  if (value <= 150) return <img src={OrangeImage} alt="Orange Indicator" className="w-12 h-20" />;
  if (value <= 200) return <img src={RedImage} alt="Red Indicator" className="w-12 h-20" />;
  if (value <= 300) return <div className="w-12 h-12 bg-purple-500 rounded-full"></div>;
  return <div className="w-12 h-12 bg-maroon-700 rounded-full"></div>;
};

const NextHourAQI = ({ isdarkMode }) => {
  const [forecastData, setForecastData] = useState([]);

  // Dummy data for fallback (Next hour's forecast)
  const dummyForecastData = [
    {
      Timestamp: Date.now() + 60 * 60 * 1000, // One hour ahead
      AQI: 100,
      pm10: 45,
      pm2_5: 25,
      no2: 18,
      so2: 14,
      nh3: 11,
      temperature: 30,
      humidity: 50,
      o3: 35,
    },
  ];

  useEffect(() => {
    const fetchNextHourAQI = async () => {
      try {
        const response = await fetch(`http://34.30.30.232:8000/aqi_values/next_hour/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch AQI forecast: ${response.status}`);
        }
        const apiData = await response.json();
        setForecastData(apiData);
      } catch (error) {
        console.error("Error fetching next hour AQI:", error);
        // Fallback to dummy forecast data in case of an error
        setForecastData(dummyForecastData);
      }
    };
    fetchNextHourAQI();
  }, []);

  const parameters = [
    { key: "AQI", label: "AQI" },
    { key: "pm10", label: "PM10" },
    { key: "pm2_5", label: "PM2.5" },
    { key: "no2", label: "NO2" },
    { key: "so2", label: "SO2" },
    { key: "nh3", label: "NH3" },
    { key: "temperature", label: "Temperature", unit: "°C" },
    { key: "humidity", label: "Humidity", unit: "%" },
    { key: "o3", label: "O3" },
  ];

  return (
    <div className="flex flex-col items-center text-center justify-center">
      <h1 className="text-4xl font-bold">Next Hour Air Quality Forecast</h1>
      {forecastData.map((item, index) => (
        <div
          key={index}
          className="relative w-[90%] sm:w-[80%] lg:w-[60%] my-6 rounded-lg p-4"
        >
          <div className="text-xl font-semibold mb-6">
            Forecast Time: {formatTime(item.Timestamp)}
          </div>
          <div className="flex flex-col gap-4">
            {parameters.map((param, i) => (
              <div
                key={i}
                className={`${
                  param.key === "AQI"
                    ? "bg-gray-600 text-white"
                    : isdarkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-200 text-gray-800"
                } p-4 rounded-lg shadow-md flex items-center justify-between gap-4`}
              >
                <div className="text-xl font-medium w-2/5">{param.label}</div>
                <div className="flex items-center justify-center w-16 h-16">
                  {getIndicatorColor(item[param.key])}
                </div>
                <div className="text-xl font-medium text-right w-1/5">
                  {item[param.key]}
                  {param.unit ? ` ${param.unit}` : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NextHourAQI;
