import React, { useEffect, useState } from "react";
import GasCard from "./GasCard";
import { WiHumidity } from "react-icons/wi";
import { FaTemperatureHigh } from "react-icons/fa";
const GasesTable = ({ isDarkMode }) => {
  const [value, setValue] = useState({});
  const AQI_ENDPOINT = import.meta.env.VITE_AQI_ENDPOINT;

  useEffect(() => {
    let intervalId;
    const fetchData = async () => {
   
      try {
        const response = await fetch(`${AQI_ENDPOINT}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setValue(data.Bus_data || {}); // Use an empty object if `data.Bus_data` is undefined
      } catch (error) {
        console.error("Error fetching AQI data:", error);
      }
    };

    // fetchData();

    // Uncomment for periodic data fetching
     intervalId = setInterval(fetchData, 3000);
    return () =>{ clearInterval(intervalId);
      
    };
  }, [AQI_ENDPOINT]);

  const gasData = [
    // { title: "Humidity", value: value.humidity},
    // { title: "Temperature", value: value.temperature },
    { title: "CO(Carbon Monoxide)", value: value.mq7   },
    { title: "O₃(Ozone)", value: value.mq131  },
    { title: "PM2.5(Micro dust)", value: value.pm25  },
    { title: "PM10(Particular Matter)", value: value.pm10 },
    { title: "NH₃(Ammonia)", value: value.nh3  },
    { title: "NO₂(Nitrogen dioxide)", value: value.no2  },
  ];

  return (
    <div className={`cursor-pointer ${isDarkMode ? "bg-gray-800" : "bg-gray-100"} border-[1px] rounded-lg  lg:rounded-[10%]  p-6 md:p-12 gap-4`}>
    {/* Title */}
    <div className="flex justify-center items-center text-xl md:text-2xl font-bold my-3">
      <h1>Gases Responsible for Air Quality Index</h1>
    </div>
  
    {/* Container for Humidity and Temperature */}
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center my-5 gap-6">
        {/* Humidity */}
        <div className="flex text-base md:text-lg lg:text-2xl justify-between items-center gap-4">
          <WiHumidity size={30} className="md:size-[40px]" />
          <span>Humidity</span>
          <div>{value.humidity || '23'}%</div>
        </div>
        {/* Temperature */}
        <div className="flex text-base md:text-lg lg:text-2xl justify-between items-center gap-4">
          <FaTemperatureHigh size={30} className="md:size-[40px]" />
          <span>Temperature</span>
          <div>{value.temperature || '40'}°C</div>
        </div>
      </div>
  
      {/* Horizontal Line */}
      <div className="w-full h-px bg-gray-400 my-4"></div>
  
      {/* Gases Cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4 md:gap-6 mb-10`}
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
  </div>
  


  
  );
};

export default GasesTable;
