import React, { useState, useEffect } from "react";
import Circle from "../molecules/Circle";

const SideCard = ({ location, isDarkMode }) => {
  const [gases, setGases] = useState([]);
  const [citydata, setCitydata] = useState(null);
  const [time, setTime] = useState(null);
  const [loading, setLoading] = useState(true);

  const AQI_ENDPOINT = import.meta.env.VITE_AQI_ENDPOINT; 
  const AQI_URL = import.meta.env.VITE_URL;

  // Fetch gases data once on mount
  useEffect(() => { 
    const fetchGases = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/gases`);
        if (!response.ok) {
          throw new Error("Failed to fetch gases data");
        }
        const data = await response.json();
        setGases(data);
      } catch (error) {
        console.error("Error fetching gases:", error);
      }
    };

    fetchGases();
  }, []);

  // Fetch AQI data periodically
  useEffect(() => {
    const fetchData = async () => {
      try { 
        const response = await fetch(`${AQI_URL}${AQI_ENDPOINT}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const sensorData = await response.json();

        if (sensorData && sensorData.Bus_data) {
          setCitydata(sensorData.Bus_data);
          setTime(sensorData.timestamp);
        } else {
          setCitydata(null);
        }
      } catch (error) {
        console.error("Error fetching AQI data:", error);
        setCitydata(null);
      }
    };

    // Fetch data immediately and then set interval
    // fetchData();
    const interval = setInterval(fetchData, 1000);
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [AQI_URL, AQI_ENDPOINT]);
  
  return (
    <main
      className={`sm:w-[320px] w-full lg:mr-8 max-w-xl  h-[440px] p-8 rounded-lg shadow-lg transition-transform cursor-pointer ${isDarkMode ? "bg-[#111830]" : "bg-white"} ${isDarkMode ? "text-white" : "text-[#111830]"}`}
    >
      <div className={`text-black text-center mb-4 ${isDarkMode ? "text-white" : "text-[#111830]"}`}>
        <h1 className="text-xl font-bold">{location} City</h1>
        <p className="text-sm">Maharashtra, India</p>
      </div>

      <div className={`flex flex-col sm:flex-row justify-center sm:items-start ${isDarkMode ? "text-white" : "text-[#111830]"}`}>
        <div className="flex text-black flex-col items-center sm:mt-0">
          <div className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-[#111830]"}`}>Air Quality Index</div>
          <Circle aqiValue={citydata?.aqi} isDarkMode={isDarkMode} />
          <p className={`${isDarkMode ? "text-white" : "text-[#111830]"} py-3 font-medium`}>
            {time ? new Date(time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : "Loading..."}
          </p>
        </div>
      </div>
    </main>
  );
};

export default SideCard;
