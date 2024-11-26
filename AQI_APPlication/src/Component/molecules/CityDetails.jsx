import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GoodImage from '/Images/Good-removebg-preview.png';
import ModerateImage from '/Images/Moderate-removebg-preview.png';
import UnhealthyForSensitiveImage from '/Images/Unhealthy_sensitive-removebg-preview.png';
import UnhealthyImage from '/Images/Unhealthy-removebg-preview.png';
import VeryUnhealthyImage from '/Images/Vary_unhealthy-removebg-preview.png';
import HazardousImage from '/Images/Moderate-removebg-preview.png';

const CityDetails = ({ isDarkMode }) => {
  const { name } = useParams();
  const [localityData, setLocalityData] = useState(null);

  useEffect(() => {
    const fetchLocalityData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/city/${name}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setLocalityData(data);
      } catch (error) {
        console.error('Error fetching locality data:', error);
      }
    };
  
    fetchLocalityData();
  }, [name]);

  if (!localityData) {
    return <p>Loading...</p>;
  }

  const { aqi, so2, co, no2, pm25, pm10, o3 } = localityData;

  // Define max values for each pollutant
  const maxValues = {
    so2: 0.05,
    co: 10,
    no2: 0.1,
    pm25: 100,
    pm10: 150,
    o3: 0.12
  };

  // Function to get the appropriate image based on AQI value
  const getAQIImage = (aqi) => {
    if (aqi <= 50) return GoodImage;
    if (aqi <= 100) return ModerateImage;
    if (aqi <= 150) return UnhealthyForSensitiveImage;
    if (aqi <= 200) return UnhealthyImage;
    if (aqi <= 300) return VeryUnhealthyImage;
    return HazardousImage;
  };

  const aqiCategoryImage = getAQIImage(aqi);

  return (
    <div className={`flex p-4 justify-center gap-8 items-center ${isDarkMode ? "text-white" : "text-black"}`}>
      <div className="bg-gray-500 w-[600px] h-[300px] px-4 py-5 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">{name} Air Quality Index (AQI)</h2>
        <p>Real-time PM2.5, PM10 air pollution level in Maharashtra.</p>
        <div className="flex justify-between mt-9">
          <p className='text-xl'>Last Updated: {new Date().toDateString()}</p>
          <div className="flex flex-col text-center">
            <p className="text-3xl">{aqi}</p>
            <p>(AQI-IN)</p>
          </div>
        </div>
        <div className="text-center bg-yellow-300 w-52 px-5 py-2 rounded-full cursor-pointer">
          <p>{aqi >= 500 ? "Hazardous" : aqi >= 300 ? " Very Unhealthy" : aqi >= 200 ? "Unhealthy" : aqi >= 150 ? "Unhealthy for Sensitive" : aqi >= 100 ? "Moderate" : "Normal"}</p>
        </div>
        <div>
          <img src={aqiCategoryImage} alt="AQI Category" className="w-28 h-28 mx-auto mt-[-40px] lg:mr-[-10px]" />
        </div>
      </div>

      <div className="bg-gray-500 w-[700px] h-[350px] p-4 rounded-lg flex flex-col justify-center text-center">
        <h2 className="text-2xl font-bold mb-4">{name} Pollutant Details</h2>
        <div className="grid grid-cols-3 gap-3 text-center justify-center">
          {[
            { label: 'SO₂', value: so2, max: maxValues.so2 },
            { label: 'CO', value: co, max: maxValues.co },
            { label: 'NO₂', value: no2, max: maxValues.no2 },
            { label: 'PM2.5', value: pm25, max: maxValues.pm25 },
            { label: 'PM10', value: pm10, max: maxValues.pm10 },
            { label: 'O₃', value: o3, max: maxValues.o3 }
          ].map((pollutant, index) => (
            <div key={index} className=" p-3 rounded-lg text-white">
              <p>{pollutant.label}</p>
              <p className="text-lg font-bold mb-2">{pollutant.value} µg/m³</p>
              <div className="w-full h-2 bg-gray-300 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min((pollutant.value / pollutant.max) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CityDetails;
