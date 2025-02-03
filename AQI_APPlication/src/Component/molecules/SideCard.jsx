import React, { useState, useEffect } from "react";
import Circle from "../molecules/Circle";
import { BiSolidShow } from "react-icons/bi";
import { RiEyeCloseFill } from "react-icons/ri";
import { BsFillInfoCircleFill } from "react-icons/bs";
const SideCard = ({ location, isDarkMode }) => {
  const [gases, setGases] = useState([]);
  const [citydata, setCitydata] = useState(null);
  const [time, setTime] = useState(null);
  // const [loading, setLoading] = useState(true);
const [show,setShow] = useState(false);

  const AQI_ENDPOINT = import.meta.env.VITE_AQI_ENDPOINT; 
  const AQI_URL = import.meta.env.VITE_URL;
const handler  = ()=>{
  setShow(!show);
}
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
        const response = await fetch(`aqi_values/get-data/`);
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
  }, []);
  
  return (
    <main
    className={`w-full  sm:w-[480px] md:w-[640px] lg:w-[800px] max-w-4xl h-[600px] py-1 px-4 md:px-12 lg:px-16 rounded-lg transition-transform cursor-pointer  ${isDarkMode ? "text-white" : "text-[#111830]"}`}
  >
    {/* Header Section */}
    <div
      className={`text-center  ${
        isDarkMode ? "text-white" : "text-[#111830]"
      }`}
    >
  <h1 className="text-2xl font-bold">Live Air Quality of the {location} City</h1>
      {/* <p className="text-2xl font-bold">{location} City</p> */}
      <p className="text-md m-4 ">Maharashtra, India</p>
    </div>
  
    {/* Content Section */}
    <div
      className={`flex flex-col sm:flex-row justify-center items-center ${
        isDarkMode ? "text-white" : "text-[#111830]"
      }`}
    >
      <div className="flex flex-col items-center sm:mt-0">
        {/* Air Quality Index Title */}
       
  
        {/* Circle Component */}
        <Circle aqiValue={citydata?.aqi} isDarkMode={isDarkMode} />
  
        {/* Information Section */}
        <p
          className={`py-4 text-sm md:text-base font-medium ${
            isDarkMode ? "text-white" : "text-[#111830]"
          }`}
        >
          {show ? (
            <div className="flex flex-col items-center">
              <button
                className={`flex items-center justify-center ${
                  isDarkMode
                    ? "text-white hover:text-gray-300"
                    : "text-[#111830] hover:text-gray-600"
                }`}
                onClick={handler}
              >
                <BsFillInfoCircleFill />
              </button>
              <span>
                {time
                  ? new Date(time).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })
                  : "Loading..."}
              </span>
            </div>
          ) : (
            <button
              className={`flex items-center justify-center ${
                isDarkMode
                  ? "text-white hover:text-gray-300"
                  : "text-[#111830] hover:text-gray-600"
              }`}
              onClick={handler}
            >
              <BsFillInfoCircleFill />
            </button>
          )}
        </p>
      </div>
    </div>
  </main>
  
  );
};

export default SideCard;
