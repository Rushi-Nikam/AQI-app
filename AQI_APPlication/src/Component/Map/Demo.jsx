import React from 'react';
import { MapContainer, TileLayer,Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {puneData} from '../../data';

const center = [18.525196144243743, 73.82449586188785];

const Demo = () => {
  return (
    <div>
      <MapContainer
        center={center}
        zoom={10}
        style={{ width: '100vw', height: '100vh' }}
      >
        <TileLayer
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=6WYlaNDYa6TfRNoRjGVw"
          attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        />
     {
      puneData.features.map((state)=>{
        const coordinates = state.geometry.coordinates[0].map((item)=> [item[1], item[0]]);
        return (<Polygon
        pathOptions={{
          fillColor:"#FD8D3C",
          fillOpacity:0.7,
          weight:2,
          opacity:1,
          dashArray:3,
          color:'white',


        }}
        positions={coordinates}
        eventHandlers={{
          mouseover:(e)=>{const layer = e.target;
          layer.setStyle({
            fillOpacity:0.7,
            weight:2,
            dashArray:"3",
            color:"#666",
            fillColor:"#D4962"
          })
        },
        mouseout:(e)=>{const layer = e.target;
          layer.setStyle({
            fillOpacity:0.7,
            weight:2,
            dashArray:"3",
            color:"white",
            fillColor:"FD8D3C"
          })
        },
        click: (e)=>{}
      }

       }

        />)
      })
     }
      </MapContainer>
    </div>
  );
};

export default Demo;
