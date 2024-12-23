// 
import React, { useCallback, useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import * as d3 from 'd3';
import ReactDOMServer from "react-dom/server";
import { IoLocationSharp } from "react-icons/io5";

// Utility function to get the color from AQI value
const getColorFromAQI = (aqiValue) => {
  if (aqiValue <= 50) return "#00e400"; // Good
  if (aqiValue <= 100) return "#ffff00"; // Moderate
  if (aqiValue <= 150) return "#ffcc00"; // Unhealthy for sensitive groups
  if (aqiValue <= 200) return "#ff7e00"; // Unhealthy
  if (aqiValue <= 300) return "#ff0000"; // Very Unhealthy
  return "#7e0023"; // Hazardous
};

// Create custom icon based on AQI value
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
const fetchLocationName = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await response.json();


    return data?.address?.suburb || 'Unknown Location';
  } catch (error) {
    console.error('Error fetching location:', error);
    return 'Unknown Location';
  }
};

// LeafMap component to fetch live location and log it every 2 seconds
const LeafMap = ({ setLocation }) => {
  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const locationName = await fetchLocationName(latitude, longitude);

            // Update location data
            setLocation({
              loaded: true,
              coordinates: { lat: latitude, lng: longitude },
              locationName,
            });

            // Log the live location
            // console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Location: ${locationName}`);
          },
          (error) => {
            console.error('Geolocation error:', error);
            setLocation({ loaded: true, error: 'Location permission denied' });
          }
        );
      } else {
        setLocation({ loaded: true, error: 'Geolocation not supported' });
      }
    };

    // Call fetchLocation immediately on mount
    fetchLocation();

    // Set an interval to fetch the location every 2 seconds
    const intervalId = setInterval(fetchLocation, 2000);

    // Cleanup: clear the interval on component unmount
    return () => clearInterval(intervalId);

  }, [setLocation]);

  return null;
};


const Leafletmap = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: '', lng: '' },
    locationName: null,
    error: null,
  });
  const [markers, setMarkers] = useState([
    { geocode: [18.6492, 73.7707], popup: "Nigdi", aqiValue: 40, backgroundColor: "#00e400" },
    { geocode: [18.6011, 73.7641], popup: "Wakad", aqiValue: 105, backgroundColor: "#ff7e00" },
    { geocode: [18.5913, 73.7389], popup: "Hinjawadi", aqiValue: 103, backgroundColor: "#ff0000" },
    { geocode: [18.7167, 73.7678], popup: "Dehu", aqiValue: 102, backgroundColor: "#7e0023" },
  ]);

  // Fetch AQI data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`aqi_values/get-data/`);
        const sensors = await response.json();
        setData(sensors.Bus_data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Update markers with fetched AQI data and location
  const updateMarkers = useCallback(async () => {
    if (data) {
      try {
        const locationName = await fetchLocationName(data.latitude, data.longitude);
        
        // Log latitude and longitude
        // console.log(`Latitude: ${data.latitude}, Longitude: ${data.longitude}`);
  
        // Setting static coordinates and AQI for demonstration
        // data.latitude = 18.5204;
        // data.longitude = 73.8567;
        data.aqi = 50;
  
        const newMarker = {
          geocode: [data.latitude, data.latitude],
          popup: `City: ${locationName}`,
          aqiValue: data.aqi,
          backgroundColor: getColorFromAQI(data.aqi),
        };
  
        setMarkers((prevMarkers) => {
          // Avoid duplicate marker addition
          const exists = prevMarkers.some(
            (marker) => marker.geocode[0] === newMarker.geocode[0] && marker.geocode[1] === newMarker.geocode[1]
          );
          if (!exists) {
            return [...prevMarkers, newMarker];
          }
          return prevMarkers;
        });
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    }
  }, [data]);
  
  useEffect(() => {
    const interval = setInterval(updateMarkers, 2000);
  
    // Cleanup the interval on component unmount
    return () => clearInterval(interval); 
  }, [updateMarkers]);
  
  

  return (
    <MapContainer className="h-[55vh] w-full lg:w-[960px] z-50 overflow-hidden" center={[18.5913, 73.7389]} zoom={13}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LeafMap setLocation={setLocation} />
      {location.loaded && location.coordinates.lat && (
        <Marker
          position={[location.coordinates.lat, location.coordinates.lng]}
          icon={new Icon({
            iconUrl: `data:image/svg+xml;base64,${btoa(ReactDOMServer.renderToString(<IoLocationSharp size={30} color="blue" />))}`,
            iconSize: [30, 30],
          })}
        >
          <Popup>{`${location.locationName || 'Pune District'}, Maharashtra`}</Popup>
        </Marker>
      )}
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.geocode} icon={createCustomIcon(marker.aqiValue, marker.backgroundColor)}>
          <Popup>{`${marker.popup}, Maharashtra`}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Leafletmap;
