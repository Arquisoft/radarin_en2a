import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "../Map.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import markerUser from "../marker.png"
import { Icon } from 'leaflet'
import { deleteLocation, modifyLocation } from 'restapi-client';
import { SessionContext } from '@inrupt/solid-ui-react';



//import { geolocated } from 'react-geolocated';
//import UserLocation from '../UserLocation';

const DEFAULT_LATITUDE = 45.437781234170174; //43.36029;
const DEFAUlT_LONGITUDE = 12.323313772328168;//-5.84476;


class Map extends React.Component {
  constructor(props) {
    super(props)
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.submitComment = this.submitComment.bind(this);
  }

  state = {
    locationReady: false,
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAUlT_LONGITUDE,
    name: "",
    description: "",
    picture: ""
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
    });
  }
  handleNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }
  handleDescriptionChange(event) {
    this.setState({
      description: event.target.value
    });
  }
  submitComment(e) {
    e.preventDefault();
    console.log(this.state.comment);
  }
  submitForm() {
    var frm = document.getElementsByClassName('form')[0];
    frm.reset();  // Reset all form data
  }

  deleteLocation(locationId) {
    deleteLocation(locationId);
    window.location.reload();
  }

  modifyLocation(locationId) {
    const name = this.state.name;
    const description = this.state.description;
    const picture = this.state.picture;
    modifyLocation(locationId, name, description, picture);
    window.location.reload();
  }

  render() {
    if (this.state.locationReady) {
      const longitude = this.state.longitude;
      const latitude = this.state.latitude;
      console.log("RENDERING GEOLOC: ", latitude, longitude);

      const iconFriend = new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })
      const iconUser = new Icon({ iconUrl: markerUser, iconSize: [40, 41], iconAnchor: [18, 41] })

      return (
        <SessionContext.Consumer>
          {context =>
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
              {this.props.locations.filter(l => l.userId == context.session.info.webId).map(loc =>
                <Marker position={[loc.latitude, loc.longitude]} icon={iconFriend} >
                  <Popup>
                    <h3 >{loc.name}</h3>
                    <h4>{loc.description}</h4>
                    <p>{loc.latitude}, {loc.longitude}</p>
                    {<img src={loc.picture} width="300px" alt="Depiction of the user coordinates"></img>}
                    <p>{loc.comment}</p>
                    <form onSubmit={this.handleSubmit}>
                      <label>
                        Name:
                    <input type="text" id="name" className="modify" onChange={this.handleNameChange} />
                      </label>
                      <label>
                        Description:
                    <input type="text" id="description" className="modify" onChange={this.handleDescriptionChange} />
                      </label>
                      <label>
                        Picture:
                    <input type="file" onChange={this.handleImgChange} accept=".png, .jpg, .jpeg" className="modify" id="picture" />
                      </label>
                    </form>
                    <button onClick={() => this.deleteLocation(loc._id)}>Delete</button>
                    <button onClick={() => this.modifyLocation(loc._id)}>Modify</button>
                  </Popup>
                </Marker>
              )}
              {this.props.locations.filter(l => l.userId != context.session.info.webId).map(loc =>
                <Marker position={[loc.latitude, loc.longitude]} icon={iconFriend} >
                  <Popup>
                    <h3 >{loc.name}</h3>
                    <h4>{loc.description}</h4>
                    <p>{loc.latitude}, {loc.longitude}</p>
                    {<img src={loc.picture} width="300px" alt="Depiction of the user coordinates"></img>}
                    <p>{loc.comment}</p>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          }
        </SessionContext.Consumer>)
    }
    else {
      return (<p>Loading...</p>)
    }
  }


}
export default Map;
