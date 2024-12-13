import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

const puneAQIData = [
  { location: "Pune", latitude: 18.5204, longitude: 73.8567, aqi: 150 },
  // Add more locations within Pune if needed
];

const Maplibre = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current, 
      style: "https://demotiles.maplibre.org/style.json", 
      center: [73.8567, 18.5204], 
      zoom: 12,
    });

    // Add marker for Pune location
    puneAQIData.forEach(({ location, latitude, longitude, aqi }) => {
      new maplibregl.Marker({
        color: getAQIColor(aqi), // Set marker color based on AQI
      })
        .setLngLat([longitude, latitude])
        .setPopup(
          new maplibregl.Popup().setHTML(
            `<h4>${location}</h4><p>AQI: ${aqi}</p>` // Popup with AQI details
          )
        )
        .addTo(map.current); // Add marker to map
    });

    // Show pointer on the map
    map.current.on("mousemove", () => {
      map.current.getCanvas().style.cursor = "pointer"; // Set cursor to pointer
    });

  }, []);

  // Utility to get marker color based on AQI value
  const getAQIColor = (aqi) => {
    if (aqi <= 50) return "green";
    if (aqi <= 100) return "yellow";
    if (aqi <= 150) return "orange";
    if (aqi <= 200) return "red";
    if (aqi <= 300) return "purple";
    return "maroon";
  };

  return <div ref={mapContainer} style={{ height: "900px", width: "100%" }} />;
};

export default Maplibre;
