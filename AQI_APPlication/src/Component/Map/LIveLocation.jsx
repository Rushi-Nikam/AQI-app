import React, { useCallback, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { CiLocationOn } from 'react-icons/ci';
import ReactDOMServer from 'react-dom/server';
import { useMapContext } from '../../Context/MapContext';

const LiveLocation = () => {
  const { radius } = useMapContext();
  const map = useMap();
  
  // Using refs to persist marker and circle across renders
  const locationMarker = useRef(null);
  const locationCircle = useRef(null);

  // Function to handle location success
  const handleSuccess = useCallback((pos) => {
    const { latitude, longitude } = pos.coords;
    const latLng = [latitude, longitude];

    // Update marker location or create a new one
    if (locationMarker.current) {
      locationMarker.current.setLatLng(latLng);
      locationMarker.current.getPopup().setContent('You').openOn(map);
    } else {
      const iconSvg = ReactDOMServer.renderToString(<CiLocationOn size={32} color="blue" />);
      const customIcon = L.divIcon({
        className: '',
        html: iconSvg,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      locationMarker.current = L.marker(latLng, { icon: customIcon })
        .addTo(map)
        .bindPopup('You are here');

      locationMarker.current.openPopup();
    }

    // Remove the previous circle before adding a new one
    if (locationCircle.current) {
      map.removeLayer(locationCircle.current);
    }

    locationCircle.current = L.circle(latLng, { radius: Number(radius)  }).addTo(map);

    // Set map view to user's location
    map.setView(latLng, map.getZoom());
  }, [map, radius]);

  const handleError = useCallback((err) => {
    if (err.code === 1) {
      alert('Please allow Geolocation access.');
    } else {
      alert('Cannot get current location.');
    }
  }, []);

  const fetchLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
    });
  }, [handleSuccess, handleError]);

  useEffect(() => {
    if (!map) return;

    // Fetch location periodically
    const intervalId = setInterval(fetchLocation, 1000); // Update location every 10 seconds

    return () => {
      clearInterval(intervalId);
     
      if (locationCircle.current) {
        map.removeLayer(locationCircle.current);
      }
    };
  }, [map, fetchLocation]);

  return null;
};

export default LiveLocation;
