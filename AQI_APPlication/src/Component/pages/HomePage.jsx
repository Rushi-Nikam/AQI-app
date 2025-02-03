import React, { Suspense, useState } from 'react';

import Questions from '../molecules/Questions';
import BarChart from '../molecules/BarChart';
import SensorData from '../molecules/SensorData';
import SensorDatas from '../molecules/SensorDatas';

import CurrentAQI from '../molecules/CurrentAQI';
import LiveAQI from './LiveAQI';
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
  <div className='relative '>
  <div className="flex flex-col z-10  lg:flex-row lg:justify-center  items-center ">
        <div className={`w-full max-h-4xl  ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
          <Suspense fallback={<div>Loading...</div>}>
            <Leafletmap />
          </Suspense>
        </div>
      </div>
      {/* Main Content */}
      <div className={`flex items-center p-14 flex-col-reverse absolute z-50 top-96 ${isDarkMode?"bg-gray-700":"bg-gray-200"} rounded-[5%] lg:flex-row lg:mx-20 lg:my-4 gap-8  lg:px-4 `}>
        {/* Side Card */}
        <div className="flex justify-center lg:w-[50%]  relative">
          <Suspense fallback={<div>Loading...</div>}>
            <SideCard location="Pune" isDarkMode={isDarkMode} />
            {/* <div className="mt-[410px] cursor-pointer lg:ml-[250px] absolute flex text-2xl">
              <FcAbout onClick={onclickHandler} />
            </div> */}
          </Suspense>
        </div>

      {/* AQI Table */}
        <div className="flex justify-center lg:w-4/5 w-full">
          <Suspense fallback={<div>Loading...</div>}>
            <GasesTable isDarkMode={isDarkMode} />
          </Suspense>
        </div>
      </div>

      </div>

      {/* Sensor Data */}
      <div className={`px-4 lg:mt-[600px] sm:mt-[1150px] rounded   border-2 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
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
          <Questions isDarkMode={isDarkMode} />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
