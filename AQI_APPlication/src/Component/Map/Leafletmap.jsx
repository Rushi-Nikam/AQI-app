import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import * as d3 from 'd3';
import ReactDOMServer from "react-dom/server";
import { IoLocationSharp } from "react-icons/io5";

const getColorFromAQI = (aqiValue) => {
  if (aqiValue <= 50) return "#00e400"; // Good
  if (aqiValue <= 100) return "#ffff00"; // Moderate
  if (aqiValue <= 150) return "#ffcc00"; // Unhealthy for sensitive groups
  if (aqiValue <= 200) return "#ff7e00"; // Unhealthy
  if (aqiValue <= 300) return "#ff0000"; // Very Unhealthy
  return "#7e0023"; // Hazardous
};
// Function to create custom icon based on AQI value
const createCustomIcon = (aqiValue, backgroundColor) => {
  const svgWidth = 38;
  const svgHeight = 38;
  const radius = 18;

  const svg = d3.create('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .attr('viewBox', '0 0 38 38')
    .attr('xmlns', 'http://www.w3.org/2000/svg');

  svg.append('circle')
    .attr('cx', svgWidth / 2)
    .attr('cy', svgHeight / 2)
    .attr('r', radius)
    .attr('fill', backgroundColor)
    .attr('stroke', '#ffffff')
    .attr('stroke-width', 2);

  svg.append('text')
    .attr('x', '50%')
    .attr('y', '50%')
    .attr('text-anchor', 'middle')
    .attr('dy', '.3em')
    .attr('font-size', 12)
    .attr('fill', '#ffffff')
    .attr('font-family', 'Arial')
    .text(aqiValue);

  const svgData = svg.node().outerHTML;
  const svgUrl = `data:image/svg+xml;base64,${btoa(svgData)}`;

  return new Icon({
    iconUrl: svgUrl,
    iconSize: [38, 38],
  });
};

// Function to fetch location name using reverse geocoding
const fetchLocation = async (setLocation) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
         
          if (data) {
            setLocation({
              loaded: true,
              coordinates: { lat: latitude, lng: longitude },
              locationName: data.address.city,
            });
          }
        } catch (error) {
          console.error('Error fetching location:', error);
          setLocation({
            loaded: true,
            error: 'Error fetching location',
          });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocation({
          loaded: true,
          error: 'Location permission denied',
        });
      }
    );
  } else {
    setLocation({
      loaded: true,
      error: 'Geolocation not supported',
    });
  }
};

// LeafMap component to fetch live location
const LeafMap = ({ setLocation }) => {
  useEffect(() => {
    fetchLocation(setLocation);
  }, [setLocation]);

  return null;
};

const Leafletmap = () => {
  const [data, setData] = useState(null);

  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
    locationName: null,
    error: null,
  });

  const [markers, setMarkers] = useState([
    { geocode: [18.6492, 73.7707], popup: "Nigdi", aqiValue: 40, backgroundColor: "#00e400" },
    { geocode: [18.6011, 73.7641], popup: "Wakad", aqiValue: 105, backgroundColor: "#ff7e00" },
    { geocode: [18.5913, 73.7389], popup: "Hinjawadi", aqiValue: 103, backgroundColor: "#ff0000" },
    { geocode: [18.7167, 73.7678], popup: "Dehu", aqiValue: 102, backgroundColor: "#7e0023" },
  ]);

  // Fetch AQI data

  
  
  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const response = await fetch(`aqi_values/get-data/`);
        const sensors = await response.json();
        setData(sensors.Bus_data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Update markers with fetched AQI data
  useEffect(() => {
    const updateMarkers = async () => {
      if (data) {
        try {
          // Fetch the location using reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${data.latitude}&lon=${data.longitude}&format=json`
          );
          const locationData = await response.json();
  
          // Extract the location name (suburb or city)
          const locationName = locationData?.address?.suburb || locationData?.address?.city || "unknown location";
               
          // Update the markers with the fetched location
          setMarkers((prevMarkers) => [
            ...prevMarkers,
            {
              geocode: [data.latitude, data.longitude],
              popup: `City: ${locationName}`,
              aqiValue: data.aqi, // Example AQI value
              backgroundColor: getColorFromAQI(data.aqi), // Example background color
            },
          ]);
        } catch (error) {
          console.error("Error fetching location data:", error);
        }
      }
    };
  
    const interval = setInterval(updateMarkers, 2000); // Update every 2 seconds
    return () => clearInterval(interval);
  }, [data]);
  
  return (
    <MapContainer
      className="h-[55vh] w-full lg:w-[960px] z-50 overflow-hidden"
      center={[18.5913, 73.7389]}
      zoom={13}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LeafMap setLocation={setLocation} />
      {location.loaded && (
        <Marker
          position={[location.coordinates.lat, location.coordinates.lng]}
          icon={new Icon({
            iconUrl: `data:image/svg+xml;base64,${btoa(ReactDOMServer.renderToString(<IoLocationSharp size={30} color="blue" />))}`,
            iconSize: [30, 30],
          })}
        >
          <Popup>
            <div style={{ padding: '5px', borderRadius: '5px', color: 'Black' }}>
              {`${location?location.locationName:"Pune District"}`},Maharashtra
            </div>
          </Popup>
        </Marker>
      )}
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.geocode}
          icon={createCustomIcon(marker.aqiValue, marker.backgroundColor)}
        >
          <Popup>
            <div style={{ padding: '5px', borderRadius: '5px', color: 'Black' }}>
              {marker.popup}, Maharashtra 
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Leafletmap;
