import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet-control-geocoder'; // For geocoder control
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import * as d3 from 'd3';
// import img from "../../../public/Images/1.png";

const getColorFromAQI = (aqiValue) => {
  if (aqiValue <= 50) return "#00e400"; // Good
  if (aqiValue <= 100) return "#ffff00"; // Moderate
  if (aqiValue <= 150) return "#ffcc00"; // Unhealthy for sensitive groups
  if (aqiValue <= 200) return "#ff7e00"; // Unhealthy
  if (aqiValue <= 300) return "#ff0000"; // Very Unhealthy
  return "#7e0023"; // Hazardous
};

const createCustomIcon = (aqiValue, backgroundColor) => {
  // Create a simple circle SVG
  const svgWidth = 38;
  const svgHeight = 38;
  const radius = 18; // Fixed radius for simplicity

  // Set up the SVG structure
  const svg = d3.create('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .attr('viewBox', '0 0 38 38')
    .attr('xmlns', 'http://www.w3.org/2000/svg');

  // Add a circle with dynamic size and color based on AQI
  svg.append('circle')
    .attr('cx', svgWidth / 2)
    .attr('cy', svgHeight / 2)
    .attr('r', radius) // Fixed circle radius
    .attr('fill', backgroundColor) // Set background color based on AQI
    .attr('stroke', '#ffffff')
    .attr('stroke-width', 2);

  // Add text to represent AQI value, adjusted dynamically based on the value
  svg.append('text')
    .attr('x', '50%')
    .attr('y', '50%')
    .attr('text-anchor', 'middle')
    .attr('dy', '.3em') // Adjust vertical alignment
    .attr('font-size', 12) // Fixed font size
    .attr('fill', '#ffffff')
    .attr('font-family', 'Arial')
    .text(aqiValue);

  // Convert the D3-created SVG to a data URL
  const svgData = svg.node().outerHTML;
  const svgUrl = `data:image/svg+xml;base64,${btoa(svgData)}`;

  // Return the Leaflet icon with the generated SVG circle
  return new Icon({
    iconUrl: svgUrl,
    iconSize: [38, 38],
  });
};

// Search Control Component
const SearchControl = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Initialize Geocoder
    const geocoder = L.Control.Geocoder.nominatim();
    const geocoderControl = L.Control.geocoder({
      position: 'topright',
      placeholder: 'Search for location...',
      geocoder,
    })
      .on('markgeocode', (e) => {
        const { center } = e.geocode;
        L.marker(center).addTo(map).bindPopup(e.geocode.name).openPopup();
        map.setView(center, 13);
      })
      .addTo(map);

    return () => map.removeControl(geocoderControl);
  }, [map]);

  return null;
};

// Live Location Component
const LiveLocation = () => {
  const map = useMap();
  const [locationMarker, setLocationMarker] = useState(null);
  const [locationCircle, setLocationCircle] = useState(null);

  useEffect(() => {
    if (!map) return;

    const handleSuccess = async (pos) => {
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;
      const accuracy = pos.coords.accuracy;
      const latLng = [latitude, longitude];
      let data;
      let pop="Your Location ";
      // Send data to the Python server
      try {
        const response = await fetch(`aqi_values/get-data/`)
        data = await response.json();
        console.log("latitude",data.sensor.latitude);
        console.log("longitude",data.sensor.longitude)
      //   if(data.Errormsg){
      //     pop = data.Errormsg;
      //   }else if(!data.Errormsg){
      //     pop = `<p> <b>Sensor Data:</b> Temp: ${JSON.parse(sensor.sensor_data).Temp}°C, 
      //   Humid: ${JSON.parse(sensor.sensor_data).humid}%</p>`
      //   }else{
      //     pop= "You Location"
      //   }
      //   // console.log('Server Response:', data);
      } catch (error) {
        console.error('Error sending data to server:', error);
      }
      if (locationMarker) {
        locationMarker.setLatLng(latLng);
        locationMarker.getPopup().setContent(pop).openOn(map);
      } else {
        const marker = L.marker(latLng).addTo(map).bindPopup(pop);
        setLocationMarker(marker);
        marker.openPopup();
      }

      if (locationCircle) {
        locationCircle.setLatLng(latLng).setRadius(accuracy);
      } else {
        const circle = L.circle(latLng, { radius: accuracy + 1 }).addTo(map);
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

const Leafletmap = () => {
  const [data, setdata]=useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`aqi_values/get-data/`);
        const sensors = await response.json();
        console.log("latitude", sensors.sensor.latitude);
        console.log("longitude", sensors.sensor.longitude);
        setdata(sensors);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const [markers, setMarkers] = useState([
    { geocode: [18.6492, 73.7707], popup: "Nigdi", aqiValue: 40, backgroundColor: "#00e400" },
    { geocode: [18.6011, 73.7641], popup: "Wakad", aqiValue: 105, backgroundColor: "#ff7e00" },
    { geocode: [18.5913, 73.7389], popup: "Hinjawadi", aqiValue: 103, backgroundColor: "#ff0000" },
    // { geocode: [18.7167, 73.7678], popup: "Dehu", aqiValue: 102, backgroundColor: "#7e0023" },
    
  ]);
  useEffect(() => {
    if (data && data.sensor) {
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        {
          geocode: [data.sensor.latitude, data.sensor.longitude],
          popup: "Dehu", // Update if needed
          aqiValue: 104, // Update if needed
          backgroundColor: "#7e0023", // Update if needed
        },
      ]);
    }
  }, [data]);

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
      className="h-[55vh] w-full lg:w-[960px] z-50 overflow-hidden"
      center={[18.5913, 73.7389]}
      zoom={13}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SearchControl />
      <LiveLocation  />
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.geocode}
          icon={createCustomIcon(marker.aqiValue, marker.backgroundColor)}
        >
          <Popup>
            <div style={{  padding: '5px', borderRadius: '5px', color: 'Black' }}>
              {marker.popup},Maharashtra
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Leafletmap;
