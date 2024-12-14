import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
// import * as L from 'leaflet';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import * as d3 from 'd3';

const getColorFromAQI = (aqiValue) => {
  if (aqiValue <= 50) return "#00e400";
  if (aqiValue <= 100) return "#ffff00";
  if (aqiValue <= 150) return "#ffcc00";
  if (aqiValue <= 200) return "#ff7e00";
  if (aqiValue <= 300) return "#ff0000";
  return "#7e0023";
};

const createCustomIcon = (aqiValue, backgroundColor) => {
  const svgWidth = 38;
  const svgHeight = 38;
  const radius = 18;

  const svg = d3.create('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .attr('viewBox', '0 0 38 38')
    .attr('xmlns', 'http://www.w3.org/2000/svg');

  svg.append('circle')
    .attr('cx', svgWidth / 2)
    .attr('cy', svgHeight / 2)
    .attr('r', radius)
    .attr('fill', backgroundColor)
    .attr('stroke', '#ffffff')
    .attr('stroke-width', 2);

  svg.append('text')
    .attr('x', '50%')
    .attr('y', '50%')
    .attr('text-anchor', 'middle')
    .attr('dy', '.3em')
    .attr('font-size', 12)
    .attr('fill', '#ffffff')
    .attr('font-family', 'Arial')
    .text(aqiValue);

  const svgData = svg.node().outerHTML;
  const svgUrl = `data:image/svg+xml;base64,${btoa(svgData)}`;

  return new Icon({
    iconUrl: svgUrl,
    iconSize: [38, 38],
  });
};

const MapwithAQI = () => {
  const [markers, setMarkers] = useState([
    { geocode: [18.6492, 73.7707], popup: "Nigdi", aqiValue: null },
    { geocode: [18.6011, 73.7641], popup: "Wakad", aqiValue: 102 },
    { geocode: [18.5913, 73.7389], popup: "Hinjawadi", aqiValue: 103 },
    { geocode: [18.7167, 73.7678], popup: "Dehu", aqiValue: 100 },
  ]);

  useEffect(() => {
    const fetchAQIData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/aqi');
        const data = await response.json();
console.log(data);
        const updatedMarkers = markers.map((marker) => {
          const cityData = data.find((item) => item.locality.toLowerCase() === marker.popup.toLowerCase());
          if (cityData) {
            return {
              ...marker,  
              aqiValue: cityData.aqi,
              backgroundColor: getColorFromAQI(cityData.aqi),
            };
          }
          return marker;
        });

        setMarkers(updatedMarkers);
      } catch (error) {
        console.error('Error fetching AQI data:', error);
      }
    };

    fetchAQIData();
  }, []);

  const puneCenter = [18.5204, 73.8567];

  return (
    <MapContainer
      center={puneCenter}
      zoom={11}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Large Circle for Pune */}
      <Circle
        center={puneCenter}
        radius={30000}
        pathOptions={{
          fillColor: 'pink',
          fillOpacity: 0.2,
          color: '#666666',
          weight: 1,
        }}
      >
        <Popup>Pune Region</Popup>

        {/* Markers Inside Pune Circle */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.geocode}
            icon={createCustomIcon(marker.aqiValue, getColorFromAQI(marker.aqiValue))}
          >
            <Popup>
              <div style={{ padding: '5px', borderRadius: '5px', color: 'black' }}>
                <strong>{marker.popup}, Maharashtra</strong><br />
                AQI: {marker.aqiValue}
              </div>
            </Popup>
          </Marker>
        ))}
      </Circle>
    </MapContainer>
  );
};

export default MapwithAQI;
