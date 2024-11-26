import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder';

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
        const marker = L.marker(latLng)
          .addTo(map)
          .bindPopup('You are here');
        setLocationMarker(marker);
        marker.openPopup(); // Open popup when marker is created
      }

      if (locationCircle) {
        locationCircle.setLatLng(latLng).setRadius(accuracy);
      } else {
        const circle = L.circle(latLng, { radius: accuracy }).addTo(map);
        setLocationCircle(circle);
      }

      // Center the map on the user's location
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

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [map, locationMarker, locationCircle]);

  return null;
};


const MapII = () => {
  const [markers, setMarkers] = useState([
    { position: [18.5204, 73.8567], popup: 'Pune' },
  ]);

  return (
    <MapContainer
      center={[18.5204, 73.8567]}
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
        <Marker key={index} position={marker.position}>
          <Popup>{marker.popup}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapII;
