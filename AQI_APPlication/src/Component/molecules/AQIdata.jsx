import React from 'react';

const AQIdata = ({ isDarkMode }) => { // Receive the dark mode state as a prop
  const aqiData = [
    {
      title: 'Good (0-50)',
      description: 'Air quality is satisfactory, and air pollution poses little or no risk. No special precautions are necessary.',
      backgroundColor: isDarkMode ? 'bg-gray-800' : 'bg-green-100',
      textColor: isDarkMode ? 'text-green-400' : 'text-green-600',
    },
    {
      title: 'Moderate (51-100)',
      description: 'Air quality is acceptable; however, there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.',
      backgroundColor: isDarkMode ? 'bg-gray-800' : 'bg-yellow-100',
      textColor: isDarkMode ? 'text-yellow-400' : 'text-yellow-600',
    },
    {
      title: 'Unhealthy for Sensitive Groups (101-150)',
      description: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected. Minimize outdoor activities for those sensitive.',
      backgroundColor: isDarkMode ? 'bg-gray-800' : 'bg-orange-100',
      textColor: isDarkMode ? 'text-orange-400' : 'text-orange-600',
    },
    {
      title: 'Unhealthy (151-200)',
      description: 'Everyone may begin to experience health effects; sensitive groups may experience more serious health effects. Limit prolonged outdoor activities.',
      backgroundColor: isDarkMode ? 'bg-gray-800' : 'bg-red-100',
      textColor: isDarkMode ? 'text-red-400' : 'text-red-600',
    },
    {
      title: 'Very Unhealthy (201-300)',
      description: 'Health alert: everyone may experience more serious health effects. Avoid outdoor activities and stay indoors if possible.',
      backgroundColor: isDarkMode ? 'bg-gray-800' : 'bg-purple-100',
      textColor: isDarkMode ? 'text-purple-400' : 'text-purple-600',
    },
    {
      title: 'Hazardous (301 and above)',
      description: 'Health warnings of emergency conditions. The entire population is more likely to be affected. Stay indoors and avoid outdoor exposure.',
      backgroundColor: isDarkMode ? 'bg-gray-800' : 'bg-maroon-100',
      textColor: isDarkMode ? 'text-maroon-400' : 'text-maroon-600',
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto my-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Importance of Air Quality Index (AQI)</h1>
      <p className="mb-8 text-lg text-gray-700 text-center">
        The Air Quality Index (AQI) is a crucial tool that helps in determining air pollution levels and understanding its impact on health. Knowing the AQI allows individuals and communities to take necessary precautions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aqiData.map((aqi, index) => (
          <div key={index} className={`p-6 border rounded-lg shadow-lg ${aqi.backgroundColor}`}>
            <h3 className={`font-semibold text-xl ${aqi.textColor} mb-4`}>{aqi.title}</h3>
            <p className="text-gray-700">{aqi.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AQIdata;
