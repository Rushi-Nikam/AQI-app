import React, { useEffect, useState } from "react";
import GasCard from "./GasCard";

const GasesTable = ({ isDarkMode }) => {
  const [value, setValue] = useState([]);
  const AQI_ENDPOINT = import.meta.env.VITE_AQI_ENDPOINT;

  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      try {
        const response = await fetch(`${AQI_ENDPOINT}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setValue(data.Bus_data); // Assuming `data.Bus_data` contains the necessary gas information
      } catch (error) {
        console.error("Error fetching AQI data:", error);
      }
    };

    // fetchData();
    intervalId = setInterval(fetchData, 3000);


    return () => {
      clearInterval(intervalId);
    };
  }, [AQI_ENDPOINT]);

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
    <div className="cursor-pointer gap-4">
      <div className="flex justify-center items-center text-2xl font-bold my-10">
        <h1>Gases Responsible for Air Quality Index</h1>
      </div>

<div
        className={`grid grid-cols-1   sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6  h-[10px] mb-[200px] rounded-lg  ${
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
