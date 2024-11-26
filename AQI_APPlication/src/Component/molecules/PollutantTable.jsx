import React, { useState } from 'react';


// Data for pollutants
const pollutantData = {

    AQI: [
      { range: "(0 to 50)", description: "The air is clean and free from harmful pollutants, making it perfect for outdoor activities without any health risks.", message: "Good", image: "Images/1.png" },
      { range: "(51 to 100)", description: "The air quality is generally acceptable, though sensitive individuals may experience slight discomfort.", message: "Moderate", image: "Images/2.png" },
      { range: "(101 to 200)", description: "Breathing might feel slightly uncomfortable, particularly for individuals with respiratory conditions.", message: "Poor", image: "Images/3.png" },
      { range: "(201 to 300)", description: "This air quality poses significant risks to children, pregnant women, and the elderly. It is advisable to limit outdoor activities.", message: "Unhealthy", image: "Images/4.png" },
      { range: "(301 to 400)", description: "Prolonged exposure may lead to chronic health issues or organ damage. It is strongly advised to avoid outdoor activities.", message: "Severe", image: "Images/5.png" },
      { range: "(401 to 500+)", description: "Pollution levels are dangerously high, posing life-threatening health risks with prolonged exposure.", message: "Hazardous", image: "Images/6.png" },
    ],
    PM: [
      { range: "(0 to 30)", description: "Low particulate matter.", message: "Good", image: "Images/1.png" },
      { range: "(31 to 60)", description: "Moderate particulate levels.", message: "Moderate", image: "Images/2.png" },
      { range: "(61 to 90)", description: "High particulate levels.", message: "Poor", image: "Images/3.png" },
      { range: "(91 to 120)", description: "Very high particulate levels.", message: "Unhealthy", image: "Images/4.png" },
      { range: "(121 to 250)", description: "Severe health effects.", message: "Severe", image: "Images/5.png" },
      { range: "(250 to 380+)", description: "Hazardous particulate levels.", message: "Hazardous", image: "Images/6.png" },
    ],
    Ozone: [
      { range: "(0 to 50)", description: "Safe ozone levels.", message: "Good", image: "Images/1.png" },
      { range: "(51 to 100)", description: "Moderate ozone levels.", message: "Moderate", image: "Images/2.png" },
      { range: "(101 to 168)", description: "Unhealthy ozone levels for sensitive groups.", message: "Poor", image: "Images/3.png" },
      { range: "(169 to 208)", description: "Unhealthy for all groups.", message: "Unhealthy", image: "Images/4.png" },
      { range: "(209 to 748)", description: "Very high ozone levels.", message: "Severe", image: "Images/5.png" },
      { range: "(749 to 1250+)", description: "Hazardous ozone levels.", message: "Hazardous", image: "Images/6.png" },
    ],
    CO: [
      { range: "(0 to 9534)", description: "Low carbon monoxide levels.", message: "Good", image: "Images/1.png" },
      { range: "(9534 to 19090)", description: "Moderate carbon monoxide levels.", message: "Moderate", image: "Images/2.png" },
      { range: "(19090 to 28672)", description: "High carbon monoxide levels.", message: "Poor", image: "Images/3.png" },
      { range: "(28672 to 38253)", description: "Unhealthy carbon monoxide levels.", message: "Unhealthy", image: "Images/4.png" },
      { range: "(38253 to 47741)", description: "Very unhealthy carbon monoxide levels.", message: "Server", image: "Images/5.png" },
      { range: "(47741 to 57323+)", description: "Hazardous carbon monoxide levels.", message: "Hazardous", image: "Images/6.png" },
    ],
    SO2: [
      { range: "(0 to 40)", description: "Safe nitrogen dioxide levels.", message: "Good", image: "Images/1.png" },
      { range: "(41 to 80)", description: "Moderate nitrogen dioxide levels.", message: "Moderate", image: "Images/2.png" },
      { range: "(81 to 380)", description: "High nitrogen dioxide levels.", message: "Poor", image: "Images/3.png" },
      { range: "(380 to 800)", description: "Very high nitrogen dioxide levels.", message: "Unhealthy", image: "Images/4.png" },
      { range: "(800 to 1600)", description: "Severe health risks.", message: "Server", image: "Images/5.png" },
      { range: "(1600 to 2600+)", description: "Hazardous nitrogen dioxide levels.", message: "Hazardous", image: "Images/6.png" },
    ],
    NO2: [
      { range: "(0 to 40)", description: "Low sulfur dioxide levels.", message: "Good", image: "Images/1.png" },
      { range: "(41 to 80)", description: "Moderate sulfur dioxide levels.", message: "Moderate", image: "Images/2.png" },
      { range: "(81 to 180)", description: "High sulfur dioxide levels.", message: "Poor", image: "Images/3.png" },
      { range: "(181  to 190)", description: "Unhealthy sulfur dioxide levels.", message: "Unhealthy", image: "Images/4.png" },
      { range: "(191 to 400)", description: "Very high sulfur dioxide levels.", message: "Server", image: "Images/5.png" },
      { range: "(401 to 500+)", description: "Hazardous sulfur dioxide levels.", message: "Hazardous", image: "Images/6.png" },
    ],
  
};

const PollutantDivTable = ({isDarkMode}) => {
  const [selectedPollutant, setSelectedPollutant] = useState('AQI');

  const handleButtonClick = (pollutant) => {
    setSelectedPollutant(pollutant);
  };

  const data = pollutantData[selectedPollutant];
  
  const getMessageColor = (message) => {
    switch (message) {
      case 'Good':
        return 'bg-green-500 text-white';
      case 'Moderate':
        return 'bg-yellow-500 text-white';
      case 'Poor':
        return 'bg-orange-500 text-white';
      case 'Unhealthy':
        return 'bg-red-500 text-white';
      case 'Severe':
        return 'bg-[#eb509c] text-white';
      case 'Hazardous':
        return 'bg-[#c51f30] text-white';
      default:
        return '';
    }
  };

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
{/* Table rows */}
{data.map((item, index) => (
  <div
    key={index}
    className={`flex items-center p-4 rounded-lg transition relative h-20 ${
      isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-100'
    }`}
  >
   <div className='flex'>
   <div className="flex-1 p-4 ">
      <div>{item.range}</div>
      <div className={` p-4 ${getMessageColor(item.message)} w-[10px] flex justify-center items-center`}>
      </div>
      <div>{item.message}</div>
    </div>
   </div>
   
<div className='flex-1 p-4 justify-center'>
<div  >{item.description}</div>
</div>
   

    {/* Added margin-left to create spacing between description and image */}
    <div className="absolute ml-[1100px] lg:ml-[970px]">
      <img src={item.image} alt={item.message} className="w-20 h-32 m-auto" />
    </div>
  </div>
))}

</div>


    </div>
  );
};

export default PollutantDivTable;
