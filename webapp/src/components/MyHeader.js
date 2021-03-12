import React from 'react';
import Leaflet from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "../MyHeader.css";

class MyHeader extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="Title">
      <h1>RADARIN</h1>
    </div>
    );
  }
}
export default MyHeader;