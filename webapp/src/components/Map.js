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
      <MapContainer height="200" center={[51.505, -0.09]} zoom={10} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
        </Marker>
      </MapContainer>)
  }
}
export default Map;