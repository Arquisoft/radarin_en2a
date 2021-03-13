import React from 'react';
import Leaflet from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "../Map.css";

class Map extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <MapContainer height="100" center={[43.36029, -5.84476]} zoom={10} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[43.36029, -5.84476]}>
          <Popup>
            Marker
    </Popup>
        </Marker>
      </MapContainer>)
  }
}
export default Map;