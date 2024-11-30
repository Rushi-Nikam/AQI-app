

// import React, { useEffect, useState } from 'react';
// import GasCard from './GasCard';

// const Gases = () => {
//   const [value, setValue] = useState([]);
//   const [gases, setGases] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchGases = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/gases');
//         if (response.ok) {
//           const data = await response.json();
//           setGases(data); // Assuming data is an array of gas objects
//           setLoading(false);
//         } else {
//           console.error('Error fetching gas data');
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     };

//     fetchGases();
//   }, []);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://192.168.165.5:8000/api/get-data/');
//         if (!response.ok) throw new Error('Network response was not ok');
//         const data = await response.json();
//         const latestAQIValue = data.length > 0 ? Math.round(data[data.length - 1].value) : 'N/A';
//         setValue(latestAQIValue);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching AQI data:', error);
//       }
//     };

//     fetchData();
//   }, []);


//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="grid grid-cols-1 bg-white sm:grid-cols-2 gap-3 w-[350px] h-[400px] rounded-lg">
//       {gases.map((gas, index) => (
//         <div
//           key={index}
//           className="shadow-md p-4 rounded-lg flex flex-col items-center justify-center"
//         >
//           <div className="flex gap-1 items-center m-auto h-2">
//             <div className="text-xs m-auto bg-blue-600 font-bold rounded-full p-2 text-white">{gas.name}</div>
//             <div className="text-xs text-gray-700 mt-2">{gas.label}</div>
//           </div>
//           <div className="w-full mt-8">
//             <div className="h-2 bg-gray-200 rounded-full">
//               <div
//                 className="h-full bg-blue-500 rounded-full"
//                 style={{ width: `${(gas.value / gas.max) * 100}%`, overflow: 'hidden' }}
//               ></div>
//             </div>
//             <div className="text-xs text-gray-600 mt-2 text-right">
//               {`${gas.value} ${gas.unit}`}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//     // <div className='grid  grid-rows-1 w-[350px] bg-red-400 h-[400px]'>
//     //   <GasCard/>
//     //   <GasCard/>
//     //   <GasCard/>
//     // </div>
//   );
// };

// export default Gases;

import React, { useEffect, useState } from 'react';

const Gases = () => {
  const [value, setValue] = useState([]); // For AQI values
  const [gases, setGases] = useState([
    {
      name: 'CO',
      label: 'Carbon Monoxide',
      unit: 'mg/m³',
      value: 7.5,
      max: 10
    },
    {
      name: 'PM2.5',
      label: 'Particulate Matter (2.5 µm)',
      unit: 'µg/m³',
      value: 35,
      max: 60
    },
    {
      name: 'PM10',
      label: 'Particulate Matter (10 µm)',
      unit: 'µg/m³',
      value: 70,
      max: 100
    },
    {
      name: 'O₃',
      label: 'Ozone',
      unit: 'ppm',
      value: 0.12,
      max: 0.2
    },
    {
      name: 'SO₂',
      label: 'Sulfur Dioxide',
      unit: 'ppm',
      value: 0.03,
      max: 0.5
    },
    {
      name: 'NO₂',
      label: 'Nitrogen Dioxide',
      unit: 'ppm',
      value: 0.06,
      max: 0.1
    }
  ]); // Dummy gas data
  const [loading, setLoading] = useState(false); // Disable loading since data is predefined

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
