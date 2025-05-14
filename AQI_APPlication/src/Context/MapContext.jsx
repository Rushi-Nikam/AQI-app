import React, { createContext, useContext, useState } from "react";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [radius, setRadius] = useState(1000);

  return<MapContext.Provider value={{ radius, setRadius }}>
      {children}
    </MapContext.Provider>
  
};

// ✅ Export useMapContext function
export const useMapContext = () => useContext(MapContext);
