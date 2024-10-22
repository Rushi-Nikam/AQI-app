import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon,divIcon, point } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

const Leafletmap = () => {
  const markers = [
    {
      geocode: [18.6492, 73.7707],
      popup: "Nigdi",
      background: "red",
    },
    {
      geocode: [18.6011, 73.7641],
      popup: "Wakad",
      background: "yellow",
    },
    {
      geocode: [18.5913, 73.7389],
      popup: "Hinjawadi",
      background: "blue",
    },
    {
      geocode: [18.7167, 73.7678],
      popup: "Dehu",
      background: "green",
    },
  ];

  const customIcon = new Icon({
    iconUrl: `Images/placeholder.png`,
    iconSize: [38, 38],
  });
const createCustomIcons = (cluster)=>{
return new divIcon({
html:`<div class="cluster-icon">${cluster.getChildCount()}</div>`,
className:"custom-marker-cluster",
iconSize:point(33,33,true)
})
}
  return (
    <MapContainer className="h-[55vh] w-[960px]" center={[18.5913, 73.7389]} zoom={13}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={createCustomIcons}
      >
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.geocode} icon={customIcon}>
            <Popup>
              <div style={{ backgroundColor: marker.background, padding: '5px', borderRadius: '5px', color: 'white' }}>
                {marker.popup}
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default Leafletmap;
