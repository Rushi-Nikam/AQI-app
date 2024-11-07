import React, { useState } from "react";
import Circle from "./Circle";
import Gases from "./Gases"; // Assuming Gases component is in the same folder
import Pre from "./Pre";

const SideCard = ({ location = "Mumbai",isDarkMode }) => {
  const [isClicked, setIsClicked] = useState(false); // Track click state

  const gases = [
    { name: "SO₂", label: "Sulfur Dioxide", unit: "µg/m³", value: 0.005, range: { low: 0, high: 0.5 }, index: { low: 0, high: 50 } },
    { name: "CO", label: "Carbon Monoxide", unit: "µg/m³", value: 1.5, range: { low: 0, high: 9 }, index: { low: 0, high: 50 } },
    { name: "NO₂", label: "Nitrogen Dioxide", unit: "µg/m³", value: 0.002, range: { low: 0, high: 0.1 }, index: { low: 0, high: 50 } },
    { name: "PM2.5", label: "Fine Particles (PM2.5)", unit: "µg/m³", value: 35, range: { low: 12.1, high: 35.4 }, index: { low: 51, high: 100 } },
    { name: "PM10", label: "Coarse Particles (PM10)", unit: "µg/m³", value: 50, range: { low: 0, high: 50 }, index: { low: 0, high: 50 } },
    { name: "O₃", label: "Ozone", unit: "µg/m³", value: 0.07, range: { low: 0, high: 0.08 }, index: { low: 0, high: 50 } },
  ];

  const calculateAQI = () => {
    let aqiValues = gases.map((gas) => {
      const { low, high } = gas.range;
      const { low: indexLow, high: indexHigh } = gas.index;
      return ((indexHigh - indexLow) / (high - low)) * (gas.value - low) + indexLow;
    });

    return Math.round(aqiValues.reduce((acc, cur) => acc + cur, 0) / gases.length);
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
        <div className="flex flex-col w-[600px] mt-[-410px] ml-[500px] text-center justify-center items-center">
          <div>

   
 <div className="flex ml-[80px]">
       <div>
        <h1 className="font-bold mx-auto lg:mt-[15px]">gases responsible for AQI Index </h1>

          <Gases />
       </div>
       <div className="mt-[-60px]">

          <Pre/> {/* Display Gases component when clicked */}
       </div>
        </div>
 {/* <div className="flex ml-[80px]">
       <div>
        <h1 className="font-bold mx-auto lg:mt-[15px]">gases responsible for AQI Index </h1>

          <Gases />
       </div>
       <div className="mt-[-60px]">

          <Pre/> Display Gases component when clicked 
       </div>
        </div> */}

        </div>
        </div>
       
      )}
    </main>
  );
};

export default SideCard;
