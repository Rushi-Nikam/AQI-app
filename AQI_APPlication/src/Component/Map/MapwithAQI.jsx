import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet-control-geocoder'; 
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'; // Import CSS


const getColorFromAQI = (aqiValue) => {
  if (aqiValue <= 50) return "#00e400"; // Good
  if (aqiValue <= 100) return "#ffff00"; // Moderate
  if (aqiValue <= 150) return "#ffcc00"; // Unhealthy for sensitive groups
  if (aqiValue <= 200) return "#ff7e00"; // Unhealthy
  if (aqiValue <= 300) return "#ff0000"; // Very Unhealthy
  return "#7e0023"; // Hazardous
};


const createCustomIcon = (aqiValue, backgroundColor) => {
  const svgIcon = `
    <svg width="33" height="44" viewBox="0 0 35 45" xmlns="http://www.w3.org/2000/svg">
      <path d="M28.205 3.217H6.777c-2.367 0-4.286 1.87-4.286 4.179v19.847c0 2.308 1.919 4.179 4.286 4.179h5.357l5.337 13.58 5.377-13.58h5.357c2.366 0 4.285-1.87 4.285-4.179V7.396c0-2.308-1.919-4.179-4.285-4.179" fill="${backgroundColor}"></path>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="16" fill="#ffffff" font-family="Arial">${aqiValue}</text>
    </svg>
  `;
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [38, 38],
  });
};


const LiveLocation = () => {
  const map = useMap();
  const [locationMarker, setLocationMarker] = useState(null);
  const [locationCircle, setLocationCircle] = useState(null);

  useEffect(() => {
    if (!map) return;

    const handleSuccess = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      const latLng = [latitude, longitude];

      if (locationMarker) {
        locationMarker.setLatLng(latLng);
        locationMarker.getPopup().setContent('You are here').openOn(map);
      } else {
        const marker = L.marker(latLng).addTo(map).bindPopup('You are here');
        setLocationMarker(marker);
        marker.openPopup(); 
      }

      if (locationCircle) {
        locationCircle.setLatLng(latLng).setRadius(accuracy);
      } else {
        const circle = L.circle(latLng, { radius: accuracy }).addTo(map);
        setLocationCircle(circle);
      }

      map.setView(latLng, map.getZoom());
    };

    const handleError = (err) => {
      if (err.code === 1) {
        alert('Please allow Geolocation access.');
      } else {
        alert('Cannot get current location.');
      }
    };

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map, locationMarker, locationCircle]);

  return null;
};

// Search Control component
const SearchControl = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Geocoder integration
    const geocoder = L.Control.Geocoder.nominatim();
    const geocoderControl = L.Control.geocoder({
      position: 'topright',
      placeholder: 'Search for location...',
      geocoder,
    })
      .on('markgeocode', (e) => {
        const { center } = e.geocode;
        L.marker(center)
          .addTo(map)
          .bindPopup(e.geocode.name)
          .openPopup();
        map.setView(center, 13);
      })
      .addTo(map);

    return () => map.removeControl(geocoderControl);
  }, [map]);

  return null;
};

const MapwithAQI = () => {
  const [markers, setMarkers] = useState([
    { geocode: [18.6492, 73.7707], popup: "Nigdi", aqiValue: null, backgroundColor: "#00e400" },
    { geocode: [18.6011, 73.7641], popup: "Wakad", aqiValue: 105, backgroundColor: "#ff7e00" },
    { geocode: [18.5913, 73.7389], popup: "Hinjawadi", aqiValue: 103, backgroundColor: "#ff0000" },
    { geocode: [18.7167, 73.7678], popup: "Dehu", aqiValue: 102, backgroundColor: "#7e0023" },
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

  return (
    <MapContainer
      center={[18.5913, 73.7389]}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SearchControl />
      <LiveLocation />
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
  );
};

export default MapwithAQI;
