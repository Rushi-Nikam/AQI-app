import React from 'react'
import {Routes,Route} from "react-router-dom"
import HomePage from "../Component/pages/HomePage"
import MapII from '../Component/Map/MapII'
import LocalityDetail from '../Component/pages/LocationDetails'
const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path='/map' element={<MapII/>}/>
      <Route path="/locality/:name" element={<LocalityDetail/>} />
      {/* 404 page   */}
      {/* <Route path="*" element={<NotFound />} />  */}
    </Routes>
  )
}

export default Routers