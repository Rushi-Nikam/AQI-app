import React, { useEffect, useState } from "react";
import GasCard from "./GasCard";

const GasesTable = ({ isDarkMode }) => {
  const [value, setValue] = useState([]);
  const AQI_ENDPOINT = import.meta.env.VITE_AQI_ENDPOINT;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${AQI_ENDPOINT}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        // const latestAQIValue = data.length > 0 ? Math.round(data[data.length - 1].value) : 'N/A';
        const sensor = data;
        setValue(sensor.Bus_data);
      } catch (error) {
        console.error("Error fetching AQI data:", error);
      }
    };

    fetchData();
  }, []);
  const gasData = [
    { title: "Humidity", value: value.humidity },
    { title: "Temperature", value: value.temperature },
    { title: "CO", value: value.mq7 },
    { title: "O₃", value: value.mq131 },
    { title: "PM2.5", value: value.pm25 },
    { title: "PM10", value: value.pm10 },
    { title: "NH3", value: value.nh3 },
    { title: "NO₂", value: value.no2 },
  ];

  return (
    <div className="cursor-pointer gap-2 ">
      <div className="flex justify-center text-2xl font-bold my-10">
        <h1>Gases Responsible for AQI Index</h1>
      </div>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:w-[1400px] h-auto mb-[200px]  rounded-lg ${
          isDarkMode ? "bg-gray-800 text-pink-800" : "bg-white text-gray-600"
        }`}
      >
        {gasData.map((gas, index) => (
          <GasCard
            key={index}
            value={gas.value}
            title={gas.title}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
};

export default GasesTable;
