import React, { useEffect, useState } from 'react';

const GasesTable = ({ isDarkMode }) => {
  const [gases, setGases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState([30]);

  useEffect(() => {
    const fetchGases = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/gases');
        if (response.ok) {
          const data = await response.json();
          setGases(data); // Assuming data is an array of gas objects
          setLoading(false);
        } else {
          console.error('Error fetching gas data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchGases();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.165.5:8000/api/get-data/');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const latestAQIValue = data.length > 0 ? Math.round(data[data.length - 1].value) : 'N/A';
        setValue(latestAQIValue);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching AQI data:', error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cursor-pointer ">
      <div className="flex justify-center text-2xl mt-3 font-bold">
        <h1>Gases responsible for AQI Index</h1>
      </div>

      <div
        className={`grid grid-cols-1 sm:grid-cols-3 gap-3 lg:w-[1400px] h-auto mb-[200px] mt-[50px] rounded-lg ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
      >
        {gases.map((gas, index) => (
          <div
            key={index}
            className={`shadow-md rounded-lg flex flex-col justify-between items-center p-4 ${
              isDarkMode ? 'bg-gray-700 text-[#82909d] hover:border-[1px] border-solid border-white' : 'bg-[#f7f7fc] text-gray-700 hover:border-[1px] border-solid border-black'
            } ` }
          >
            <div className="flex gap-3 text-center items-center">
              <div
                className={`text-xl font-bold rounded-full p-2 ${
                  isDarkMode ? 'bg-gray-600 text-[#82909d]' : 'bg-blue-600 text-white'
                }`}
              >
                {gas.name}
              </div>
              <div className="text-2xl">{gas.label}</div>
              <div
                className={`text-xl flex flex-col justify-center items-end text-right ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-[#f7f7fc] text-gray-700'
                }`}
              >
                {`${gas.value}`}
                <div>{gas.unit}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full mt-4">
              <div className="h-4 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
                  }`}
                  style={{
                    width: `${(gas.value / value) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="text-xs mt-2 text-right">
                {`(${gas.value} / ${gas.max} ${gas.unit})`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GasesTable;
