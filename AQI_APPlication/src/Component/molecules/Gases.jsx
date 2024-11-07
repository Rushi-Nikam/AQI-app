import React, { useEffect, useState } from 'react';

const Gases = () => {
  const [gases, setGases] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 bg-white sm:grid-cols-2 gap-3 w-[350px] h-[400px] rounded-lg">
      {gases.map((gas, index) => (
        <div
          key={index}
          className="shadow-md p-4 rounded-lg flex flex-col items-center justify-center"
        >
          <div className="flex gap-1 items-center m-auto h-2">
            <div className="text-xs m-auto bg-blue-600 font-bold rounded-full p-2 text-white">{gas.name}</div>
            <div className="text-xs text-gray-700 mt-2">{gas.label}</div>
          </div>
          <div className="w-full mt-8">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(gas.value / gas.max) * 100}%`, overflow: 'hidden' }}
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
