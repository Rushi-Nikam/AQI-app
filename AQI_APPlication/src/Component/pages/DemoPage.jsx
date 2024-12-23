import React, { useEffect, useState } from 'react'
import Circle from '../molecules/Circle'
import Circle2 from '../molecules/Circle2';


const DemoPage = ({ location, isDarkMode }) => {
    const [citydata , setCitydata]= useState(null);
    const [time,setTime]=useState(null);
    const AQI_ENDPOINT = import.meta.env.VITE_AQI_ENDPOINT; 
    const AQI_URL = import.meta.env.VITE_URL;
  
       
    useEffect(() => {
      const fetchData = async () => {
        try { 
          const response = await fetch(`${AQI_URL}${AQI_ENDPOINT} `);
          if (!response.ok) throw new Error("Network response was not ok");
          const sensorData = await response.json();
          if (sensorData && sensorData.Bus_data) {
            setCitydata(sensorData.Bus_data);
            setTime(sensorData.timestamp)
          } else {
            
            setCitydata(null);
          }
        } catch (error) {
          console.error("Error fetching AQI data:", error);
          setCitydata(null)
        }
      };
  
      fetchData();
},[])
  return (
    <div className='flex'>
     
    
     <div
  className={`sm:w-[400px] w-full lg:mr-8 max-w-2xl h-[440px] p-8 rounded-lg shadow-lg transition-transform cursor-pointer ${isDarkMode ? "bg-[#111830]" : "bg-white"} ${isDarkMode ? "text-white" : "text-[#111830]"}`}
> 
  <div className={`text-black text-center mb-4 ${isDarkMode ? "text-white" : "text-[#111830]"}`}>
    <h1 className="text-xl font-bold">{location} City</h1>
    <p className="text-sm">Maharashtra, India</p>
  </div>

  <div className={`flex flex-col sm:flex-row justify-center sm:items-start ${isDarkMode ? "text-white" : "text-[#111830]"}`}>
    <div onClick={() => window.location.reload()} className="flex text-black flex-col items-center sm:mt-0">
      <div className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-[#111830]"}`}>Air Quality Index</div>
      <Circle2 aqiValue={citydata?.aqi} isDarkMode={isDarkMode} />
      <p className="py-3 font-medium">{new Date(time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
    </div>
  </div>
</div>
</div>
  )
}

export default DemoPage
