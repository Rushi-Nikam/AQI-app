import React, { useCallback, useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import * as d3 from "d3";
import LiveLocation from "./LIveLocation";
import { useMapContext } from "../../Context/MapContext";

const getColorFromAQI = (aqiValue) => {
  if (aqiValue <= 50) return '#00b050';
  if (aqiValue <= 100) return '#92d050';
  if (aqiValue <= 200) return '#ffff00';
  if (aqiValue <= 300) return '#ff9900';
  if (aqiValue <= 400) return '#ff0000';
   return '#c00000';
};
const createCustomIconWithD3 = (
  aqiValue,
  backgroundColor,
  Color,
  size = 44
) => {
  const width = size;
  const height = size * 1.2; // Adjust height proportionally
  const svg = d3
    .create("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`);

  // Draw path
  svg
    .append("path")
    .attr(
      "d",
      `M${width * 0.8} ${height * 0.07}H${width * 0.2}c-${width * 0.07} 0-${
        width * 0.12
      } ${height * 0.04}-${width * 0.12} ${height * 0.1}v${height * 0.44}c0 ${
        height * 0.04
      } ${width * 0.07} ${height * 0.1} ${width * 0.12} ${height * 0.1}h${
        width * 0.15
      }l${width * 0.15} ${height * 0.3} ${width * 0.15}-${height * 0.3}h${
        width * 0.15
      }c${width * 0.07} 0 ${width * 0.12}-${height * 0.04} ${width * 0.12}-${
        height * 0.1
      }V${height * 0.15}c0-${height * 0.04}-${width * 0.07}-${height * 0.1}-${
        width * 0.12
      }-${height * 0.1}`
    )
    .attr("fill", backgroundColor);

  svg
    .append("text")
    .attr("x", "50%")
    .attr("y", "50%")
    .attr("text-anchor", "middle")
    .attr("dy", ".3em")
    .attr("font-size", size * 0.3)
    .attr("fill", `${Color}`)
    .attr("font-family", "Arial")
    .text(aqiValue);

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg.node().outerHTML)}`,
    iconSize: [width, height],
  });
};
const startIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Start Location
  iconSize: [35, 45],
});

const endIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684913.png", // Destination Location
  iconSize: [35, 45],
});

const SearchControl = () => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;

    // Geocoder integration
    const geocoder = L.Control.Geocoder.nominatim();
    const geocoderControl = L.Control.geocoder({
      position: "topright",
      placeholder: "Search for location...",
      geocoder,
    })
      .on("markgeocode", (e) => {
        const { center } = e.geocode;

        // Remove any existing circles
        if (map._searchCircle) {
          map.removeLayer(map._searchCircle);
        }

        // Add a circle of radius 1km (1000 meters)
        map._searchCircle = L.circle(center, {
          radius: 1000, // Set radius in meters
          color: "#339abe", // Circle border color
          fillColor: "lightblue", // Fill color
          fillOpacity: 0.5, // Transparency level
        }).addTo(map);

        L.marker(center).addTo(map).bindPopup(e.geocode.name).openPopup();

        map.setView(center, 13);
      })
      .addTo(map);

    return () => map.removeControl(geocoderControl);
  }, [map]);

  return null;
};

const LiveMap = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const mapRef = useRef(null);
  const routeControlRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const { radius, setRadius } = useMapContext();
  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);
  // const routeControlRef = useRef(null);
  // Function to update markers
  const updateMarkers = useCallback(() => {
    const newMarkers = [
      // { aqi: 12, latitude: 18.6011, longitude: 73.7641 },
      // { aqi: 85, latitude: 18.5204, longitude: 73.8567 },
      // { aqi: 160, latitude: 18.5800, longitude: 73.7400 },
      // { aqi: 45, latitude: 18.5074, longitude: 73.8070 },
      // { aqi: 110, latitude: 18.5224, longitude: 73.8330 },
    ];

    const updatedMarkers = newMarkers.map((data) => ({
      geocode: [data.latitude, data.longitude],
      popup: "Vehicle is here",
      aqiValue: data.aqi,
      backgroundColor: getColorFromAQI(data.aqi),
      textColor: data.aqi <= 200 ? "#000000" : "#ffffff",
    }));

    setMarkers(updatedMarkers);
  }, []);

  // Function to get coordinates from a location name
  const getCoordinates = async (location) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
    );
    const data = await response.json();
    if (data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  };

  // Function to get the route between locations
  const getRoute = async () => {
    if (!fromLocation || !toLocation) {
      alert("Please input both locations");
      return;
    }

    const fromCoords = await getCoordinates(fromLocation);
    const toCoords = await getCoordinates(toLocation);

    if (!fromCoords || !toCoords) {
      alert("Invalid location(s). Please try again.");
      return;
    }

    if (mapRef.current) {
      const map = mapRef.current;

      // 🔴 Step 1: Remove previous route if exists
      if (routeControlRef.current) {
        map.removeControl(routeControlRef.current);
        routeControlRef.current = null;
      }

      // 🔴 Step 2: Remove previous markers
      if (startMarkerRef.current) {
        map.removeLayer(startMarkerRef.current);
      }
      if (endMarkerRef.current) {
        map.removeLayer(endMarkerRef.current);
      }

      // 🟢 Step 3: Add new Start Marker
      startMarkerRef.current = L.marker([fromCoords.lat, fromCoords.lon], {
        icon: startIcon,
      })
        .addTo(map)
        .bindPopup("Start Location");

      // 🟢 Step 4: Add new End Marker
      endMarkerRef.current = L.marker([toCoords.lat, toCoords.lon], {
        icon: endIcon,
      })
        .addTo(map)
        .bindPopup("Destination");

      // 🟢 Step 5: Create and add new route
      routeControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(fromCoords.lat, fromCoords.lon),
          L.latLng(toCoords.lat, toCoords.lon),
        ],
        router: L.Routing.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
        }),
        createMarker: () => null, // Hide default markers
      }).addTo(map);

      // 🔄 Center map to new location
      map.setView([fromCoords.lat, fromCoords.lon], 14);
    }
  };

  //  console.log("route"+{routeControlRef})
  useEffect(() => {
    if (mapRef.current && !mapRef.current._loaded) {
      mapRef.current._loaded = true;
    }
  }, [mapRef]);

  useEffect(() => {
    const interval = setInterval(updateMarkers, 5000);
    return () => clearInterval(interval);
  }, [updateMarkers]);

  return (
    <div className="flex flex-col w-full h-[100vh]">
      <div className="mb-4 flex flex-col justify-end sm:flex-row items-center gap-4  p-4  rounded-lg">
        <select
          name="Selection"
          id="select"
          value={parseInt(radius)}
          onChange={(e) => setRadius(parseInt(e.target.value))}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none"
        >
          <option value="500">500(Meter)</option>
          <option value="1000">1000(Meter)</option>
          <option value="1500">1500(Meter)</option>
        </select>
      </div>

      <MapContainer
        className="h-[80vh] w-full z-50"
        center={[18.5913, 73.7389]}
        zoom={14}
        // whenCreated={(map)=>{mapRef.current=map}}
        ref={mapRef}
        // whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <SearchControl />
        <LiveLocation />
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.geocode}
            icon={createCustomIconWithD3(
              marker.aqiValue,
              marker.backgroundColor,
              marker.textColor,
              48
            )}
          >
            <Popup>{marker.popup}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
