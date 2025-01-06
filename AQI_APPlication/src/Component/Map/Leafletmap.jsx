import React, { useCallback, useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
// import ReactDOMServer from "react-dom/server";
// import { IoLocationSharp } from "react-icons/io5";
import 'leaflet-control-geocoder'; 
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'; 
import LIveLocation from "./LIveLocation"

const getColorFromAQI = (aqiValue) => {
  if (aqiValue <= 50) return "rgb(76, 175, 80)";
  if (aqiValue <= 100) return "rgb(255, 235, 59)";
  if (aqiValue <= 150) return "rgb(255, 152, 0)";
  if (aqiValue <= 200) return "rgb(244, 67, 54)";
  if (aqiValue <= 300) return "rgb(156, 39, 176)";
  return "rgb(139, 0, 0)";
};

const createCustomIconWithD3 = (aqiValue, backgroundColor, Color, size = 44) => {
  const width = size;
  const height = size * 1.2; // Adjust height proportionally
  const svg = d3.create("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`);

  // Draw path
  svg.append("path")
    .attr("d", `M${width * 0.8} ${height * 0.07}H${width * 0.2}c-${width * 0.07} 0-${width * 0.12} ${height * 0.04}-${width * 0.12} ${height * 0.1}v${height * 0.44}c0 ${height * 0.04} ${width * 0.07} ${height * 0.1} ${width * 0.12} ${height * 0.1}h${width * 0.15}l${width * 0.15} ${height * 0.3} ${width * 0.15}-${height * 0.3}h${width * 0.15}c${width * 0.07} 0 ${width * 0.12}-${height * 0.04} ${width * 0.12}-${height * 0.1}V${height * 0.15}c0-${height * 0.04}-${width * 0.07}-${height * 0.1}-${width * 0.12}-${height * 0.1}`)
    .attr("fill", backgroundColor);


  svg.append("text")
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
      .on('markgeocode', (e) => {
        const { center } = e.geocode;
        L.marker(center)
          .addTo(map)
          .bindPopup(e.geocode.name)
          .openPopup();
        map.setView(center, 20);
      })
      .addTo(map);
    return () => map.removeControl(geocoderControl);
  }, [map]);
  return null;
};

const Leafletmap = () => {
  const [data, setData] = useState(null);
  // const location = {
  //   loaded: false,
  //   coordinates: { lat: '', lng: '' },
  //   locationName: null,
  //   error: null,
  // };
  const [markers, setMarkers] = useState([]);

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

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const updateMarkers = useCallback(async () => {
    if (data) {
      //  data.aqi=360;
      //  data.latitude=18.652990;
      //  data.longitude=73.774390;
      try {
        const locationName = "Vehicle is here";
        
        const newMarker = {
          geocode: [data.latitude, data.longitude],
          popup: `${locationName}`,
          aqiValue: data.aqi,
          backgroundColor: getColorFromAQI(data.aqi),
          Color:(data.aqi <= 100 && data.aqi >= 50 )?"#000000":"#ffffff",
          
        };
        // console.log(data.latitude,data.longitude);
        setMarkers([newMarker]);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    }
  }, [fetchData , data]);
const intervelFun = ()=>{
  fetchData();
  updateMarkers();
}
  useEffect(() => {
    const interval = setInterval(intervelFun, 1000);
    return () => clearInterval(interval);
  }, [intervelFun]);

  // useEffect(() => {
  //   const interval = setInterval(updateMarkers, 1000);
  //   return () => clearInterval(interval);
  // }, [updateMarkers]);

  // useEffect(() => {
  //   const interval = setInterval(updateMarkers, 500);
  //   return () => clearInterval(interval);
  // }, [updateMarkers]);

  return (
    <div className="flex  w-full ">
      <MapContainer
        className="h-[40vh] sm:h-[50vh] md:h-[60vh] w-full  z-50"
        center={[18.5913, 73.7389]}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SearchControl />
        <LIveLocation/>
        {/* {location.loaded && location.coordinates.lat && (
          <Marker 
            position={[location.coordinates.lat, location.coordinates.lng]}
            icon={new Icon({
              iconUrl: `data:image/svg+xml;base64,${btoa(ReactDOMServer.renderToString(<IoLocationSharp size={30} color="black" />))}`,
              iconSize: [30, 30],
            })}
          >
            <Popup>{`${location.locationName || 'Pune District'}, Maharashtra`}</Popup>
          </Marker>
        )} */}
       {markers.map((marker, index) => (
  <Marker
    key={index}
    position={marker.geocode}
    icon={createCustomIconWithD3(marker.aqiValue, marker.backgroundColor,marker.Color, 40)} // Adjust size as needed
  >
    <Popup>{`${marker.popup}, Maharashtra`}</Popup>
  </Marker>
))}
      </MapContainer>
    </div>
  );
};

export default Leafletmap;

/* Commented LeafMap Code */
// const LeafMap = ({ setLocation }) => {
//   useEffect(() => {
//     const fetchLocation = () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           async (position) => {
//             const { latitude, longitude } = position.coords;
//             const locationName = "Your Location Here";

//             setLocation({
//               loaded: true,
//               coordinates: { lat: latitude, lng: longitude },
//               locationName,
//             });
//           },
//           (error) => {
//             console.error('Geolocation error:', error);
//             setLocation({ loaded: true, error: 'Location permission denied' });
//           }
//         );
//       } else {
//         setLocation({ loaded: true, error: 'Geolocation not supported' });
//       }
//     };

//     fetchLocation();
//     const intervalId = setInterval(fetchLocation, 2000);
//     return () => clearInterval(intervalId);
//   }, [setLocation]);

//   return null;
// };
