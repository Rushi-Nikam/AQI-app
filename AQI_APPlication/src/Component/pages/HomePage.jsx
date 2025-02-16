import React, { Suspense, useState } from 'react';

import Questions from '../molecules/Questions';
import BarChart from '../molecules/BarChart';
import SensorData from '../molecules/SensorData';
import SensorDatas from '../molecules/SensorDatas';

import CurrentAQI from '../molecules/CurrentAQI';
import LiveAQI from './LiveAQI';
import Predict2 from '../molecules/Predict2';
const GasesTable = React.lazy(() => import('../molecules/GasesTable'));
const SideCard = React.lazy(() => import('../molecules/SideCard'));
const Leafletmap = React.lazy(() => import('../Map/Leafletmap'));

const HomePage = ({ isDarkMode }) => {
  const [view, setView] = useState(false);

  const onclickHandler = () => {
    setView(!view);
  };

  return (
    <div className={` ${isDarkMode ? 'bg-[#111827]' : 'bg-white'} w-full`}>
      {/* Header */}
      {/* <div className="flex justify-center px-4">
        <h1 className={`font-serif text-2xl md:text-3xl font-bold mb-5 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
           Live Air Quality and Pollution Data
        </h1>
      </div> */}
  {/* Leaflet Map */}
  <div className="relative flex flex-col lg:flex-row w-full">
  {/* Left Side - Map (20%) */}
  <div className={`w-full lg:w-[30%] ml-2 mt-6 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'} lg:h-[calc(100vh-80px)]`}>
    <Suspense fallback={<div>Loading...</div>}>
      <Leafletmap />
    </Suspense>
  </div>

  {/* Right Side - Main Content (80%) */}
  <div className="flex flex-col items-center justify-center w-full lg:w-[70%] p-4">
    <div
      className={`flex flex-col lg:flex-row p-5 gap-10 rounded-lg shadow-md w-full ${
        isDarkMode ? "bg-gray-700" : "bg-gray-200"
      }`}
    >
      {/* Side Card */}
      <div className="flex justify-center lg:w-[30%] w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <SideCard location="Pune" isDarkMode={isDarkMode} />
        </Suspense>
      </div>

      {/* AQI Table */}
      <div className="flex justify-center lg:w-[65%] w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <GasesTable isDarkMode={isDarkMode} />
        </Suspense>
      </div>
    </div>
  </div>
</div>




      {/* Sensor Data */}
      {/* <div className={`px-4 lg:mt-[600px] sm:mt-[1150px] rounded   border-2 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}> */}
      <div className={`px-4 lg:mt-12 rounded   border-2 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <SensorData darkmode={isDarkMode} />
          <button 
  onClick={onclickHandler} 
  className="bg-green-500 hover:bg-green-600 flex text-center justify-center mx-auto mt-12 mb-4 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
>
  View More
</button>

        </Suspense>
      </div>
   {view && <div className={`px-4 mt-6 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <SensorDatas darkMode={isDarkMode} />
        </Suspense>
      </div>}   

      {/* Chart Data */}
      <div className="flex flex-wrap justify-evenly items-center gap-4">
        <div className={`px-2 mt-6 w-full md:w-1/2 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
          <Suspense fallback={<div>Loading...</div>}>
            <BarChart darkMode={isDarkMode} />
          </Suspense>
        </div>
      </div>

      {/* Predict Section */}
      <div className={` mt-2 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        <Suspense fallback={<div>Loading...</div>}>
          {/* <Predict /> */}
<CurrentAQI/>
        </Suspense>
      </div>
      <div className={`px-4 h-full ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        <Suspense fallback={<div>Loading...</div>}>
          {/* <Predict /> */}
<LiveAQI isdarkMode={isDarkMode}/>
        </Suspense>
      </div>

      {/* Pollutant Table */}
      {/* <div className={`px-4 lg:mt-0 mt-6 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        {view && (
          <Suspense fallback={<div>Loading...</div>}>
            <PollutantTable isDarkMode={isDarkMode} />
          </Suspense>
        )}
      </div> */}
 {/* Questions Section */}
 <div className={`px-4 mt-6 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        <Suspense fallback={<div>Loading...</div>}>
         <Predict2/>
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
