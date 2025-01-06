import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { CiLocationOn } from 'react-icons/ci';
import ReactDOMServer from 'react-dom/server'; // Import ReactDOMServer

const LiveLocation = () => {
  const map = useMap();
  const [locationMarker, setLocationMarker] = useState(null);
  const [locationCircle, setLocationCircle] = useState(null);

  useEffect(() => {
    if (!map) return;

    // Function to handle location success
    const handleSuccess = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      const latLng = [latitude, longitude];

      // Update marker location or create a new one
      if (locationMarker) {
        // Update marker position and popup content
        locationMarker.setLatLng(latLng);
        locationMarker.getPopup().setContent('You').openOn(map);
      } else {
        // Render the React icon as an SVG string
        const iconSvg = ReactDOMServer.renderToString(<CiLocationOn size={32} color="blue" />);
        
        // Create a custom icon using the rendered SVG
        const customIcon = L.divIcon({
          className: '', // Optional: Add custom classes for styling
          html: iconSvg,
          iconSize: [32, 32], // Adjust size if necessary
          iconAnchor: [16, 32], // Adjust anchor to align correctly
          popupAnchor: [0, -32], // Position of the popup relative to the icon
        });

        // Create a new marker with the custom icon
        const marker = L.marker(latLng, { icon: customIcon })
          .addTo(map)
          .bindPopup('You are here');
        
        // Update the state with the new marker
        setLocationMarker(marker);
        marker.openPopup(); // Open the popup immediately
      }

      // Update circle location or create a new one
      if (locationCircle) {
        locationCircle.setLatLng(latLng).setRadius(accuracy);
      } else {
        const circle = L.circle(latLng, { radius: accuracy }).addTo(map);
        setLocationCircle(circle);
      }

      // Set map view to user's location
      map.setView(latLng, map.getZoom());
    };

    // Function to handle errors in geolocation
    const handleError = (err) => {
      if (err.code === 1) {
        alert('Please allow Geolocation access.');
      } else {
        alert('Cannot get current location.');
      }
    };

    // Fetch location periodically
    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
      });
    };

    // Set interval for periodic location updates
    const intervalId = setInterval(fetchLocation, 60000*100 ); // Update location every 30  second

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      if (locationMarker) {
        map.removeLayer(locationMarker);
      }
      if (locationCircle) {
        map.removeLayer(locationCircle);
      }
    };
  }, [map, locationMarker, locationCircle]); // Added locationMarker and locationCircle to dependencies

  return null;
};

export default LiveLocation;
