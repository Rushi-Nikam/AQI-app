import React from 'react';
import { Link } from 'react-router-dom';

const AQITable = ({isDarkMode}) => {
  // Data for Pune localities with AQI and gases values, sorted from highest to lowest AQI
  const cityData = [
    { locality: 'Hadapsar', aqi: 200, so2: 0.035, co: 7.0, no2: 0.075, pm25: 60, pm10: 85, o3: 0.100 },
    { locality: 'Chinchwad', aqi: 180, so2: 0.030, co: 6.0, no2: 0.072, pm25: 58, pm10: 87, o3: 0.098 },
    { locality: 'Kharadi', aqi: 170, so2: 0.022, co: 5.5, no2: 0.065, pm25: 55, pm10: 82, o3: 0.095 },
    { locality: 'Pimpri', aqi: 160, so2: 0.028, co: 5.8, no2: 0.068, pm25: 57, pm10: 83, o3: 0.090 },
    { locality: 'Hinjewadi', aqi: 150, so2: 0.030, co: 6.5, no2: 0.070, pm25: 50, pm10: 80, o3: 0.090 },
    { locality: 'Viman Nagar', aqi: 140, so2: 0.025, co: 5.0, no2: 0.060, pm25: 42, pm10: 78, o3: 0.085 },
    { locality: 'Kalyani Nagar', aqi: 130, so2: 0.020, co: 4.0, no2: 0.055, pm25: 40, pm10: 75, o3: 0.080 },
    { locality: 'Deccan Gymkhana', aqi: 120, so2: 0.015, co: 3.0, no2: 0.050, pm25: 35, pm10: 65, o3: 0.075 },
    { locality: 'Baner', aqi: 110, so2: 0.012, co: 2.0, no2: 0.048, pm25: 32, pm10: 60, o3: 0.072 },
    { locality: 'Kothrud', aqi: 95, so2: 0.007, co: 1.8, no2: 0.045, pm25: 30, pm10: 55, o3: 0.065 },
    { locality: 'Nigdi', aqi: 90, so2: 0.010, co: 2.0, no2: 0.045, pm25: 28, pm10: 50, o3: 0.070 },  // Added Nigdi
    { locality: 'Shivajinagar', aqi: 85, so2: 0.010, co: 2.5, no2: 0.040, pm25: 22, pm10: 45, o3: 0.070 },
    { locality: 'Wakad', aqi: 75, so2: 0.008, co: 2.2, no2: 0.035, pm25: 25, pm10: 48, o3: 0.068 },
    { locality: 'Aundh', aqi: 65, so2: 0.005, co: 1.2, no2: 0.030, pm25: 20, pm10: 40, o3: 0.060 },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pune City AQI and Gases Data (High to Low AQI)</h2>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className={`${isDarkMode?` bg-gray-500`:`bg-gray-200`}`}>
            <th className="border px-4 py-2">Locality</th>
            <th className="border px-4 py-2">AQI</th>
            <th className="border px-4 py-2">SO₂ (ppm)</th>
            <th className="border px-4 py-2">CO (ppm)</th>
            <th className="border px-4 py-2">NO₂ (ppm)</th>
            <th className="border px-4 py-2">PM2.5 (µg/m³)</th>
            <th className="border px-4 py-2">PM10 (µg/m³)</th>
            <th className="border px-4 py-2">O₃ (ppm)</th>
          </tr>
        </thead>
        <tbody>
          {cityData.map((city, index) => (
            <tr key={index} className="text-center">
              <td className="border px-4 py-2">
                <Link to={`/locality/${city.locality}`} className="text-blue-500 hover:underline">
                  {city.locality}
                </Link>
              </td>
              <td className="border px-4 py-2">{city.aqi}</td>
              <td className="border px-4 py-2">{city.so2}</td>
              <td className="border px-4 py-2">{city.co}</td>
              <td className="border px-4 py-2">{city.no2}</td>
              <td className="border px-4 py-2">{city.pm25}</td>
              <td className="border px-4 py-2">{city.pm10}</td>
              <td className="border px-4 py-2">{city.o3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AQITable;
