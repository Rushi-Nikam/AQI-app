import React, { Suspense, useCallback, useEffect } from 'react';
import { useState } from 'react';
import PollutantTable from '../molecules/PollutantTable';
import Questions from '../molecules/Questions';

const GasesTable = React.lazy(() => import('../molecules/GasesTable'));
const SideCard = React.lazy(() => import('../molecules/SideCard'));
const Leafletmap = React.lazy(() => import('../Map/Leafletmap'));

const HomePage = ({ isDarkMode }) => {
// const [isHovered,setIsHovered]=useState();
const [location, setLocation] = useState();

  const handleWindow = useCallback(() => {
    console.log("Page loaded");
  }, []);

  useEffect(() => {
    window.addEventListener('load', handleWindow);

    return () => {
      window.removeEventListener("load", handleWindow);
    };
  }, [handleWindow]);

  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              // Use a reverse geocoding API to fetch the location name
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              ); // not showing
              
              const data = await response.json();
              console.log({data})
              if (data) {
                setLocation(data);
              }
            } catch (error) {
              console.error('Error fetching location:', error);
              setLocation('Error fetching location');
            }
          },
          (error) => {
            console.error('Geolocation error:', error);
            setLocation('Location permission denied');
          }
        );
      } else {
        setLocation('Geolocation not supported');
      }
    };

    fetchLocation();
  }, []);

  return (
    <div className={`py-4 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'} w-full`}>
      {/* Header */}
      <div className="flex justify-center px-4">
        <h1
          className={`font-serif text-2xl md:text-3xl font-bold mb-5 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}
        >
          {location ? location?.address?.city: "pune"} AQI Status | Live Air Quality and Pollution Data
        </h1>
      </div>

    
      <div className="flex flex-col-reverse lg:flex-row lg:mx-20 my-4 gap-8 lg:gap-12 px-4">
      
        <div className="flex justify-center lg:w-1/3"
        // onClick={()=>window.location.reload()} 
        // onClick={()=>setIsHovered(!isHovered)}
        >
          <Suspense fallback={<div>Loading...</div>}>
            {/* <h1>location : {location?.address.suburb}</h1> */}
            <SideCard location={location ?location?.address?.state_district:'pune' } isDarkMode={isDarkMode} />
          </Suspense>
        </div>

        {/* Leaflet Map */}
        <div  className="flex justify-center lg:w-2/3" 
          //  className={`${isHovered ? 'opacity-0' : 'opacity-100'} flex justify-center lg:w-2/3`}
           >
          <Suspense fallback={<div>Loading...</div>}>
            <Leafletmap />
          </Suspense>
        </div>
      </div>

      {/* AQI Table */}
      <div className="flex flex-col lg:flex-row lg:justify-center items-center px-4">
        <div className={`w-full max-h-[350px] ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
          <Suspense fallback={<div>Loading...</div>}>
            <GasesTable isDarkMode={isDarkMode} />
          </Suspense>
        </div>
      </div>

      {/* Pollutant Table */}
      <div className={`px-4 lg:mt-0 mt-[250px] ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <PollutantTable isDarkMode={isDarkMode} />
        </Suspense>
      </div>

      {/* Questions Section */}
      <div className={`px-4 mt-6 ${isDarkMode ? 'bg-[#111827]' : 'bg-wihte'}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Questions isDarkMode={isDarkMode} />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
