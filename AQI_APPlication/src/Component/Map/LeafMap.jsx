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

const SearchControl = ({ isDarkMode }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const geocoder = L.Control.Geocoder.nominatim();
    const geocoderControl = L.Control.geocoder({
      position: "topright",
      placeholder: "Search for location...",
      geocoder,
    })
      .on("markgeocode", (e) => {
        const { center } = e.geocode;

        if (map._searchCircle) {
          map.removeLayer(map._searchCircle);
        }

        map._searchCircle = L.circle(center, {
          radius: 1000,
          color: "#339abe",
          fillColor: "lightblue",
          fillOpacity: 0.5,
        }).addTo(map);

        L.marker(center).addTo(map).bindPopup(e.geocode.name).openPopup();
        map.setView(center, 13);
      })
      .addTo(map);

    // Apply dark mode styles to the geocoder input
    const geocoderElement = document.querySelector('.leaflet-control-geocoder');
    if (geocoderElement) {
      const input = geocoderElement.querySelector('input');
      if (isDarkMode) {
        geocoderElement.classList.add('bg-gray-800', 'text-white');
        input.classList.add('bg-gray-700', 'text-white', 'placeholder-gray-400');
      } else {
        geocoderElement.classList.remove('bg-gray-800', 'text-white');
        input.classList.remove('bg-gray-700', 'text-white', 'placeholder-gray-400');
      }
    }

    return () => map.removeControl(geocoderControl);
  }, [map, isDarkMode]);

  return null;
};

const LeafMap = ({darkMode}) => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const mapRef = useRef(null);
   const [data, setData] = useState({
      aqi:"",
      latitude:"",
      longitude:"",
    });
  const routeControlRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  // const { radius, setRadius } = useMapContext();
  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);
  // const routeControlRef = useRef(null);
  // Function to update markers
  const fetchData = async () => {
      try {
        const response = await fetch(`aqi_values/get-data/`);
        const sensors = await response.json();
        // const data = sensors.Bus_data;
        setData(sensors.Bus_data);
        // console.log({data});
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
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
  <div className={`flex flex-col w-full h-[100vh] ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
  {/* Input and Button Section */}
  <div
    className={`mb-4 flex flex-col sm:flex-row items-center gap-4 p-4 shadow-md rounded-lg ${
      darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
    }`}
  >
    <input
      type="text"
      placeholder="From Location"
      value={fromLocation}
      onChange={(e) => setFromLocation(e.target.value)}
      className={`w-full sm:w-1/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
        darkMode ? "bg-gray-700 text-white border-gray-600" : "border-gray-300"
      }`}
    />

    <input
      type="text"
      placeholder="To Location"
      value={toLocation}
      onChange={(e) => setToLocation(e.target.value)}
      className={`w-full sm:w-1/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
        darkMode ? "bg-gray-700 text-white border-gray-600" : "border-gray-300"
      }`}
    />

    <button
      onClick={getRoute}
      className={`w-full sm:w-auto px-5 py-3 rounded-lg shadow-md transition active:scale-95 ${
        darkMode
          ? "bg-gray-700 text-white hover:bg-blue-600"
          : "bg-gray-500 text-white hover:bg-blue-600"
      }`}
    >
      Get Route 🚀
    </button>
  </div>

  {/* Map Container */}
  <MapContainer
    className="h-[80vh] w-full z-50 rounded-lg overflow-hidden"
    center={[18.5913, 73.7389]}
    zoom={14}
    ref={mapRef}
  >
    {/* Use dark tiles if dark mode is enabled */}
    <TileLayer
      url=    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    
    <SearchControl  isDarkMode={darkMode}/>
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

export default LeafMap;
