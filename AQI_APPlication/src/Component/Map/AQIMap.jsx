import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import AQIGraph from '../molecules/AQIGraph';

const AQIMap = () => {
  const [markers, setMarkers] = useState([
    { geocode: [18.6492, 73.7707], popup: 'Nigdi', aqiValue:100, backgroundColor: '#00e400',Color:''},
    { geocode: [18.6011, 73.7641], popup: 'Wakad', aqiValue: 100, backgroundColor: '#ff7e00', Color:""},
    { geocode: [18.5913, 73.7389], popup: 'Hinjawadi', aqiValue: null, backgroundColor: '#ff0000',Color:'' },
    { geocode: [18.7167, 73.7678], popup: 'Dehu', aqiValue: null, backgroundColor: '#7e0023',Color:'' },
    { geocode: [18.5074, 73.8077], popup: 'Kothrud', aqiValue: null, backgroundColor: '#ffff00',Color:'' },
    { geocode: [18.5204, 73.8567], popup: 'Shivajinagar', aqiValue: null, backgroundColor: '#ffcc00',Color:'' },
    { geocode: [18.4954, 73.8257], popup: 'Hadapsar', aqiValue: null, backgroundColor: '#ff7e00',Color:'' },
    { geocode: [18.5167, 73.9331], popup: 'Kharadi', aqiValue: null, backgroundColor: '#ff7e00',Color:'' },
    { geocode: [18.4637, 73.8675], popup: 'Undri', aqiValue: null, backgroundColor: '#ffcc00',Color:'' },
    { geocode: [18.5793, 73.7097], popup: 'Baner', aqiValue: null, backgroundColor: '#ffff00',Color:'' },
  ]);

  useEffect(() => {
    const fetchAQIData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/aqi'); // Replace with your API endpoint
        const data = await response.json();

        const updatedMarkers = markers.map((marker) => {
          const cityData = data.find((item) => item.locality.toLowerCase() === marker.popup.toLowerCase());
          if (cityData) {
            const aqiValue = cityData.aqi;
            return {
              ...marker,
              aqiValue,
              backgroundColor: getColorFromAQI(aqiValue),
              Color: 'Green',
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
  }, [markers]);

  const getColorFromAQI = (aqiValue) => {
    if (aqiValue <= 50) return '#00b050';
    if (aqiValue <= 100) return '#92d050';
    if (aqiValue <= 200) return '#ffff00';
    if (aqiValue <= 300) return '#ff9900';
    if (aqiValue <= 400) return '#ff0000';
     return '#c00000';
  };

  const createCustomIcon = (aqiValue, backgroundColor,Color) => {
    const svgIcon = `
      <svg width="33" height="44" viewBox="0 0 35 45" xmlns="http://www.w3.org/2000/svg">
        <path d="M28.205 3.217H6.777c-2.367 0-4.286 1.87-4.286 4.179v19.847c0 2.308 1.919 4.179 4.286 4.179h5.357l5.337 13.58 5.377-13.58h5.357c2.366 0 4.285-1.87 4.285-4.179V7.396c0-2.308-1.919-4.179-4.285-4.179" fill="${backgroundColor}"></path>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="16" fill="${Color}" font-family="Arial">${aqiValue}</text>
      </svg>
    `;
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
      iconSize: [38, 38],
    });
  };

  return (
    <div className='flex flex-col '>
      <MapContainer className='z-50' center={[18.5204, 73.8567]} zoom={12} style={{ width: '100%', height: '500px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.geocode}
            icon={createCustomIcon(marker.aqiValue, marker.backgroundColor,marker.Color)}
          >
            <Popup>
              <div style={{ backgroundColor: marker.backgroundColor, padding: '5px', borderRadius: '5px', color: 'white' }}>
                {marker.popup}: AQI {marker.aqiValue}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className='w-full'>

      <AQIGraph />
      </div>
    </div>
  );
};

export default AQIMap;
