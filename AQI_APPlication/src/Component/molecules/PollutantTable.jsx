import React, { useState } from 'react';

// Data for pollutants
const pollutantData = {
    AQI: [
        { range: '0-50', description: 'Good air quality, suitable for all groups.', message: 'Good', image:`Images/1.png`  },
        { range: '51-100', description: 'Moderate air quality, acceptable for most.', message: 'Moderate', image: 'Images/2.png' },
        { range: '101-150', description: 'Unhealthy for sensitive groups.', message: 'Unhealthy for Sensitive Groups', image: 'Images/3.png' },
        { range: '151-200', description: 'Unhealthy for all groups.', message: 'Unhealthy', image: 'Images/4.png' },
        { range: '201-300', description: 'Very unhealthy air quality.', message: 'Very Unhealthy', image: 'Images/5.png' },
        { range: '301-500', description: 'Hazardous air quality.', message: 'Hazardous', image: 'Images/6 .png' },
      ],
      PM: [
        { range: '0-30 µg/m³', description: 'Low particulate matter.', message: 'Good', image: 'Images/1.png' },
        { range: '31-60 µg/m³', description: 'Moderate particulate levels.', message: 'Moderate', image: 'Images/2.png' },
        { range: '61-90 µg/m³', description: 'High particulate levels.', message: 'Poor', image: 'Images/3.png' },
        { range: '91-120 µg/m³', description: 'Very high particulate levels.', message: 'Unhealthy', image: 'Images/4.png' },
        { range: '121-250 µg/m³', description: 'Severe health effects.', message: 'Very Unhealthy', image: 'Images/5.png' },
        { range: '>250 µg/m³', description: 'Hazardous particulate levels.', message: 'Hazardous', image: 'Images/6.png' },
      ],
      Ozone: [
        { range: '0-70 ppb', description: 'Safe ozone levels.', message: 'Good', image: 'Images/1.png' },
        { range: '71-85 ppb', description: 'Moderate ozone levels.', message: 'Moderate', image: 'Images/2.png' },
        { range: '86-105 ppb', description: 'Unhealthy ozone levels for sensitive groups.', message: 'Unhealthy for Sensitive Groups', image: 'Images/3.png' },
        { range: '106-200 ppb', description: 'Unhealthy for all groups.', message: 'Unhealthy', image: 'Images/4.png' },
        { range: '201-300 ppb', description: 'Very high ozone levels.', message: 'Very Unhealthy', image: 'Images/5.png' },
        { range: '>300 ppb', description: 'Hazardous ozone levels.', message: 'Hazardous', image: 'Images/6.png' },
      ],
      CO: [
        { range: '0-4.4 ppm', description: 'Low carbon monoxide levels.', message: 'Good', image: 'Images/1.png' },
        { range: '4.5-9.4 ppm', description: 'Moderate carbon monoxide levels.', message: 'Moderate', image: 'Images/2.png' },
        { range: '9.5-12.4 ppm', description: 'High carbon monoxide levels.', message: 'Poor', image: 'Images/3.png' },
        { range: '12.5-15.4 ppm', description: 'Unhealthy carbon monoxide levels.', message: 'Unhealthy', image: 'Images/4.png' },
        { range: '15.5-30 ppm', description: 'Very unhealthy carbon monoxide levels.', message: 'Very Unhealthy', image: 'Images/5.png' },
        { range: '>30 ppm', description: 'Hazardous carbon monoxide levels.', message: 'Hazardous', image: 'Images/6.png' },
      ],
      NO2: [
        { range: '0-50 ppb', description: 'Safe nitrogen dioxide levels.', message: 'Good', image: 'Images/1.png' },
        { range: '51-100 ppb', description: 'Moderate nitrogen dioxide levels.', message: 'Moderate', image: 'Images/2.png' },
        { range: '101-200 ppb', description: 'High nitrogen dioxide levels.', message: 'Poor', image: 'Images/3.png' },
        { range: '201-300 ppb', description: 'Very high nitrogen dioxide levels.', message: 'Unhealthy', image: 'Images/4.png' },
        { range: '301-400 ppb', description: 'Severe health risks.', message: 'Very Unhealthy', image: 'Images/5.png' },
        { range: '>400 ppb', description: 'Hazardous nitrogen dioxide levels.', message: 'Hazardous', image: 'Images/6.png' },
      ],
      SO2: [
        { range: '0-75 ppb', description: 'Low sulfur dioxide levels.', message: 'Good', image: 'Images/1.png' },
        { range: '76-185 ppb', description: 'Moderate sulfur dioxide levels.', message: 'Moderate', image: 'Images/2.png' },
        { range: '186-304 ppb', description: 'High sulfur dioxide levels.', message: 'Poor', image: 'Images/3.png' },
        { range: '305-604 ppb', description: 'Unhealthy sulfur dioxide levels.', message: 'Unhealthy', image: 'Images/4.png' },
        { range: '605-804 ppb', description: 'Very high sulfur dioxide levels.', message: 'Very Unhealthy', image: 'Images/5.png' },
        { range: '>805 ppb', description: 'Hazardous sulfur dioxide levels.', message: 'Hazardous', image: 'Images/6.png' },
      ],
};

const PollutantDivTable = ({isDarkMode}) => {
  const [selectedPollutant, setSelectedPollutant] = useState('AQI');

  const handleButtonClick = (pollutant) => {
    setSelectedPollutant(pollutant);
  };

  const data = pollutantData[selectedPollutant];

  return (
    <div  className={` w-full p-6 rounded-lg shadow-lg`}>
      {/* Buttons for pollutant selection */}
      <div className={`${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'} flex gap-[70px] justify-center text-xl bg-[#e7eef4] rounded-2xl  items-center mb-6`}>
        {Object.keys(pollutantData).map((pollutant) =>(
          <button
            key={pollutant}
            onClick={() => handleButtonClick(pollutant)}
            className={`px-4 py-2  rounded-2xl w-[150px] ${
              selectedPollutant === pollutant
              ? isDarkMode
                ? 'bg-blue-700 text-white'
                : 'bg-blue-500 text-white'
              : isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-500'
          }`}
          >
            {pollutant}
          </button>
        ))}
      </div>

      {/* Div-based table */}
      <div className="flex w-[1100px] lg:ml-[140px] flex-col justify-center m-auto gap-y-4">
  {/* Table rows */}
  {data.map((item, index) => (
    <div
    key={index}
    className={`flex items-center p-4 rounded-lg transition ${
      isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-100'
    }`}
    >
      <div className="flex-1 p-4">{item.range}</div>
      <div className="flex-2 p-4">{item.description}</div>
      {/* <div className="flex-1 p-4">{item.message}</div> */}
      <div className="flex-1 p-4">
        <img src={item.image} alt={item.message} className="w-24 h-30  mx-auto" />
        <div className='w-10 h-10 mx-auto'>{item.message}</div>
      </div>
    </div>
  ))}
</div>


    </div>
  );
};

export default PollutantDivTable;
