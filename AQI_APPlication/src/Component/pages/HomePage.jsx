import React, { Suspense, useState } from 'react';
import PollutantTable from '../molecules/PollutantTable';
import Questions from '../molecules/Questions';
import BarChart from '../molecules/BarChart';
import SensorData from '../molecules/SensorData';
import SensorDatas from '../molecules/SensorDatas';
import { FcAbout } from "react-icons/fc";
import Predict from '../molecules/Predict';
const GasesTable = React.lazy(() => import('../molecules/GasesTable'));
const SideCard = React.lazy(() => import('../molecules/SideCard'));
const Leafletmap = React.lazy(() => import('../Map/Leafletmap'));

const HomePage = ({ isDarkMode }) => {
  const [view, setView] = useState(false);

  const onclickHandler = () => {
    setView(!view);
  };

  return (
    <div className={`py-4 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'} w-full`}>
      {/* Header */}
      <div className="flex justify-center px-4">
        <h1 className={`font-serif text-2xl md:text-3xl font-bold mb-5 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Pune AQI Status | Live Air Quality and Pollution Data
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col-reverse lg:flex-row lg:mx-20 my-4 gap-8 lg:gap-12 px-4">
        {/* Side Card */}
        <div className="flex justify-center lg:w-1/3 relative">
          <Suspense fallback={<div>Loading...</div>}>
            <SideCard location="Pune" isDarkMode={isDarkMode} />
            {/* <div className="mt-[410px] cursor-pointer lg:ml-[250px] absolute flex text-2xl">
              <FcAbout onClick={onclickHandler} />
            </div> */}
          </Suspense>
        </div>

        {/* Leaflet Map */}
        <div className="flex justify-center lg:w-4/5 w-full">
          <Suspense fallback={<div>Loading...</div>}>
            <Leafletmap />
          </Suspense>
        </div>
      </div>

      {/* AQI Table */}
      <div className="flex flex-col lg:flex-row lg:justify-center items-center px-4">
        <div className={`w-full max-h-[350px] ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
          <Suspense fallback={<div>Loading...</div>}>
            <GasesTable isDarkMode={isDarkMode} />
          </Suspense>
        </div>
      </div>

      {/* Sensor Data */}
      <div className={`px-4 mt-6 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <SensorData darkmode={isDarkMode} />
        </Suspense>
      </div>
      <div className={`px-4 mt-6 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <SensorDatas darkMode={isDarkMode} />
        </Suspense>
      </div>

      {/* Chart Data */}
      <div className="flex flex-wrap justify-evenly items-center gap-4">
        <div className={`px-4 mt-6 w-full md:w-1/2 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
          <Suspense fallback={<div>Loading...</div>}>
            <BarChart darkMode={isDarkMode} />
          </Suspense>
        </div>
      </div>

      {/* Predict Section */}
      <div className={`px-4 mt-10 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Predict />
        </Suspense>
      </div>

      {/* Pollutant Table */}
      <div className={`px-4 lg:mt-0 mt-6 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        {view && (
          <Suspense fallback={<div>Loading...</div>}>
            <PollutantTable isDarkMode={isDarkMode} />
          </Suspense>
        )}
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
