// import React, { useEffect, useState } from "react";
// import { NavLink } from "react-router-dom";

// // Function to get color based on AQI value
// const getAqiColor = (value) => {
//   if (value <= 50) return "rgb(76, 175, 80)"; // Good
//   if (value <= 100) return "rgb(255, 235, 59)"; // Moderate
//   if (value <= 200) return "rgb(255, 152, 0)"; // Unhealthy for Sensitive Groups
//   if (value <= 300) return "rgb(244, 67, 54)"; // Unhealthy
//   if (value <= 400) return "rgb(156, 39, 176)"; // Very Unhealthy
//   return "rgb(139, 0, 0)"; // Hazardous
// };

// const LiveAQI = ({ isdarkMode }) => {
//   const [hourlyAQI, setHourlyAQI] = useState(null);

//   // Dummy data for fallback (24 hours of AQI data for Pune)
//   const dummyData = Array.from({ length: 24 }, (_, index) => ({
//     AQI: Math.floor(Math.random() * 150) + 50, // Random AQI between 50 and 200
//     location: "Pune",
//     timestamp: new Date(Date.now() - index * 3600000).toISOString(), // Each entry is 1 hour apart
//   })).reverse(); // Oldest first, latest last

//   useEffect(() => {
//     // Fetching live AQI data (API call)
//     const fetchHourlyAQI = async () => {
//       try {
//         const response = await fetch(
//            // Updated API endpoint
//         );
//         if (!response.ok) {
//           throw new Error(`Failed to fetch live AQI data: ${response.status}`);
//         }
//         const data = await response.json();
//         setHourlyAQI(data);
//       } catch (error) {
//         console.error("Error fetching live AQI:", error);
//         // Fallback to dummy data in case of an error
//         setHourlyAQI(dummyData);
//       }
//     };

//     fetchHourlyAQI();
//   }, []);

//   if (!hourlyAQI) {
//     return <div className="text-center text-lg">Loading...</div>;
//   }

//   return (
//     <div
//       className={`${
//         isdarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
//       } p-6 h-[500px]`}
//     >
//       <h1 className="text-3xl font-bold text-center mb-8">
//         24-Hour Air Quality Index
//       </h1>

//       {/* Container for horizontal scroll */}
//       <div className="overflow-x-auto">
//         <div className="flex space-x-6">
//           {hourlyAQI.map((item, index) => (
//             <NavLink
//               key={index}
//               to="/pre"
//               className={`flex flex-col items-center justify-center border-2 rounded-lg shadow-lg p-6 ${
//                 isdarkMode
//                   ? "bg-gray-700 border-gray-500"
//                   : "bg-gray-200 border-gray-300"
//               }`}
//             >
//               {/* SVG Circle for AQI */}
//               <div className="relative w-32 h-32">
//                 <svg width="100%" height="100%" viewBox="0 0 120 120">
//                   {/* Background circle */}
//                   <circle
//                     cx="60"
//                     cy="60"
//                     r="50"
//                     fill="none"
//                     stroke={
//                       isdarkMode
//                         ? "rgba(255, 255, 255, 0.2)"
//                         : "rgba(0, 0, 0, 0.1)"
//                     }
//                     strokeWidth="10"
//                   />

//                   {/* Progress circle */}
//                   <circle
//                     cx="60"
//                     cy="60"
//                     r="50"
//                     fill="none"
//                     stroke={getAqiColor(item.AQI)} // Dynamic color based on AQI value
//                     strokeWidth="10"
//                     strokeDasharray="314"
//                     strokeDashoffset={314 - (item.AQI / 500) * 314} // Max value is 500
//                     style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
//                   />
//                 </svg>
//                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-semibold">
//                   {item.AQI}
//                 </div>
//               </div>

//               <p className="mt-4 text-center">
//                 {new Date(item.timestamp).toLocaleString()}
//               </p>
//             </NavLink>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LiveAQI;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const getAqiColor = (aqi) => {
  if (aqi <= 50) return "#00e400";
  if (aqi <= 100) return "#ffff00";
  if (aqi <= 200) return "#ff7e00";
  if (aqi <= 300) return "#ff0000";
  if (aqi <= 400) return "#8f3f97";
  return "#7e0023";
};

const LiveAQI = ({ isdarkMode }) => {
  const [hourlyAQI, setHourlyAQI] = useState(null);

  // Dummy fallback data
  const dummyData = Array.from({ length: 24 }, (_, index) => ({
    AQI: Math.floor(Math.random() * 150) + 50,
    location: "Pune",
    TimestampDays: new Date(Date.now() - index * 3600000).toISOString(),
  })).reverse();

  useEffect(() => {
    const fetchHourlyAQI = async () => {
      try {
        const response = await fetch(
          `http://34.30.30.232:8000/aqi_values/predict_next_5_days/`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch live AQI data: ${response.status}`);
        }
        const data = await response.json();
        setHourlyAQI(data);
      } catch (error) {
        console.error("Error fetching live AQI:", error);
        setHourlyAQI(dummyData);
      }
    };

    fetchHourlyAQI();
  }, []);

  if (!hourlyAQI) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="p-2 dark:bg-gray-900">
      <h2 className="text-2xl lg:text-5xl mb-10 font-semibold text-gray-800 dark:text-white">
        Air quality forecast: 24 Hours prediction
      </h2>

      <div className="overflow-x-auto flex space-x-6 p-2 scroll-smooth snap-x snap-mandatory overflow-y-hidden 
                      [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full 
                      [&::-webkit-scrollbar-thumb]:bg-gray-400 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 
                      [&::-webkit-scrollbar-track]:bg-gray-200 dark:[&::-webkit-scrollbar-track]:bg-gray-800 
                      rounded-md">
        {hourlyAQI.map((data, index) => (
          <Link to={`/aqi-detail/${index}`} state={{ aqiData: data }} key={index}>
            <div
              className="flex-shrink-0 snap-center flex flex-col items-center p-6 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-700 
                         shadow-2xl border border-gray-300 dark:border-gray-600 rounded-xl w-52 
                         transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              <svg width="90" height="90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="gray"
                  strokeWidth="5"
                  fill="none"
                  opacity="0.3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={getAqiColor(data.AQI)}
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (data.AQI / 500) * 251.2}
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-500"
                />
                <text
                  x="50"
                  y="55"
                  textAnchor="middle"
                  fontSize="22"
                  fill={isdarkMode ? "white" : "black"}
                  fontWeight="bold"
                >
                  {Math.round(data.AQI)}
                </text>
              </svg>

         <p className={`${isdarkMode ? "text-white" : "text-gray-800"} mt-3 text-center text-xl font-semibold`}>
  {new Date(data.TimestampDays).toISOString().split('T')[0]} {new Date(data.TimestampDays).toTimeString().split(' ')[0].slice(0, 5)}
</p>

              <p className={`mt-2 ${isdarkMode ? "text-gray-300" : "text-gray-600"} text-center text-sm`}>
                {data.AQI <= 50
                  ? "Good"
                  : data.AQI <= 100
                  ? "Satisfactory"
                  : data.AQI <= 200
                  ? "Moderate"
                  : data.AQI <= 300
                  ? "Poor"
                  : data.AQI <= 400
                  ? "Very Poor"
                  : "Severe"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LiveAQI;
