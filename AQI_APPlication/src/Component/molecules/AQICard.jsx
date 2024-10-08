import React from 'react';

const AQICard = () => {
  // AQI data with ranges, health categories, and colors
  const aqiLevels = [
    { range: '0-50', category: 'Good', color: 'bg-green-500'},
    { range: '51-100', category: 'Moderate', color: 'bg-yellow-400'},
    { range: '101-150', category: 'Unhealthy for Sensitive Groups', color: 'bg-orange-400'},
    { range: '151-200', category: 'Unhealthy', color: 'bg-red-500' },
    { range: '201-300', category: 'Very Unhealthy', color: 'bg-purple-600'},
    { range: '301-500', category: 'Hazardous', color: 'bg-maroon-700'},
  ];

  return (
    <main className='w-[390px]  bg-white lg:mr-8 max-w-xl h-auto p-6 rounded-lg shadow-lg'>
      <div className="text-lg font-bold mb-4">Air Quality Index (AQI) Standards</div>
      
      {/* Table of AQI levels */}
      <table className="w-full border-separate" style={{ borderSpacing: '0 8px' }}>
        <thead >
          <tr >
            <th className="py-2  text-center">AQI Range</th> {/* Center the title */}
            <th className="py-2  text-center">Category</th> {/* Center the title */}
          </tr>
        </thead>
        <tbody>
          {aqiLevels.map((level, index) => (
            <tr key={index} className={`h-12 ${level.color} text-white`}>
              <td className="py-2 px-3 border-r border-white text-center">{level.range}</td> {/* White line and centered text */}
              <td className="py-2 px-3 text-center">{level.category}</td> {/* Center the text */}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default AQICard;
