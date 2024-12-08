import React, { useState, useEffect } from "react";
import Pre from "../molecules/Pre";
import Circle from "../molecules/Circle"
import Gases from "../molecules/Gases"

const SideCard = ({ location = "Mumbai", isDarkMode }) => {
  const [gases, setGases] = useState([]); // State to store the gases data
  const [isClicked, setIsClicked] = useState(false); // Track click state
  const [citydata , setCitydata]= useState();
  const [loading,setloading] = useState(true);

  useEffect(() => {
    // Fetch the gas data from the API when the component mounts
    const fetchGases = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/gases"); // Replace with your actual API URL
        if (!response.ok) {
          throw new Error("Failed to fetch gases data");
        }
        const data = await response.json();
        setGases(data); // Set the fetched data to the state
      } catch (error) {
        console.error("Error fetching gases:", error);
      }
    };

    fetchGases(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array ensures this runs only once after the initial render
  useEffect(() => {
    // Fetch city data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.40.191:8000/aqi_values/get-data/");
        if (!response.ok) throw new Error("Network response was not ok");
        const sensorData = await response.json();
      //   if (sensorData.Sensor_data && sensorData.Sensor_data.length > 0) {
      //     const firstValue = sensorData.Sensor_data[0].value; // Accessing 'value' from the first element
      //     console.log("First value:", firstValue);
      //     setCitydata(firstValue); // Update state with the fetched value
      //   } else {
      //     console.warn("Sensor_data array is empty or undefined.");
      //   }
      //   setloading(false);
      // } catch (error) {
      //   console.error("Error fetching sensor data:", error);
      // }
  
        const latestAQIValue = sensorData.length > 0 ? Math.round(data[data.length -1].value) : "N/A";
        const sensor = sensorData.humidity;
        // const sensor = sensorData
        setCitydata(sensor);
        // setCitydata(latestAQIValue)
        setloading(false);
        console.log(sensorData);  
  
      } catch (error) {
        console.error("Error fetching AQI data:", error);
      }
    };

    fetchData();
  }, []);

  const calculateAQI = () => {
    const aqiValues = gases.map((gas) => {
      const { value, range, index } = gas;
      const { low, high } = range;
      const { low: indexLow, high: indexHigh } = index;
      const aqi = ((indexHigh - indexLow) / (high - low)) * (value - low) + indexLow;
      return aqi;
    });

    return Math.round(aqiValues.reduce((acc, cur) => acc + cur, 0) / aqiValues.length);
  };

  // const aqiValue = calculateAQI(); // Calculate the AQI value
   // Calculate the AQI value
   const aqiValue =45;

  return (
    // <main
    //   className={`sm:w-[320px] w-full lg:mr-8 max-w-xl h-[400px] p-6 rounded-lg shadow-lg transition-transform cursor-pointer ${isDarkMode ? "bg-[#111830]" : "bg-white"} ${isDarkMode ? "text-white" : "text-[#111830]"}`}
    //   onClick={() => setIsClicked(!isClicked)}
    // >
    <main
      className={`sm:w-[320px] w-full lg:mr-8 max-w-xl h-[400px] p-6 rounded-lg shadow-lg transition-transform cursor-pointer ${isDarkMode ? "bg-[#111830]" : "bg-white"} ${isDarkMode ? "text-white" : "text-[#111830]"}`}
    
     
    >
      <div className={`text-black text-center mb-4 ${isDarkMode ? "text-white" : "text-[#111830]"}`}>
        <h1 className="text-xl font-bold">{location} Location</h1>
        <p className="text-sm">Maharashtra, India</p>
      </div>

      <div className={`flex flex-col sm:flex-row justify-center sm:items-start ${isDarkMode ? "text-white" : "text-[#111830]"}`}>
        <div className="flex text-black flex-col items-center sm:mt-0">
          <div className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-[#111830]"}`}>Air Quality Index</div>
          {/* Add Circle component here to visualize the AQI value */}
          {/* <div>{loading?`Loading.....`: <Circle aqiValue={ aqiValue || citydata} isDarkMode={isDarkMode}/>}</div> */}
          <Circle  aqiValue={citydata} isDarkMode={isDarkMode}/>
          {/* <Circle aqiValue={ aqiValue || citydata} isDarkMode={isDarkMode}/> */}
        </div>
      </div>

      {/* Conditionally show gas values on click */}
      {/* {isClicked && (
        <div className="flex flex-col w-[600px] mt-[-410px] ml-[500px] text-center justify-center items-center">
          <div className="flex ml-[80px]">
            <div>
              <h1 className="font-bold mx-auto lg:mt-[15px]">Gases responsible for AQI Index</h1>
              <Gases/>
            </div>
            <div className="mt-[-60px]">
              
              <Pre/>
            </div>
          </div>
        </div>
      )} */}
    </main>
  );
};

export default SideCard;
