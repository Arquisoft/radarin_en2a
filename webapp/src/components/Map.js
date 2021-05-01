import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "../Map.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import markerUser from "../marker.png"
import markerLast from "../marker-last.png"
import { Icon } from 'leaflet'
import { addLocation, deleteLocation, modifyLocation, getFriends } from 'restapi-client';
import { SessionContext } from '@inrupt/solid-ui-react';
import { FOAF } from '@inrupt/lit-generated-vocab-common';
import { CombinedDataProvider, Text } from '@inrupt/solid-ui-react';
const DEFAULT_LATITUDE = 45.437781234170174; //43.36029;
const DEFAUlT_LONGITUDE = 12.323313772328168;//-5.84476;


function MyComponent({ webId, props }) {

  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      addLocation(webId, lat, lng);
      props.fetchLocations();
      props.fetchLocations();
    }
  });
  return null;

}



class Map extends React.Component {
  static contextType = SessionContext;

  constructor(props) {
    super(props)
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handlePictureChange = this.handlePictureChange.bind(this);

  }

  state = {
    locationReady: false,
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAUlT_LONGITUDE,
    name: "",
    description: "",
    picture: "",
    friends: [],
  }


  async componentDidMount() {
    this.fetchLocation();
    this.setState({ friends: await getFriends(this.context.session.info.sessionId) });
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
  handlePictureChange(event) {
    this.setState({
      picture: event.target.value
    });

  }

  isFriend(webId) {
    var friends = this.state.friends;
    for (const i in friends) {
      if (friends[i].webId === webId)
        return true;
    }
    return false;
  }

  deleteLocation(locationId) {
    deleteLocation(locationId);
    this.props.fetchLocations();
    this.props.fetchLocations();
  }

  modifyLocation(locationId) {

    var loc = this.props.locations.filter(l => l._id === locationId)[0];
    var name = this.state.name;
    var description = this.state.description;
    var picture = this.state.picture;

    if (name === "")
      name = loc.name;
    if (description === "")
      description = loc.description;
    if (picture === "")
      picture = loc.picture;
    modifyLocation(locationId, name, description, picture);
    this.props.fetchLocations();
    this.props.fetchLocations();
  }

  render() {

    if (this.state.locationReady) {
      const longitude = this.state.longitude;
      const latitude = this.state.latitude;
      console.log("RENDERING GEOLOC: ", latitude, longitude);

      const iconFriend = new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })
      const iconUser = new Icon({ iconUrl: markerUser, iconSize: [40, 41], iconAnchor: [18, 41] })
      const iconUserLast = new Icon({ iconUrl: markerLast, iconSize: [40, 41], iconAnchor: [18, 41] })
      return (
        <SessionContext.Consumer>
          {context =>
            <MapContainer height="100" center={[latitude, longitude]} zoom={10} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[latitude, longitude]} icon={iconUser}>
                <Popup>
                  You are here
              </Popup>
              </Marker>

              {this.state.lastClicked && <Marker position={this.state.lastClicked} draggable={true}>
                <Popup position={this.state.lastClicked}>
                  Current location: <pre>{JSON.stringify(this.state.lastClicked, null, 2)}</pre>
                </Popup>
              </Marker>}
              {this.props.locations.filter(l => l.userId === context.session.info.webId).map(loc =>
                <Marker position={[loc.latitude, loc.longitude]} icon={iconUserLast} >
                  <Popup >
                    <CombinedDataProvider thingUrl={loc.userId} datasetUrl={loc.userId}>
                      <a href={loc.userId}><Text property={FOAF.name.iri.value} /></a>
                    </CombinedDataProvider>
                    <img src={loc.picture} width="300" alt="Location"></img>
                    <h4 >{loc.name}</h4>
                    <p>{loc.description}</p>
                    <p>{loc.latitude}, {loc.longitude}</p>
                    <form>
                      <label>
                        Name:
                    <input type="text" id="name" className="modify" onChange={this.handleNameChange} />
                      </label>
                      <label>
                        Description:
                    <input type="text" id="description" className="modify" onChange={this.handleDescriptionChange} />
                      </label>
                      <label>
                        Photo URL:
                    <input type="text" id="picture" className="modify" onChange={this.handlePictureChange} />
                      </label>
                    </form>
                    <button onClick={() => this.deleteLocation(loc._id)}>Delete</button>
                    <button onClick={() => this.modifyLocation(loc._id)}>Modify</button>
                  </Popup>
                </Marker>
              )}
              {this.props.locations.filter(l => l.userId !== context.session.info.webId && this.isFriend(l.userId)).map(loc =>
                <Marker position={[loc.latitude, loc.longitude]} icon={iconFriend} >
                  <Popup>
                    <CombinedDataProvider thingUrl={loc.userId} datasetUrl={loc.userId}>
                      <a href={loc.userId}><Text property={FOAF.name.iri.value} /></a>
                    </CombinedDataProvider>
                    <h2 >{loc.name}</h2>
                    <p>{loc.description}</p>
                    <p>{loc.latitude}, {loc.longitude}</p>
                  </Popup>
                </Marker>
              )}
              <MyComponent webId={context.session.info.webId} props = {this.props} />
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
