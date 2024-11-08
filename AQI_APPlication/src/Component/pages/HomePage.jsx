import React, { Suspense, useCallback, useEffect, useState } from 'react';
const  SideCard = React.lazy(()=>import('../molecules/SideCard'));
const AQICard = React.lazy(()=>import('../molecules/AQICard'));
const AQITable = React.lazy(()=>import('../molecules/AQITable'));
const  Leafletmap = React.lazy(()=>import('../Map/Leafletmap'));

const HomePage = ({ isDarkMode }) => { // Receive the dark mode state as a prop
  const [isHovered, setIsHovered] = useState(false);
 const handlewindow = useCallback(()=>{
  console.log("loading")
 })
  useEffect(()=>{
    window.addEventListener('load',handlewindow);

    return ()=>{
      window.removeEventListener("load",handlewindow);
    }
  },[handlewindow])
 
  
  return (
    <div className={`py-4 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
      <h1 className={`font-serif text-2xl font-bold mb-5 text-center lg:text-left ${isDarkMode ? 'text-white' : 'text-black'}`}>
        Pune AQI Status | Live Air Quality and Pollution Data
      </h1>
      <div className="flex lg:flex lg:mx-20 my-4 gap-12">
        <div 
          className="flex justify-start"
          // onMouseEnter={() => setIsHovered(true)} 
          // onMouseLeave={() => setIsHovered(false)} 
          onClick={()=>setIsHovered(!isHovered)}
        >
          <Suspense fallback={"is loading"} >  <SideCard location={"Pune"} isDarkMode={isDarkMode} /> </Suspense>
        
        </div>

        <div className={`${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          <Suspense fallback={"is loading"} ><Leafletmap /> </Suspense>
          
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:justify-between p-4 mt-4 gap-4">
        {/* AQI Table */}
        <div className={`lg:w-1/2 overflow-auto max-h-[400px] ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
        <Suspense fallback={"is loading"}> <AQITable  isDarkMode={isDarkMode} /></Suspense>
         
        </div>  

        {/* AQI Card */}
        <div className={`lg:w-1/3 ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        <Suspense fallback={'is Loading'}>   <AQICard isDarkMode={isDarkMode} /></Suspense>
     
        </div>
      </div>
    </div>
  );
};

export default HomePage;
