import React from 'react';

const AQICard = ({ isDarkMode }) => {
  // AQI data with ranges, health categories, and colors
  const aqiLevels = [
    { range: '0-50', category: 'Good', color: 'bg-green-500' },
    { range: '51-100', category: 'Moderate', color: 'bg-yellow-400' },
    { range: '101-150', category: 'Unhealthy for Sensitive Groups', color: 'bg-orange-400' },
    { range: '151-200', category: 'Unhealthy', color: 'bg-red-500' },
    { range: '201-300', category: 'Very Unhealthy', color: 'bg-purple-600' },
    { range: '301-500', category: 'Hazardous', color: 'bg-rose-700' },
  ];

  return (
    <main className={`w-[390px] ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-800'} lg:mr-8 max-w-xl h-auto p-6 rounded-lg shadow-lg`}>
      <div className="text-lg font-bold mb-4">
        Air Quality Index (AQI) Standards
      </div>
      
      {/* Table of AQI levels */}
      <table 
        className="w-full border-separate" 
        style={{ borderSpacing: '0 8px' }} 
        aria-label="AQI Levels"
      >
        <thead>
          <tr className={isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}>
            <th className="py-2 text-center">AQI Range</th>
            <th className="py-2 text-center">Category</th>
          </tr>
        </thead>
        <tbody>
          {aqiLevels.map((level, index) => (
            <tr key={index} className={`${level.color} text-white`}>
              <td className="py-2 px-3 text-center">{level.range}</td>
              <td className="py-2 px-3 text-center">{level.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default AQICard;
