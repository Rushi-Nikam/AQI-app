import React, { useCallback, useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
// import ReactDOMServer from "react-dom/server";
// import { IoLocationSharp } from "react-icons/io5";
import 'leaflet-control-geocoder'; 
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'; 
import LIveLocation from "./LIveLocation"
import { Link } from 'react-router-dom';
import LiveLocation from './LIveLocation';

const getColorFromAQI = (aqiValue) => {
  if (aqiValue <= 50) return '#00b050';
  if (aqiValue <= 100) return '#92d050';
  if (aqiValue <= 200) return '#ffff00';
  if (aqiValue <= 300) return '#ff9900';
  if (aqiValue <= 400) return '#ff0000';
   return '#c00000';
};
const createCustomIconWithD3 = (aqiValue, backgroundColor, Color, size = 44) => {
  const width = size;
  const height = size * 1.5; // Adjust height proportionally
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

const SearchControl = ({ isDarkMode }) => {
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

    // Get the geocoder element and apply dark mode or light mode classes
    const geocoderElement = document.querySelector('.leaflet-control-geocoder');
    if (geocoderElement) {
      if (isDarkMode) {
        geocoderElement.classList.add('bg-gray-800', 'text-white');
        geocoderElement.querySelector('input').classList.add('bg-gray-700', 'text-white');
      } else {
        geocoderElement.classList.remove('bg-gray-800', 'text-white');
        geocoderElement.querySelector('input').classList.remove('bg-gray-700', 'text-white');
      }
    }

    return () => map.removeControl(geocoderControl);
  }, [map, isDarkMode]);

  return null;
};


const Leafletmap = ({darkMode}) => {
  const [data, setData] = useState({
    aqi:"",
    latitude:"",
    longitude:"",
  });
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

  useEffect(() => {
    fetchData();
  }, []);

  // const updateMarkers = useCallback(async () => {
    
  //      data.aqi=12;
  //      data.latitude=18.6011;
  //      data.longitude=73.7641;
      
  //     try {
  //       const locationName = "Vehicle is here";
        
  //       const newMarker = {
  //         geocode: [data.latitude, data.longitude],
  //         popup: `${locationName}`,
  //         aqiValue: data.aqi,
  //         backgroundColor: getColorFromAQI(data.aqi),
  //         Color:(data.aqi <= 100 && data.aqi >= 50 )?"#000000":"#ffffff",
          
  //       };
  //       console.log(data.latitude,data.longitude);
  //       setMarkers([...newMarker,newMarker]);
  //     } catch (error) {
  //       console.error('Error fetching location data:', error);
  //     }
  //   },
  //  [ data]);
  const updateMarkers = useCallback(async () => {
    try {
      const newMarkers = [
        { aqi: 12, latitude: 18.6011, longitude: 73.7641 }, // Location 1
        { aqi: 85, latitude: 18.5204, longitude: 73.8567 }, // Location 2
        { aqi: 160, latitude: 18.5800, longitude: 73.7400 }, // Location 3
        { aqi: 45, latitude: 18.5074, longitude: 73.8070 }, // Location 4 (Kothrud)
        { aqi: 110, latitude: 18.5224, longitude: 73.8330 }, // Location 5 (Shivajinagar)
        { aqi: 190, latitude: 18.5310, longitude: 73.8440 }, // Location 6 (Deccan)
        { aqi: 70, latitude: 18.5008, longitude: 73.8500 }, // Location 7 (Koregaon Park)
        { aqi: 130, latitude: 18.5510, longitude: 73.9200 }, // Location 8 (Hadapsar)
        { aqi: 95, latitude: 18.5860, longitude: 73.7550 }, // Location 9 (Hinjawadi)
        { aqi: 175, latitude: 18.6500, longitude: 73.7700 }, // Location 10 (Ravet)
        { aqi: 60, latitude: 18.5203, longitude: 73.8568 }, // Location 11 (Swargate)
        { aqi: 140, latitude: 18.5679, longitude: 73.9145 }, // Location 12 (Magarpatta)
        { aqi: 200, latitude: 18.5001, longitude: 73.9270 }, // Location 13 (Wagholi)
        { aqi: 80, latitude: 18.5890, longitude: 73.8125 }, // Location 14 (Baner)
        { aqi: 155, latitude: 18.5805, longitude: 73.7403 }, // Location 15 (Pashan)
      ];
      
  
      const updatedMarkers = newMarkers.map((data) => ({
        geocode: [data.latitude, data.longitude],
        popup: "Vehicle is here",
        aqiValue: data.aqi,
        backgroundColor: getColorFromAQI(data.aqi),
        Color: data.aqi <= 200 && data.aqi >= 101 ? "#000000" : "#ffffff",
      }));
  
      setMarkers(updatedMarkers);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  }, [data]);
  
const intervelFun = ()=>{
  // fetchData();
  updateMarkers();
}
  useEffect(() => {
    const interval = setInterval(intervelFun, 1000);
    return () => clearInterval(interval);
  }, [intervelFun]);

  // intervelFun();
  // useEffect(() => {
  //   const interval = setInterval(updateMarkers, 1000);
  //   return () => clearInterval(interval);
  // }, [updateMarkers]);

  // useEffect(() => {
  //   const interval = setInterval(updateMarkers, 500);
  //   return () => clearInterval(interval);
  // }, [updateMarkers]);

  return (
    <Link to="/Leaf-map" >

   <div className="flex w-full">
  <MapContainer
    className={`h-[60vh] sm:h-[70vh] lg:h-[80vh] md:h-[80vh] w-full rounded-[4%] z-50 ${
      darkMode ? "bg-gray-900" : "bg-white"
    }`}
    center={[18.5913, 73.7389]}
    zoom={13}
    zoomControl={false}
    scrollWheelZoom={false}
    doubleClickZoom={false}
    dragging={false}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //  url={
    //     darkMode
    //       ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    //       : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //   }
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <SearchControl />
    <LiveLocation />

    {/* Display dynamic markers */}
    {markers.map((marker, index) => (
      <Marker
        key={index}
        position={marker.geocode}
        icon={createCustomIconWithD3(marker.aqiValue, marker.backgroundColor, marker.Color, 40)}
      >
        <Popup>{`${marker.popup}, Maharashtra`}</Popup>
      </Marker>
    ))}
  </MapContainer>

  {/* Optional Link for navigation */}
  {/* <div className="absolute top-[170px] right-20 z-50">
    <Link to="/map-aqi">
      <button className="px-8 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-transparent hover:text-black border-2 border-green-300">
         Map
      </button>
    </Link>
  </div> */}
</div>

  </Link>
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
