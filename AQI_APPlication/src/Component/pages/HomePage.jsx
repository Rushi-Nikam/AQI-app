import React from 'react';
import SideCard from '../molecules/SideCard';
import Gases from '../molecules/Gases';
import AQICard from '../molecules/AQICard';
import AQITable from '../molecules/AQITable';

const HomePage = () => {
  return (
    <div className="p-4">
      {/* First Section: Gases and SideCard */}
      <div className="flex flex-col lg:flex-row justify-between lg:mx-20 my-4 gap-4">
        {/* Gases Section */}
        <div className="lg:w-2/3">
          <Gases />
        </div>

        {/* SideCard Section */}
        <div className="lg:w-1/3 flex justify-end">
          <SideCard location={"Pune"} />
        </div>
      </div>

      {/* Second Section: AQI Table and AQI Card */}
      <div className="flex flex-col lg:flex-row lg:justify-between p-4 mt-4 gap-4">
        {/* AQI Table */}
        <div className="lg:w-1/2 overflow-auto max-h-[400px]"> {/* Set max height and enable scroll */}
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
