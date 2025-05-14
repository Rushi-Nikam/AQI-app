import React from 'react';
import { Routes, Route } from "react-router-dom";
import HomePage from "../Component/pages/HomePage";
import About from "../Component/pages/About";
import PageNotFound from "../Component/pages/PageNotFound";
import LocalityDetail from "../Component/pages/LocationDetails";
import LiveAQI from "../Component/pages/LiveAQI";
import PredictDetails from "../Component/pages/PredictDetails";
import DemoPage from "../Component/pages/DemoPage";
import DetailedPrecaution from "../Component/molecules/DetailsPrecaution";

// AQI Data Components
import AQIdata from "../Component/molecules/AQIdata";
import CityDetails from "../Component/molecules/CityDetails";
import AQITable from "../Component/molecules/AQITable";
import Predict from "../Component/molecules/Predict";
import Humidity from "../Component/molecules/Humidity";

// Charts
import PieChart from "../Component/molecules/PieChart";
import ScatterPlot from "../Component/molecules/ScatterPlot";
import DummyBarChart from "../Component/molecules/DummyBarChart";
import CityBarChart from "../Component/molecules/CityBarChart";

// Map Components
import MapII from "../Component/Map/MapII";
import Leafletmap from "../Component/Map/Leafletmap";
import AQIMap from "../Component/Map/AQIMap";
import MapwithAQI from "../Component/Map/MapwithAQI";
import Choropath from "../Component/Map/choropath";
import LeafMap from "../Component/Map/LeafMap";
import Maplibre from "../Component/Map/Maplibre";
import Demo from "../Component/Map/Demo";
import Deomse from "../Component/Map/Deomse";


const Routers = ({ isDarkMode }) => {
  return (
      <Routes>
        {/* Home & General Pages */}
        <Route path="/" element={<HomePage isDarkMode={isDarkMode} />} />
        <Route path="/about" element={<About isDarkMode={isDarkMode} />} />
        <Route path="/new_page" element={<DemoPage />} />

        {/* AQI Data Routes */}
        <Route path="/aqi-info" element={<AQIdata isDarkMode={isDarkMode} />} />
        <Route path="/aqi-table" element={<AQITable isDarkMode={isDarkMode} />} />
        <Route path="/city/:name" element={<CityDetails isDarkMode={isDarkMode} />} />
        <Route path="/locality/:name" element={<LocalityDetail isDarkMode={isDarkMode} />} />
        <Route path="/live-aqi" element={<LiveAQI />} />
        <Route path="/detail/:AQI" element={<PredictDetails />} />

        {/* Map Routes */}
        <Route path="/map" element={<MapII isDarkMode={isDarkMode} />} />
        <Route path="/map-aqi" element={<MapwithAQI />} />
        <Route path="/map-choro" element={<Choropath />} />
        <Route path="/aqi-map" element={<AQIMap isDarkMode={isDarkMode} />} />
        <Route path="/leaflet-map" element={<Leafletmap isDarkMode={isDarkMode} />} />
        <Route path="/leaf-map" element={<LeafMap isDarkMode={isDarkMode} />} />
        <Route path="/map-demo" element={<Demo />} />
        <Route path="/map-libre" element={<Maplibre />} />
        <Route path="/go-one" element={<Deomse />} />

        {/* Charts */}
        <Route path="/pie" element={<PieChart />} />
        <Route path="/scatter" element={<ScatterPlot />} />
        <Route path="/bar_chart" element={<DummyBarChart />} />
        <Route path="/city_chart" element={<CityBarChart />} />

        {/* Other Functionalities */}
        <Route path="/pre" element={<Predict />} />
        <Route path="/humidity" element={<Humidity />} />
        <Route path="/detailed-precautions/:level" element={<DetailedPrecaution isDarkMode={isDarkMode} />} />

        {/* 404 Page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

  );
};

export default Routers;
