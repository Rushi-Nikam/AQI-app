  import React from 'react';
  import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
  import 'leaflet/dist/leaflet.css';
  import { puneData } from '../../data';

  const center = [18.650436311537767, 73.80381254698356];

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

          {/* Polygons for Sub-locations */}
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
                eventHandlers={{
                  mouseover: (e) => {
                    const layer = e.target;
                    layer.setStyle({
                      fillColor: "#db6f0a662",
                      fillOpacity: 1,
                    });
                  },
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
      </div>
    );
  };

  export default Demo;
