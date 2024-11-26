import React from 'react';
import { Routes, Route } from "react-router-dom";
import HomePage from "../Component/pages/HomePage";
import MapII from '../Component/Map/MapII';
import LocalityDetail from '../Component/pages/LocationDetails';
import DetailedPrecaution from '../Component/molecules/DetailsPrecaution';
import Leafletmap from '../Component/Map/Leafletmap';
import AQIMap from '../Component/Map/AQIMap';
import About from '../Component/pages/About';
import AQIdata from '../Component/molecules/AQIdata';
import CityDetails from '../Component/molecules/CityDetails';
import AQITable from '../Component/molecules/AQITable';
import MapwithAQI from '../Component/Map/MapwithAQI';

const Routers = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage isDarkMode={isDarkMode} />} /> 
      <Route path='/about' element={<About isDarkMode={isDarkMode} />} />
      <Route path='/aqi-info' element={<AQIdata isDarkMode={isDarkMode} />} />
      <Route path='/map' element={<MapII isDarkMode={isDarkMode} />} />
      <Route path='/map-aqi' element={<MapwithAQI  />} />
      <Route path='/aqi-map' element={<AQIMap isDarkMode={isDarkMode}/>} />
      <Route path='/leaflet-map' element={<Leafletmap isDarkMode={isDarkMode} />} />
      <Route path="/locality/:name" element={<LocalityDetail isDarkMode={isDarkMode} />} />
      <Route path="/aqi-table" element={<AQITable isDarkMode={isDarkMode} />} />
      <Route path="/city/:name" element={<CityDetails isDarkMode={isDarkMode} />} />
      <Route path="/detailed-precautions/:level" element={<DetailedPrecaution isDarkMode={isDarkMode} />} />
      {/* 404 page */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default Routers;
