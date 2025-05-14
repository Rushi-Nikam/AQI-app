import React, { useEffect, useState } from "react";
import GasCard from "../molecules/GasCard";
import { WiHumidity } from "react-icons/wi";
import { FaTemperatureHigh } from "react-icons/fa";
import { useParams } from "react-router-dom";
const PollutionTable = ({ isDarkMode }) => {
  const [value, setValue] = useState({});
  
   const { name } = useParams();  
  const { aqi, so2, co, no2, pm25, pm10, o3 } = value;
  useEffect(() => {
      const fetchLocalityData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/aqi/${name}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setValue(data);
        //   console.log({data})
        } catch (error) {
          setError(error.message);
          setTimeout(() => navigate("/"), 3000); // Redirect after 3 seconds
        }
      };
  
      fetchLocalityData();
    }, [name]);
//   useEffect(() => {
//     let intervalId;
//     const fetchData = async () => {
//         try {
//           if (!name) {
//             console.warn("No locality provided for AQI data fetch.");
//             return;
//           }
      
//           const response = await fetch(`$http://localhost:5000/api/aqi/${name}`);
//           console.log("Raw API Response:", response);
      
//           if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
//           const contentType = response.headers.get("content-type");
//           if (!contentType || !contentType.includes("application/json")) {
//             throw new Error("API did not return JSON");
//           }
      
//           const data = await response.json();
//           console.log("Fetched AQI Data:", data);
      
//           setValue(data || {}); 
//         } catch (error) {
//           console.error("Error fetching AQI data:", error);
//         }
//       };
      

//     // fetchData();

//     // Uncomment for periodic data fetching
//      intervalId = setInterval(fetchData, 3000);
//     return () =>{ clearInterval(intervalId);
      
//     };
//   }, [AQI_ENDPOINT]);

  const gasData = [
    // { title: "Humidity", value: value.humidity},
    // { title: "Temperature", value: value.temperature },
    { title: "CO",semititle:"(Carbon Monoxide)", value: co   },
    { title: "O₃",semititle:"(Ozone)", value: o3 },
    { title: "PM2.5",semititle:"(Micro dust)", value: pm25  },
    { title: "PM10",semititle:"(Particular Matter)", value: pm10 },
    { title: "NH₃",semititle:"(Ammonia)", value: aqi  },
    { title: "NO₂",semititle:"(Nitrogen dioxide)", value:no2 },
  ];

  return (
    <div className={` border-2  cursor-pointer max-w-[90%] w-[1500px] ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}  rounded-lg  lg:rounded-[2%]  p-6 md:p-12 gap-4`}>
    {/* Title */}

  
    {/* Container for Humidity and Temperature */}
    <div className="container  mx-auto">
      <div className="flex flex-col sm:flex-row justify-evenly items-center my-5 gap-6">
        {/* Humidity */}
        <div className="flex text-base md:text-lg lg:text-xl justify-evenly items-center gap-4">
          <WiHumidity size={30} className="md:size-[40px]" />
          <span>Humidity</span>
          <div>{value.humidity || '23'}%</div>
        </div>
        {/* Temperature */}
        <div className="flex text-base md:text-lg lg:text-xl justify-evenly items-center gap-4">
          <FaTemperatureHigh size={30} className="md:size-[20px]" />
          <span>Temperature</span>
          <div>{value.temperature || '40'}°C</div>
        </div>
      </div>
  
      {/* Horizontal Line */}
      <div className="w-full h-px  bg-gray-500 my-4"></div>
  
      {/* Gases Cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3  mb-10`}
      >
        {gasData.map((gas, index) => (
          <GasCard
            key={index}
            value={gas.value}
            title={gas.title}
            semititle={gas.semititle}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  </div>
  


  
  );
};

export default PollutionTable;