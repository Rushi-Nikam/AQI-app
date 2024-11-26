import React, { Suspense, useCallback, useEffect } from 'react';
import { useState } from 'react';
import PollutantTable from '../molecules/PollutantTable';
import Questions from '../molecules/Questions';
const  GasesTable = React.lazy(()=>import('../molecules/GasesTable'));
const  SideCard = React.lazy(()=>import('../molecules/SideCard'));
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
      <div className='flex justify-center'>
      <h1 className={`  font-serif text-2xl font-bold mb-5 text-center lg:text-left ${isDarkMode ? 'text-white' : 'text-black'}`}>
        Pune AQI Status | Live Air Quality and Pollution Data
      </h1>
      </div>
      
      <div className="flex lg:flex lg:mx-20 my-4 gap-12">
        <div 
          className="flex justify-start"
          
          onClick={()=>setIsHovered(!isHovered)}
        >
          <Suspense fallback={"is loading"} >  <SideCard location={"Pune"} isDarkMode={isDarkMode} /> </Suspense>
        
        </div>

        <div className={`${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          <Suspense fallback={"is loading"} ><Leafletmap /> </Suspense>
          
        </div>

        {/* <div className={'flex justify-start'}>
          <Suspense fallback={"is loading"} ><Leafletmap /> </Suspense>
          
        </div> */}
      </div>

      <div className="flex flex-col lg:flex-row lg:justify-center items-center p-4 mt-4  ">
        {/* AQI Table */}
        <div className={`lg:w-full flex justify-center  max-h-[400px] ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        <Suspense fallback={"is loading"}>
          
           {/* <AQITable  isDarkMode={isDarkMode} /> */}
           {/* <CityTable isDarkMode={isDarkMode}/> */}
           
           <GasesTable isDarkMode={isDarkMode}/>
           
        </Suspense>
         
        </div>  
      </div>
        <div className={`lg:w-full ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        <Suspense fallback={'is Loading'}>   <PollutantTable isDarkMode={isDarkMode}/></Suspense>
     
        </div>
        <div className={`lg:w-full ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        <Suspense fallback={'is Loading'}>   <Questions isDarkMode={isDarkMode}/></Suspense>
     
        </div>
        {/* <div className={`lg:w-full ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
        <Suspense fallback={'is Loading'}>   <AQIChart/> </Suspense>
     
        </div> */}

    </div>
  );
};

export default HomePage;
