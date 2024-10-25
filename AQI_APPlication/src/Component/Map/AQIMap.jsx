import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Link } from 'react-router-dom';
import AQIGraph from '../molecules/AQIGraph';

const AQIMap = () => {
  const markers = [
    {
      geocode: [18.6492, 73.7707],
      popup: "Nigdi",
      aqiValue: 50,
      backgroundColor: "#00e400" // Green for good AQI
    },
    {
      geocode: [18.6011, 73.7641],
      popup: "Wakad",
      aqiValue: 150,
      backgroundColor: "#ff7e00" // Orange for unhealthy for sensitive groups
    },
    {
      geocode: [18.5913, 73.7389],
      popup: "Hinjawadi",
      aqiValue: 200,
      backgroundColor: "#ff0000" // Red for unhealthy
    },
    {
      geocode: [18.7167, 73.7678],
      popup: "Dehu",
      aqiValue: 300,
      backgroundColor: "#7e0023" // Maroon for hazardous
    },
    {
      geocode: [18.5074, 73.8077],
      popup: "Kothrud",
      aqiValue: 90,
      backgroundColor: "#ffff00" // Yellow for moderate
    },
    {
      geocode: [18.5204, 73.8567],
      popup: "Shivajinagar",
      aqiValue: 120,
      backgroundColor: "#ffcc00" // Light orange for unhealthy for sensitive groups
    },
    {
      geocode: [18.4954, 73.8257],
      popup: "Hadapsar",
      aqiValue: 175,
      backgroundColor: "#ff7e00" // Orange for unhealthy for sensitive groups
    },
    {
      geocode: [18.5167, 73.9331],
      popup: "Kharadi",
      aqiValue: 180,
      backgroundColor: "#ff7e00" // Orange for unhealthy for sensitive groups
    },
    {
      geocode: [18.4637, 73.8675],
      popup: "Undri",
      aqiValue: 130,
      backgroundColor: "#ffcc00" // Light orange for unhealthy for sensitive groups
    },
    {
      geocode: [18.5793, 73.7097],
      popup: "Baner",
      aqiValue: 100,
      backgroundColor: "#ffff00" // Yellow for moderate
    },
  ];
  

  const createCustomIcon = (aqiValue, backgroundColor) => {
    const svgIcon = `
      <svg width="33" height="44" viewBox="0 0 35 45" xmlns="http://www.w3.org/2000/svg">
        <path d="M28.205 3.217H6.777c-2.367 0-4.286 1.87-4.286 4.179v19.847c0 2.308 1.919 4.179 4.286 4.179h5.357l5.337 13.58 5.377-13.58h5.357c2.366 0 4.285-1.87 4.285-4.179V7.396c0-2.308-1.919-4.179-4.285-4.179" fill="${backgroundColor}"></path>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="16" fill="#ffffff" font-family="Arial">${aqiValue}</text>
        <g opacity=".15" transform="matrix(1.0714 0 0 -1.0714 -233.22 146.783)">
          <path d="M244 134h-20c-2.209 0-4-1.746-4-3.9v-18.525c0-2.154 1.791-3.9 4-3.9h5L233.982 95 239 107.675h5c2.209 0 4 1.746 4 3.9V130.1c0 2.154-1.791 3.9-4 3.9m0-1c1.654 0 3-1.301 3-2.9v-18.525c0-1.599-1.346-2.9-3-2.9h-5.68l-.25-.632-4.084-10.318-4.055 10.316-.249.634H224c-1.654 0-3 1.301-3 2.9V130.1c0 1.599 1.346 2.9 3 2.9h20" fill="#231f20"></path>
        </g>
      </svg>
    `;

    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
      iconSize: [38, 38],
    });
  };

  return (
    <>
      <main className='w-full'>
      <MapContainer className="h-[60vh] w-full z-50 overflow-hidden" center={[18.5913, 73.7389]} zoom={13}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.geocode}
              icon={createCustomIcon(marker.aqiValue, marker.backgroundColor)}
            >
              <Popup>
                <div style={{ backgroundColor: marker.backgroundColor, padding: '5px', borderRadius: '5px', color: 'white' }}>
                  {marker.popup}: AQI {marker.aqiValue}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>


<AQIGraph/>
      
      </main>
    </>
  );
};

export default AQIMap;

