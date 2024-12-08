import React, { Suspense, useCallback, useEffect } from 'react';
import { useState } from 'react';
import PollutantTable from '../molecules/PollutantTable';
import Questions from '../molecules/Questions';

const GasesTable = React.lazy(() => import('../molecules/GasesTable'));
const SideCard = React.lazy(() => import('../molecules/SideCard'));
const Leafletmap = React.lazy(() => import('../Map/Leafletmap'));

const HomePage = ({ isDarkMode }) => {
  const handleWindow = useCallback(() => {
    console.log("Page loaded");
  }, []);

  useEffect(() => {
    window.addEventListener('load', handleWindow);

    return () => {
      window.removeEventListener("load", handleWindow);
    };
  }, [handleWindow]);

  return (
    <div className={`py-4 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'} w-full`}>
      {/* Header */}
      <div className="flex justify-center px-4">
        <h1
          className={`font-serif text-2xl md:text-3xl font-bold mb-5 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}
        >
          Pune AQI Status | Live Air Quality and Pollution Data
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col-reverse lg:flex-row lg:mx-20 my-4 gap-8 lg:gap-12 px-4">
        {/* SideCard */}
        <div className="flex justify-center lg:w-1/3"
        onClick={()=>window.location.reload()}>
          <Suspense fallback={<div>Loading...</div>}>
            <SideCard location={"Pune"} isDarkMode={isDarkMode} />
          </Suspense>
        </div>

        {/* Leaflet Map */}
        <div className="flex justify-center lg:w-2/3">
          <Suspense fallback={<div>Loading...</div>}>
            <Leafletmap />
          </Suspense>
        </div>
      </div>

      {/* AQI Table */}
      <div className="flex flex-col lg:flex-row lg:justify-center items-center px-4">
        <div className={`w-full max-h-[400px] ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
          <Suspense fallback={<div>Loading...</div>}>
            <GasesTable isDarkMode={isDarkMode} />
          </Suspense>
        </div>
      </div>

      {/* Pollutant Table */}
      <div className={`px-4 lg:mt-6 mt-[650px] ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <PollutantTable isDarkMode={isDarkMode} />
        </Suspense>
      </div>

      {/* Questions Section */}
      <div className={`px-4 mt-6 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Questions isDarkMode={isDarkMode} />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
