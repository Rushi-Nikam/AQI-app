import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Sample GeoJSON Data with AQI Levels for Chinchwad Localities (Use actual data for production)
const chinchwadData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Chinchwad Locality 1", aqi: 45 },  // AQI value for Locality 1
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.7909, 18.6151],
            [73.8055, 18.6101],
            [73.8185, 18.6221],
            [73.8085, 18.6351],
            [73.7925, 18.6151],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Chinchwad Locality 2", aqi: 110 },  // AQI value for Locality 2
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.8355, 18.6150],
            [73.8505, 18.6100],
            [73.8605, 18.6200],
            [73.8455, 18.6300],
            [73.8355, 18.6150],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Chinchwad Locality 3", aqi: 160 },  // AQI value for Locality 3
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.7655, 18.6151],
            [73.7755, 18.6051],
            [73.7805, 18.6201],
            [73.7705, 18.6301],
            [73.7655, 18.6151],
          ],
        ],
      },
    },
  ],
};

// Function to determine color based on AQI value (Classed Choropleth)
const getColor = (aqi) => {
  if (aqi <= 50) return "#00FF00";  // Good
  if (aqi <= 100) return "#FFFF00";  // Moderate
  if (aqi <= 150) return "#FFA500";  // Unhealthy for Sensitive Groups
  if (aqi <= 200) return "#FF4500";  // Unhealthy
  if (aqi <= 300) return "#FF0000";  // Very Unhealthy
  return "#7E0023";  // Hazardous
};

// Function to style GeoJSON layers
const geoStyle = (feature) => {
  return {
    fillColor: getColor(feature.properties.aqi),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };
};

const ChoroplethMap = () => {
  // Highlight feature on hover
  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    });
    layer.bringToFront();
  };

  // Reset highlight on mouseout
  const resetHighlight = (e) => {
    e.target.setStyle(geoStyle(e.target.feature));
  };

  // Interaction handlers
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: () => alert(`Clicked on ${feature.properties.name}`),
    });
    layer.bindPopup(
      `<b>${feature.properties.name}</b><br>AQI: ${feature.properties.aqi}`
    );
  };

  return (
    <MapContainer
      style={{ height: "600px", width: "100%" }}
      center={[18.6270, 73.8024]} // Chinchwad's coordinates
      zoom={12}  // Zoom level for Chinchwad city
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
      />
      <GeoJSON
        data={chinchwadData}
        style={geoStyle}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
};

export default ChoroplethMap;
