import React from 'react';
import 'leaflet/dist/leaflet.css';
import "../MyHeader.css";

class MyHeader extends React.Component {
  render() {
    return (
      <div className="Title">
        <h1>RADARIN</h1>
      </div>
    );
  }
}
export default MyHeader;