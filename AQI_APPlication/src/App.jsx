import React, { useState, useEffect } from "react";
import Navbar from "./Component/Navbars/Navbar";
import Routers from "./Route/Routers";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import Footer from "./Component/pages/footer/Footer";
import { MapProvider } from "./Context/MapContext";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (


   <MapProvider> <BrowserRouter > {/* Wrap your components with BrowserRouter */}
   <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
     <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
     <main className="flex-grow relative p-4">
     
       <Routers isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
     </main>
     <Footer />
   </div>
 </BrowserRouter> </MapProvider>
   
  
  );
}

export default App;
