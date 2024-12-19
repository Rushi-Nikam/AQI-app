import React, { useState } from "react";
import { useMap } from "react-leaflet";
import ReactDOMServer from "react-dom/server";
import { IoLocationOutline } from "react-icons/io5";
const LIveLocation = () => {
  const map = useMap();
  const [locationMarker, setLocationMarker] = useState(null);
  const [locationCircle, setLocationCircle] = useState(null);

  const fetchLocation = () => {
    if (!map) return;

    const handleSuccess = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      const latLng = [latitude, longitude];
console.log(latLng);
      // Custom icon for the marker
      const customIcon = L.divIcon({
        html: ReactDOMServer.renderToString(
          <div className="flex items-center justify-center w-8 h-8 rounded-full shadow-lg">
            <IoLocationOutline className="text-blue-500" size={24} />
          </div>
        ),
        className: "",
        iconSize: [32, 32],
      });

      // Clear previous marker and circle
      if (locationMarker) map.removeLayer(locationMarker);
      if (locationCircle) map.removeLayer(locationCircle);

      // Create a new marker and circle
      const newMarker = L.marker(latLng, { icon: customIcon })
        .addTo(map)
        .bindTooltip("Your Location", {
          direction: "top",
          offset: [0, -10],
          className: "tooltip-tailwind",
        });

      const newCircle = L.circle(latLng, { radius: accuracy }).addTo(map);

      // Update state
      setLocationMarker(newMarker);
      setLocationCircle(newCircle);

      // Center map
      map.setView(latLng, map.getZoom());
    };

    const handleError = (err) => {
      if (err.code === 1) {
        alert("Please allow Geolocation access.");
      } else {
        alert("Cannot get current location.");
      }
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
    });
  };

  return (
    <div className="absolute top-4 left-4">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        onClick={fetchLocation}
      >
        Show My Location
      </button>
    </div>
  );
};

export default LIveLocation;
