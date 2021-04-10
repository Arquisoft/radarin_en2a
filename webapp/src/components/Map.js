import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "../Map.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import markerUser from "../marker.png"
import { Icon } from 'leaflet'


//import { geolocated } from 'react-geolocated';
//import UserLocation from '../UserLocation';

const DEFAULT_LATITUDE = 45.437781234170174; //43.36029;
const DEFAUlT_LONGITUDE = 12.323313772328168;//-5.84476;
var pic = null;
var comment = "";



class Map extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      picture: null
    }
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.submitComment = this.submitComment.bind(this);
  }

  state = {
    locationReady: false,
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAUlT_LONGITUDE,
    comment: "",
    picture: null
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
  handleChange = (e) => {
    this.setState({ comment: e.target.value });
  }
  handleImgChange(event) {
    this.setState({
      picture: URL.createObjectURL(event.target.files[0])
    })
    pic = URL.createObjectURL(event.target.files[0]);
  }
  handleCommentChange(event) {

    comment = event.target.value;
  }
  submitComment(e) {
    e.preventDefault();
    var comment = this.comment;
    console.log(comment);
  }
  submitForm() {
    var frm = document.getElementsByClassName('form')[0];
    var c = document.getElementsByClassName('commentForm')[0];
    document.getElementById('comment').value = c.value;
    frm.reset();  // Reset all form data
  }

  render() {

    if (this.state.locationReady) {
      const longitude = this.state.longitude;
      const latitude = this.state.latitude;
      console.log("RENDERING GEOLOC: ", latitude, longitude);

      const iconFriend = new Icon({ iconUrl: markerIconPng, iconSize: [35, 41], iconAnchor: [18, 41] })
      const iconUser = new Icon({ iconUrl: markerUser, iconSize: [35, 41], iconAnchor: [18, 41] })
      return (
        <MapContainer height="100" center={[latitude, longitude]} zoom={10} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]} icon={iconUser}>
            <Popup>
              You are here
            </Popup>
          </Marker>
          {this.props.locations.map(loc =>
            <Marker position={[loc.latitude, loc.longitude]} icon={iconFriend} >
              <Popup>
                {<img src={loc.picture} width="300px"></img>}
                <p>{loc.comment}</p>
                <form onSubmit={this.handleSubmit}>
                  <label>
                    Comment:
                    <input type="text" className="commentForm" value={this.state.comment} onChange={this.handleCommentChange} />
                  </label>
                  <label>
                    Picture:
                    <input type="file" onChange={this.handleImgChange} accept=".png, .jpg, .jpeg" />
                  </label>
                  <input type="submit" className="form" value="Upload" onclick="submitForm()" />
                </form>
              </Popup>
            </Marker>
          )}
        </MapContainer>)
    }
    else {
      return (<p>Loading...</p>)
    }
  }


}
export default Map;
