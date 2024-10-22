import React from 'react'
import {Routes,Route} from "react-router-dom"
import HomePage from "../Component/pages/HomePage"
import MapII from '../Component/Map/MapII'
import LocalityDetail from '../Component/pages/LocationDetails'
import DetailedPrecaution from '../Component/molecules/DetailsPrecaution'
import Leafletmap from '../Component/Map/Leafletmap'
const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/> 
      <Route path='/map' element={<MapII/>}/>
      <Route path='/leaflet-map' element={<Leafletmap/>}/>
      <Route path="/locality/:name" element={<LocalityDetail/>} />
      <Route path="/detailed-precautions/:level" element={<DetailedPrecaution />} />
      {/* 404 page   */}
      {/* <Route path="*" element={<NotFound />} />  */}
    </Routes>
  )
}

export default Routers