import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Circle2 from "../molecules/Circle2"; 
import LeafMap from "../Map/LeafMap";
import PollutantTable from "../pagesComponents/PollutionTable";
import LiveMap from "../Map/LiveMap";

const LocalityDetail = ({ isDarkMode }) => {
  const { name } = useParams();
  const [localityData, setLocalityData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocalityData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/aqi/${name}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setLocalityData(data);
        console.log({data})
      } catch (error) {
        setError(error.message);
        setTimeout(() => navigate("/"), 2000); // Redirect after 3 seconds
      }
    };

    fetchLocalityData();
  }, [name, navigate]);

  if (error) {
    return <p className="text-red-500 text-center mt-6 text-lg">Error: {error}</p>;
  }

  if (!localityData) {
    return <p className="text-center text-lg mt-6">Loading...</p>;
  }

  return (
    <div className={`flex flex-col gap-6 w-full max-w-[100%] mt-10 px-6 ${isDarkMode ? "text-white" : "text-black"}`}>
      {/* Top Section: Map and AQI Circle */}
      <div className="flex flex-col lg:flex-row h-[800px] gap-6">
        {/* Map Section */}
        <div className="w-full relative lg:w-[100%] p-5 border-2 shadow-xl rounded-2xl dark:bg-gray-800">
          <LiveMap />
        </div>

        {/* AQI Circle Section */}
        <div className={`w-full lg:absolute lg:h-[500px] lg:mt-36    lg:ml-[990px] lg:z-[50]  lg:w-[400px] flex flex-col items-center p-6 border-2 shadow-xl rounded-2xl text-center ${isDarkMode ? "bg-[#374151]" : "bg-gray-100"}`}>
          <h2 className="text-xl font-bold mb-2">Live Air Quality in {name}</h2>
          <p className="text-md mb-4">Maharashtra, India</p>
          <Circle2 aqiValue={localityData.aqi} isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Pollutants & Gases Tables */}
      <div className="flex text-xs lg:text-2xl lg:my-12 justify-center  font-bold my-3">
      <h1>Gases Responsible for Air Quality Index</h1>
    </div>
      <div className="flex flex-col items-center lg:flex-row justify-center gap-6">
        <PollutantTable isDarkMode={isDarkMode} />
        {/* <GasesTable isDarkMode={isDarkMode} /> */}
      </div>
    </div>
  );
};

export default LocalityDetail;
