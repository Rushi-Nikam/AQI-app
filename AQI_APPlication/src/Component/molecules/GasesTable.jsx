import React, { useEffect, useState } from 'react';
import GasCard from './GasCard';

const GasesTable = ({ isDarkMode }) => {
  // const [gases, setGases] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [value, setValue] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
//  const [isDarkmode , setIsDarkmode]= useState(false);




  // useEffect(() => {
  //   const fetchGases = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5000/api/gases');
  //       if (response.ok) {
  //         const data = await response.json();
  //         setGases(data); // Assuming data is an array of gas objects
  //         setLoading(false);
  //       } else {
  //         console.error('Error fetching gas data');
  //       }
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   };

  //   fetchGases();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('aqi_values/get-data/');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        // const latestAQIValue = data.length > 0 ? Math.round(data[data.length - 1].value) : 'N/A';
        const sensor = data;
        setValue(sensor.Bus_data);
        // console.log(sensor)
        //const humidity = data.humidity;
        //setHumidityData(humidity);
      
      } catch (error) {
        console.error('Error fetching AQI data:', error);
      }
    };

    fetchData();

  }, []);
  const gasData = [
    { title: 'Humidity', value: value.humidity },
    { title: 'Temperature', value: value.temperature },
    { title: 'CO', value: value.mq7 },
    { title: 'O₃', value: value.mq131 },
    { title: 'PM2.5', value: value.pm25 },
    { title: 'PM10', value: value.pm10 },
    { title: 'NH3', value: value.nh3 },
    { title: 'NO₂', value: value.no2 },
  ];

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="cursor-pointer">
      <div className="flex justify-center text-2xl mt-3 font-bold">
        <h1>Gases Responsible for AQI Index</h1>
      </div>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:w-[1400px] h-auto mb-[200px] mt-[50px] rounded-lg ${
          isDarkMode ? 'bg-gray-800 text-pink-800' : 'bg-white text-gray-600'
        }`}
      >
        
    

{gasData.map((gas, index) => (
  <GasCard key={index}  value={gas.value}  title={gas.title} isDarkMode={isDarkMode} />
))}
         

      </div>
    </div>
  );
};

export default GasesTable;

