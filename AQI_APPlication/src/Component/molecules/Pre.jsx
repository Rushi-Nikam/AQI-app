import React from 'react';
import { Link } from 'react-router-dom';

const precautionsData = [
  {
    level: "Good",
    aqiRange: "0 - 50",
    color: "bg-green-500",
    description: "Air quality is satisfactory. Air pollution poses little or no risk.",
    precautions: ["Enjoy outdoor activities without restrictions."],
  },
  {
    level: "Moderate",
    aqiRange: "51 - 100",
    color: "bg-yellow-500",
    description: "Air quality is acceptable. Sensitive people may experience minor health effects.",
    precautions: ["Sensitive individuals should limit prolonged exertion outdoors."],
  },
  {
    level: "Unhealthy for Sensitive Groups",
    aqiRange: "101 - 150",
    color: "bg-orange-500",
    description: "Sensitive groups may experience health effects. The general public is less likely to be affected.",
    precautions: [
      "Sensitive individuals should reduce outdoor activity.",
      "Consider wearing a mask outdoors."
    ],
  },
  {
    level: "Unhealthy",
    aqiRange: "151 - 200",
    color: "bg-red-500",
    description: "Everyone may begin to experience health effects; sensitive groups may face more serious issues.",
    precautions: [
      "Avoid prolonged outdoor activities.",
      "Consider wearing masks."
    ],
  },
  {
    level: "Very Unhealthy",
    aqiRange: "201 - 300",
    color: "bg-purple-600",
    description: "Health alert: everyone may experience serious health effects.",
    precautions: [
      "Stay indoors and avoid outdoor activities.",
      "Use high-quality masks outside."
    ],
  },
];

const Pre = () => {
  return (
    <div className="p-4 w-[600px] max-w-[800px] mx-auto">
      <h1 className="text-xl font-bold text-center mb-4">Precautions for AQI Levels</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
        {precautionsData.map((levelData, index) => (
          <div
          key={index}
          className={`p-2 rounded-lg shadow-lg text-white w-full h-auto ${levelData.color}`}>  
            <h2 className="text-sm font-bold">{levelData.level}</h2>
            <p className="text-xs mt-1">AQI: {levelData.aqiRange}</p>
            <p className="text-xs mt-1">{levelData.description}</p>
            <h3 className="text-xs font-bold mt-2">Precautions:</h3>
            <ul className="text-xs list-disc list-inside mt-1">
              {levelData.precautions.map((precaution, i) => (
                <li key={i}>{precaution}</li>
              ))}
            </ul>
            
            {/* Link to detailed precautions page */}
            <Link
              to={`/detailed-precautions/${levelData.level}`} // Modify the URL as needed
              className="text-xs mt-2 underline text-white focus:outline-none cursor-pointer"
            >
              View More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pre;
