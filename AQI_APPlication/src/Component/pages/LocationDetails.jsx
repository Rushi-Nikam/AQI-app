import React, { useEffect, useState } from "react";
import { useParams ,useNavigate } from "react-router-dom";
import GoodImage from "/Images/1.png";
import ModerateImage from "/Images/2.png";
import UnhealthyForSensitiveImage from "/Images/3.png";
import UnhealthyImage from "/Images/4.png";
import VeryUnhealthyImage from "/Images/5.png";
import HazardousImage from "/Images/6.png";
import PageNotFound from "./PageNotFound";
// import {} from "rea"
const LocalityDetail = ({ isDarkMode }) => {
  const { name } = useParams();
  const [localityData, setLocalityData] = useState(null);
  const [error, setError] = useState(null);
  const navigator = useNavigate();
  // const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentTime(new Date().toLocaleString());
  //   }, 1000);
  //   return () => clearInterval(timer);
  // }, []);

  useEffect(() => {
    const fetchLocalityData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/aqi/${name}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setLocalityData(data);
      } catch (error) {
        // setError("found and error",error.message);
        // setError(<PageNotFound/>)
        navigator('/')
      }
    };

    fetchLocalityData();
  }, [name]);

  const getAQIImage = (aqi) => {
    if (aqi <= 50) return GoodImage;
    if (aqi <= 100) return ModerateImage;
    if (aqi <= 150) return UnhealthyForSensitiveImage;
    if (aqi <= 200) return UnhealthyImage;
    if (aqi <= 300) return VeryUnhealthyImage;
    return HazardousImage;
  };

  const getAQICategoryText = (aqi) => {
    if (aqi > 500) return "Hazardous";
    if (aqi > 300) return "Severe";
    if (aqi > 200) return "Unhealthy";
    if (aqi > 100) return "Poor";
    if (aqi > 50) return "Moderate";
    return "Good";
  };

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!localityData) {
    return <p>Loading...</p>;
  }

  const { aqi, so2, co, no2, pm25, pm10, o3 } = localityData;
  const aqiCategoryImage = getAQIImage(aqi);
  const aqiCategoryText = getAQICategoryText(aqi);

  const PollutantDetail = ({ label, value }) => (
    <div className={`p-4 ${isDarkMode?'bg-gray-500':'bg-gray-250'} text-center rounded-lg shadow-lg`}>
      <p className="text-lg font-bold">{label}</p>
      <p className="text-2xl text-red-500">{value}</p>
    </div>
  );

  return (
    <div
      className={`flex flex-col lg:flex-row mt-8 gap-6 ${
        isDarkMode ? "text-white" : "text-black "
      }`}
    >
      {/* AQI Section */}
      <div className={`${isDarkMode?'bg-gray-500':'bg-gray-250'} border-4 shadow-lg p-6 rounded-xl flex-1`}>
        <h2 className="text-2xl font-bold mb-2">
          {name} Real-time Air Quality Index (AQI)
        </h2>
        <p>Real-time PM2.5, PM10 air pollution levels in Maharashtra.</p>
        <div className="flex  justify-end items-end  mt-6">
          <div className="flex flex-col text-center">
            <p className="text-3xl text-red-600 font-bold">{aqi}</p>
            <p>(AQI-IN)</p>
          </div>
        </div>
        <div className="text-center bg-yellow-300 w-52 mx-auto mt-4 px-4 py-2 rounded-full">
          <p>{aqiCategoryText}</p>
        </div>
        <div className="mt-6 text-center">
          <img
            src={aqiCategoryImage}
            alt="AQI Category"
            className="w-28 h-28 mx-auto"
          />
          <p className="text-xl"><span className="text-red-400">Last Updated:</span>  {new Date().toDateString()}</p>  
        </div>
      </div>

      {/* Pollutant Details Section */}
      <div
  className={`${isDarkMode ? "bg-gray-500" : "bg-gray-250"} border-4 border-solid p-6 rounded-xl flex-1`}
>
  <h2 className="text-2xl font-bold mb-4">{name} Pollutant Details</h2>
  <div className="grid grid-cols-2 gap-4">
    <PollutantDetail label="SO₂" value={so2} />
    <PollutantDetail label="CO" value={co} />
    <PollutantDetail label="NO₂" value={no2} />
    <PollutantDetail label="PM2.5" value={pm25} />
    <PollutantDetail label="PM10" value={pm10} />
    <PollutantDetail label="O₃" value={o3} />
  </div>
</div>

    </div>
  );
};

export default LocalityDetail;
