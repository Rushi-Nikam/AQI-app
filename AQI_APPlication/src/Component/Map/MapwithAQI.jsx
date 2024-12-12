import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polygon,useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import * as L from 'leaflet';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'; // Import CSS
import * as d3 from 'd3';
import { puneData } from '../../data'; // Assuming puneData is available in your project

// Helper function to determine color based on AQI value
const getColorFromAQI = (aqiValue) => {
  if (aqiValue <= 50) return "#00e400"; // Good
  if (aqiValue <= 100) return "#ffff00"; // Moderate
  if (aqiValue <= 150) return "#ffcc00"; // Unhealthy for sensitive groups
  if (aqiValue <= 200) return "#ff7e00"; // Unhealthy
  if (aqiValue <= 300) return "#ff0000"; // Very Unhealthy
  return "#7e0023"; // Hazardous
};

// Function to create a custom icon using D3.js
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

// Live Location Component
// Live Location Component with Timeout
const LiveLocation = () => {
  const map = useMap();
  const [locationMarker, setLocationMarker] = useState(null);
  const [locationCircle, setLocationCircle] = useState(null);

  useEffect(() => {
    if (!map) return;

    const handleSuccess = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      const latLng = [latitude, longitude];

      // Delay the update of live location
      setTimeout(() => {
        if (locationMarker) {
          locationMarker.setLatLng(latLng);
          locationMarker.getPopup().setContent('You are here').openOn(map);
        } else {
          const marker = L.marker(latLng).addTo(map).bindPopup('You are here');
          setLocationMarker(marker);
          marker.openPopup();
        }

        if (locationCircle) {
          locationCircle.setLatLng(latLng).setRadius(accuracy);
        } else {
          const circle = L.circle(latLng, { radius: accuracy }).addTo(map);
          setLocationCircle(circle);
        }

        map.setView(latLng, map.getZoom());
        // console.log("it's",  accuracy);
      }, 2000); // Set a 2-second delay (you can adjust this value)
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

    // Fit map bounds to include marker and circle
    if (locationMarker && locationCircle) {
      const featureGroup = L.featureGroup([locationMarker, locationCircle]);
      map.fitBounds(featureGroup.getBounds());
    }

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map, locationMarker, locationCircle]);

  return null;
};


// Search Control Component
const SearchControl = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const geocoder = L.Control.Geocoder.nominatim();
    const geocoderControl = L.Control.geocoder({
      position: 'topright',
      placeholder: 'Search for location...',
      geocoder,
    })
      .on('markgeocode', async (e) => {
        const { center, name } = e.geocode;

        const response = await fetch(`http://localhost:5000/api/aqi?location=${name}`);
        const data = await response.json();

        const aqiValue = data?.aqi || 'Unknown';
        const backgroundColor = aqiValue !== 'Unknown' ? getColorFromAQI(aqiValue) : '#cccccc';

        const marker = L.marker(center, {
          icon: createCustomIcon(aqiValue, backgroundColor),
        }).addTo(map);

        marker.bindPopup(`Location: ${name}<br>AQI: ${aqiValue}`).openPopup();
        map.setView(center, 13);
      })
      .addTo(map);

    return () => map.removeControl(geocoderControl);
  }, [map]);

  return null;
};

// Main Map Component
const MapwithAQI = () => {
  const [markers, setMarkers] = useState([
    { geocode: [18.6492, 73.7707], popup: "Nigdi", aqiValue: 50, backgroundColor: "#00e400" },
    { geocode: [18.6011, 73.7641], popup: "Wakad", aqiValue: 105, backgroundColor: "#ff7e00" },
    { geocode: [18.5913, 73.7389], popup: "Hinjawadi", aqiValue: 103, backgroundColor: "#ff0000" },
    { geocode: [18.7167, 73.7678], popup: "Dehu", aqiValue: 102, backgroundColor: "#7e0023" },
  ]);

  useEffect(() => {
    const fetchAQIData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/aqi');
        const data = await response.json();

        const updatedMarkers = markers.map((marker) => {
          const cityData = data.find((item) => item.locality.toLowerCase() === marker.popup.toLowerCase());
          if (cityData) {
            return {
              ...marker,
              aqiValue: cityData.aqi,
              backgroundColor: getColorFromAQI(cityData.aqi),
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
  }, []);

  return (
    <MapContainer
      center={[18.5913, 73.7389]}
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
        <Marker
          key={index}
          position={marker.geocode}
          icon={createCustomIcon(marker.aqiValue, marker.backgroundColor)}
        >
          <Popup>
            <div style={{ padding: '5px', borderRadius: '5px', color: 'black' }}>
              {marker.popup}, Maharashtra<br />
              AQI: {marker.aqiValue}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Adding Polygons for Sub-locations from puneData */}
      {puneData.features.map((state, index) => {
        const coordinates = state.geometry.coordinates[0].map(coord => [coord[1], coord[0]]); // Swap [lng, lat] to [lat, lng]

        return (
          <Polygon
            key={index}
            positions={coordinates}
            pathOptions={{
              fillColor: "#FD8D3C",
              fillOpacity: 0.5,
              color: "white",
              weight: 1,
            }}
            eventHandlers={
              {
              // mouseover: (e) => {
              //   const layer = e.target;
              //   layer.setStyle({
              //     fillColor: "#db6f0a662",
              //     fillOpacity: 1,
              //   });
              // },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillColor: "#FD8D3C",
                  fillOpacity: 0.5,
                });
              },
            }}
          >
            <Popup>
              <strong>{state.properties.name}</strong><br />
              Density: {state.properties.density}
            </Popup>
          </Polygon>
        );
      })}
    </MapContainer>
  );
};

export default MapwithAQI;
