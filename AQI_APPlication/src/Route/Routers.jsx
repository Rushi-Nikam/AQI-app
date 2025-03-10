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
import Choropath from '../Component/Map/choropath';
import Humidity from '../Component/molecules/Humidity';
import PieChart from '../Component/molecules/PieChart';
import PageNotFound from '../Component/pages/PageNotFound';
import Demo from '../Component/Map/Demo';
import Deomse from '../Component/Map/Deomse';
import Maplibre from '../Component/Map/Maplibre';
import ScatterPlot from '../Component/molecules/ScatterPlot';
import DummyBarChart from '../Component/molecules/DummyBarChart';
import CityBarChart from '../Component/molecules/CityBarChart';
import DemoPage from '../Component/pages/DemoPage';
import PredictDetails from '../Component/pages/PredictDetails';
import LeafMap from '../Component/Map/LeafMap';
import LiveAQI from '../Component/pages/LiveAQI';
import Predict from '../Component/molecules/Predict';

const Routers = ({ isDarkMode}) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage isDarkMode={isDarkMode} />} /> 
      <Route path='/about' element={<About isDarkMode={isDarkMode} />} />
      <Route path='/aqi-info' element={<AQIdata isDarkMode={isDarkMode} />} />
      <Route path='/go-one' element={<Deomse/>} />

      <Route path='/map' element={<MapII isDarkMode={isDarkMode} />} />
      <Route path='/map-aqi' element={<MapwithAQI/>} />
      <Route path='/map-choro' element={<Choropath/>} />
      <Route path='/aqi-map' element={<AQIMap isDarkMode={isDarkMode}/>} />
      <Route path='/leaflet-map' element={<Leafletmap isDarkMode={isDarkMode} />} />
      <Route path='/leaf-map' element={<LeafMap isDarkMode={isDarkMode} />} />
      <Route path="/locality/:name" element={<LocalityDetail isDarkMode={isDarkMode} />} />
      <Route path="/aqi-table" element={<AQITable isDarkMode={isDarkMode} />} />
      <Route path="/city/:name" element={<CityDetails isDarkMode={isDarkMode} />} />
      <Route path="/humidity" element={<Humidity/>} />
      <Route path="/pie" element={<PieChart/>} />
      <Route path="/map-demo" element={<Demo/>} />
      <Route path="/map-libre" element={<Maplibre/>} />
      <Route path="/scatter" element={<ScatterPlot/>} />
      <Route path="/Bar_chart" element={<DummyBarChart/>} />
      <Route path="/city_chart" element={<CityBarChart/>} />
      <Route path="/new_page" element={<DemoPage/>} />
      <Route path="/detail/:AQI" element={<PredictDetails/>} />
      <Route path="/live-aqi" element={<LiveAQI/>} />
      <Route path="/pre" element={<Predict/>} />

      <Route path="/detailed-precautions/:level" element={<DetailedPrecaution isDarkMode={isDarkMode} />} />
      {/* 404 page */}
      <Route path="*" element={<PageNotFound/>} />
    </Routes>
  );
};

export default Routers;
