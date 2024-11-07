import React from 'react';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-xl text-gray-500">
          &copy; {new Date().getFullYear()} AQI All Rights Reserved.
        </p>
        <div className="mt-2 flex justify-center">
          <Link to={'/about'} className="text-gray-400 hover:text-white mx-2">
           About
          </Link>
          <Link to={'/aqi-info'} className="text-gray-400 hover:text-white mx-2">
           AQIdata
          </Link>
          <Link to={'/Aqi-map'} className="text-gray-400 hover:text-white mx-2">
           Map
          </Link>
        
        </div>
      </div>
    </footer>
  );
};

export default Footer;
