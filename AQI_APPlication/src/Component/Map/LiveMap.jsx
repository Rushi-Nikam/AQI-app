import React, { useCallback, useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import * as d3 from "d3";
import { useMapContext } from "../../Context/MapContext";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import LiveLocation from "./LIveLocation";

const getColorFromAQI = (aqiValue) => {
  if (aqiValue <= 50) return '#00b050';
  if (aqiValue <= 100) return '#92d050';
  if (aqiValue <= 200) return '#ffff00';
  if (aqiValue <= 300) return '#ff9900';
  if (aqiValue <= 400) return '#ff0000';
  return '#c00000';
};

const createCustomIconWithD3 = (aqiValue, backgroundColor, textColor, size = 44) => {
  const width = size;
  const height = size * 1.2;
  const svg = d3
    .create("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`);

  svg
    .append("path")
    .attr(
      "d",
      `M${width * 0.8} ${height * 0.07}H${width * 0.2}c-${width * 0.07} 0-${width * 0.12} ${height * 0.04}-${width * 0.12} ${height * 0.1}v${height * 0.44}c0 ${height * 0.04} ${width * 0.07} ${height * 0.1} ${width * 0.12} ${height * 0.1}h${width * 0.15}l${width * 0.15} ${height * 0.3} ${width * 0.15}-${height * 0.3}h${width * 0.15}c${width * 0.07} 0 ${width * 0.12}-${height * 0.04} ${width * 0.12}-${height * 0.1}V${height * 0.15}c0-${height * 0.04}-${width * 0.07}-${height * 0.1}-${width * 0.12}-${height * 0.1}`
    )
    .attr("fill", backgroundColor);

  svg
    .append("text")
    .attr("x", "50%")
    .attr("y", "50%")
    .attr("text-anchor", "middle")
    .attr("dy", ".3em")
    .attr("font-size", size * 0.3)
    .attr("fill", textColor)
    .attr("font-family", "Arial")
    .text(aqiValue);

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg.node().outerHTML)}`,
    iconSize: [width, height],
  });
};


const SearchControl = () => {
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

    return () => map.removeControl(geocoderControl);
  }, [map]);

  return null;
};

const LiveMap = ({darkMode}) => {

  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const { radius, setRadius } = useMapContext();

  const updateMarkers = useCallback(() => {
    const newMarkers = [
      { aqi: 12, latitude: 18.6011, longitude: 73.7641 },
      { aqi: 85, latitude: 18.5204, longitude: 73.8567 },
      { aqi: 160, latitude: 18.5800, longitude: 73.7400 },
      { aqi: 45, latitude: 18.5074, longitude: 73.8070 },
      { aqi: 110, latitude: 18.5224, longitude: 73.8330 },
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

  // const getCoordinates = async (location) => {
  //   const response = await fetch(
  //     `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
  //   );
  //   const data = await response.json();
  //   if (data.length === 0) return null;
  //   return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  // };

  // const getRoute = async () => {
  //   if (!fromLocation || !toLocation) {
  //     alert("Please input both locations");
  //     return;
  //   }

  //   const fromCoords = await getCoordinates(fromLocation);
  //   const toCoords = await getCoordinates(toLocation);

  //   if (!fromCoords || !toCoords) {
  //     alert("Invalid location(s). Please try again.");
  //     return;
  //   }

  //   if (mapRef.current) {
  //     const map = mapRef.current;

  //     if (routeControlRef.current) {
  //       map.removeControl(routeControlRef.current);
  //       routeControlRef.current = null;
  //     }

  //     if (startMarkerRef.current) {
  //       map.removeLayer(startMarkerRef.current);
  //     }
  //     if (endMarkerRef.current) {
  //       map.removeLayer(endMarkerRef.current);
  //     }

  //     startMarkerRef.current = L.marker([fromCoords.lat, fromCoords.lon], {
  //       icon: startIcon,
  //     })
  //       .addTo(map)
  //       .bindPopup("Start Location");

  //     endMarkerRef.current = L.marker([toCoords.lat, toCoords.lon], {
  //       icon: endIcon,
  //     })
  //       .addTo(map)
  //       .bindPopup("Destination");

  //     routeControlRef.current = L.Routing.control({
  //       waypoints: [
  //         L.latLng(fromCoords.lat, fromCoords.lon),
  //         L.latLng(toCoords.lat, toCoords.lon),
  //       ],
  //       router: L.Routing.osrmv1({
  //         serviceUrl: "https://router.project-osrm.org/route/v1",
  //       }),
  //       createMarker: () => null,
  //     }).addTo(map);

  //     map.setView([fromCoords.lat, fromCoords.lon], 14);
  //   }
  // };

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
    <div className={`flex flex-col w-full h-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
  <div className={`mb-4 flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
    <select
      name="Selection"
      id="select"
      value={parseInt(radius)}
      onChange={(e) => setRadius(parseInt(e.target.value))}
      className={`p-3 border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg focus:outline-none w-full sm:w-auto ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
    >
      <option value="500">500(Meter)</option>
      <option value="1000">1000(Meter)</option>
      <option value="1500">1500(Meter)</option>
    </select>
  </div>

  <MapContainer
    className="h-full w-full z-50"
    center={[18.5913, 73.7389]}
    zoom={14}
    ref={mapRef}
    style={{ height: "100%", width: "100%" }}
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
