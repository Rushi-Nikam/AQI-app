import React from 'react';

const Gases = () => {
  const gases = [
    { name: 'SO₂', label: 'Sulfur Dioxide', unit: 'ppm', value: 0.005, max: 0.5 }, // 0.5 ppm for 10 min
    { name: 'CO', label: 'Carbon Monoxide', unit: 'ppm', value: 1.5, max: 9 }, // 9 ppm for 8 hours
    { name: 'NO₂', label: 'Nitrogen Dioxide', unit: 'ppm', value: 0.02, max: 0.1 }, // 0.1 ppm for 1 hour
    { name: 'PM2.5', label: 'Fine Particles (PM2.5)', unit: 'µg/m³', value: 25, max: 25 }, // 25 µg/m³ for 24 hours
    { name: 'PM10', label: 'Coarse Particles (PM10)', unit: 'µg/m³', value: 50, max: 50 }, // 50 µg/m³ for 24 hours
    { name: 'O₃', label: 'Ozone', unit: 'ppm', value: 0.07, max: 0.08 }, // 0.08 ppm for 8 hours
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-4 w-full rounded-lg">
      {gases.map((gas, index) => (
        <div
          key={index}
          className="bg-white shadow-md p-4 rounded-lg flex flex-col items-center justify-center"
        >
          {/* Gas Symbol and Label */}
          <div className='flex gap-5 items-center m-auto h-20'> {/* Increased height to h-20 (5rem) */}
            <div className="text-2xl m-auto bg-blue-600 font-bold rounded-full p-2 text-white">{gas.name}</div>
            <div className="text-xl text-gray-700 mt-2">{gas.label}</div>
          </div>

          {/* Progress Bar */}
          <div className="w-full mt-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(gas.value / gas.max) * 100}% `, overflow: `hidden` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-2 text-right">
              {`${gas.value} ${gas.unit}`}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gases;
