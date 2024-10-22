import React, { useState } from 'react';
import SideCard from '../molecules/SideCard';
import AQICard from '../molecules/AQICard';
import AQITable from '../molecules/AQITable';
import Leafletmap from '../Map/Leafletmap';

const HomePage = () => {
  const [isHovered, setIsHovered] = useState(false); 

  return (
    <div className="py-4 ">
      <div className="flex lg:flex lg:mx-20 my-4 gap-12">
        <div 
          className="flex justify-start"
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)} 
        >
          <SideCard location={"Pune"} />
        </div>

        <div className={`transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          <Leafletmap />
        </div>
      </div>

    
      <div className="flex flex-col lg:flex-row lg:justify-between p-4 mt-4 gap-4">
        {/* AQI Table */}
        <div className="lg:w-1/2 overflow-auto max-h-[400px]">
          <AQITable />
        </div>

        {/* AQI Card */}
        <div className="lg:w-1/3">
          <AQICard />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
