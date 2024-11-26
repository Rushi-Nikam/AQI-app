import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CityTable = ({ isDarkMode }) => {
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const aqi = "gao";
  useEffect(() => {
    // Fetch data from the backend API using fetch
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/city');
        console.log("Response:", response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Data:", data);
        setCityData(data);
      } catch (error) {
        console.error('Error fetching AQI data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching AQI data: {error}</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{aqi} City AQI and Gases Data (High to Low AQI)</h2>
      <table className="table-auto w-full border-collapse" aria-label="AQI and gas data for Pune localities">
        <thead>
          <tr className={`${isDarkMode ? 'bg-gray-500' : 'bg-gray-200'}`}>
            <th className="border px-4 py-2">Locality</th>
            <th className="border px-4 py-2">AQI</th>
            <th className="border px-4 py-2">SO₂ (µg/m³)</th>
            <th className="border px-4 py-2">CO (µg/m³)</th>
            <th className="border px-4 py-2">NO₂ (µg/m³)</th>
            <th className="border px-4 py-2">PM2.5 (µg/m³)</th>
            <th className="border px-4 py-2">PM10 (µg/m³)</th>
            <th className="border px-4 py-2">O₃ (µg /m³)</th>
          </tr>
        </thead>
        <tbody>
          {cityData.map((city) => (
            <tr key={city.locality} className="text-center">
              <td className="border px-4 py-2">
                <Link to={`/cityd/${city.locality}`} className="text-blue-500 hover:underline">
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

export default CityTable;
