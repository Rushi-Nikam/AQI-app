import React, { useState } from 'react';
import SideCard from '../molecules/SideCard';
import AQICard from '../molecules/AQICard';
import AQITable from '../molecules/AQITable';
import Leafletmap from '../Map/Leafletmap';

const HomePage = ({ isDarkMode }) => { // Receive the dark mode state as a prop
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`py-4 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
      <h1 className={`font-serif text-2xl font-bold mb-5 text-center lg:text-left ${isDarkMode ? 'text-white' : 'text-black'}`}>
        India AQI Status | Live Air Quality and Pollution Data
      </h1>
      <div className="flex lg:flex lg:mx-20 my-4 gap-12">
        <div 
          className="flex justify-start"
          // onMouseEnter={() => setIsHovered(true)} 
          // onMouseLeave={() => setIsHovered(false)} 
          onClick={()=>setIsHovered(!isHovered)}
        >
          <SideCard location={"Pune"} isDarkMode={isDarkMode} />
        </div>

        <div className={`${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          <Leafletmap /> 
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:justify-between p-4 mt-4 gap-4">
        {/* AQI Table */}
        <div className={`lg:w-1/2 overflow-auto max-h-[400px] ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <AQITable  isDarkMode={isDarkMode} />
        </div>

        {/* AQI Card */}
        <div className={`lg:w-1/3 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        <AQICard isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
