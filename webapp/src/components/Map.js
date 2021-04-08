import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "../Map.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Icon } from 'leaflet'


//import { geolocated } from 'react-geolocated';
//import UserLocation from '../UserLocation';

const DEFAULT_LATITUDE = 45.437781234170174; //43.36029;
const DEFAUlT_LONGITUDE = 12.323313772328168;//-5.84476;



class Map extends React.Component {

  state = {
    locationReady: false,
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAUlT_LONGITUDE
  }


  componentDidMount() {
    this.fetchLocation();
  }

  fetchLocation() {

    let success = (position) => {
      console.log("GEOLOCATION OBTAINED: ", position);
      let st = this.state;
      st.locationReady = true;
      st.latitude = position.coords.latitude;
      st.longitude = position.coords.longitude;
      this.setState(st);
    };
    let err = (msg) => {
      console.log("COULD NOT FIND LOCATION: ", msg);
      console.log("Defaulting to Gelateria Il Doge: (45.437781234170174, 12.323313772328168)");
      let st = this.state;
      st.locationReady = true; // TODO set to false and properly handle errors
      st.latitude = 45.437781234170174;
      st.longitude = 12.323313772328168;
      this.setState(st);
    };
    let config = {
      enableHighAccuracy: false,
      timeout: 20000
    };
    navigator.geolocation.getCurrentPosition(success.bind(this), err.bind(this), config);
  }

   submitForm() {
    var frm = document.getElementsByClassName('form')[0];
    frm.reset();  // Reset all form data
 }

  render() {

    if (this.state.locationReady) {
      const longitude = this.state.longitude;
      const latitude = this.state.latitude;
      console.log("RENDERING GEOLOC: ", latitude, longitude);

      const icon = new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })
      return (
        <MapContainer height="100" center={[latitude, longitude]} zoom={10} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]} icon={icon}>
            <Popup> 
              <form onSubmit={this.handleSubmit}>
                <label>
                  Comment:
          <input type="text" className="form" value={this.state.value} onChange={this.handleChange} />
                </label>
                
                <input type="submit" className="form" value="Submit" onclick="submitForm()"/>
                <label>
                  Picture:
          <input type="file" onChange={this.handleChange} accept=".png, .jpg, .jpeg"/>
          <input type="submit" value="Upload" />
                </label>
              </form>
            </Popup>
          </Marker>
          {(this.props.locations != undefined)
            ? this.props.locations.map(loc =>
                <Marker position={[loc.latitude, loc.longitude]} icon={icon} >
                  <Popup>
                    {loc.time}
                  </Popup>
                </Marker>)
            : <></>
          }
        </MapContainer>)
    }
    else {
      return (<p>Loading...</p>)
    }
  }


}
export default Map;
