import React, { useState } from "react";
import Circle from "./Circle";
import Gases from "./Gases"; // Assuming Gases component is in the same folder
import Pre from "./Pre";

const SideCard = ({ location = "Mumbai",isDarkMode }) => {
  const [isClicked, setIsClicked] = useState(false); // Track click state

  const gases = [
    { name: "SO₂", label: "Sulfur Dioxide", unit: "ppm", value: 0.005, max: 0.5 },
    { name: "CO", label: "Carbon Monoxide", unit: "ppm", value: 1.5, max: 9 },
    { name: "NO₂", label: "Nitrogen Dioxide", unit: "ppm", value: 0.002, max: 0.1 },
    { name: "PM2.5", label: "Fine Particles (PM2.5)", unit: "µg/m³", value: 35, max: 25 },
    { name: "PM10", label: "Coarse Particles (PM10)", unit: "µg/m³", value: 50, max: 50 },
    { name: "O₃", label: "Ozone", unit: "ppm", value: 0.07, max: 0.08 },
  ];

  const calculateAQI = () => {
    let totalWeightedValue = 0;
    gases.forEach((gas) => {
      totalWeightedValue += (gas.value / gas.max) * 100;
    });
    return Math.round(totalWeightedValue / gases.length);
  };

  const aqiValue = calculateAQI();

  return (
    <main
      className={`sm:w-[320px] w-full   lg:mr-8 max-w-xl h-[400px] p-6 rounded-lg shadow-lg transition-transform cursor-pointer ${isDarkMode?`bg-[#111830]`:`bg-white`} ${isDarkMode?`text-white`:`text-[#111830]`}`}
      
      // onMouseEnter={()=>setIsClicked(true)}
      // onMouseLeave={()=>setIsClicked(false)} 
      onClick={()=>setIsClicked(!isClicked)}
    >
      <div className={`text-black text-center mb-4 ${isDarkMode?`text-white`:`text-[#111830]`}`}>
        <h1 className="text-xl font-bold">{location} Location</h1>
        <p className="text-sm">Maharashtra, India</p>
      </div>

      <div className={`flex flex-col sm:flex-row  justify-center sm:items-start ${isDarkMode?`text-white`:`text-[#111830]`}`}>
        <div className="flex text-black flex-col items-center sm:mt-0">
          <div className={`text-xl font-semibold ${isDarkMode?`text-white`:`text-[#111830]`}`}>Air Quality Index</div>
          <Circle aqiValue={aqiValue} isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Conditionally show gas values on click */}
      {isClicked && (
        <div className="flex flex-col w-[600px] mt-[-420px] ml-[500px] text-center justify-center items-center">
          <div>

   
 <div className="flex ml-[80px]">
       <div>
        <h1 className="font-bold mx-auto">gases responsible for AQI Index </h1>

          <Gases />
       </div>
       <div className="mt-[-60px]">

          <Pre/> {/* Display Gases component when clicked */}
       </div>
        </div>
        </div>
        </div>
       
      )}
    </main>
  );
};

export default SideCard;
