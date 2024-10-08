import React from "react";
import Navbar from "./Component/Navbars/Navbar";
import Routers from "./Route/Routers";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import Footer from "./Component/pages/footer";


function App() {
  return (
    <BrowserRouter> {/* Wrap your components with BrowserRouter */}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow relative bg-gray-100 p-4">
          <h1 className="font-serif text-2xl font-bold mb-5 text-center lg:text-left">
            Welcome to Real-Time AQI Indexing
          </h1>
          <Routers />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
