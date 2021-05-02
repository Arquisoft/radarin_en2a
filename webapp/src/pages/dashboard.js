import React from 'react';

import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getUsers, getLocations } from 'restapi-client';
import Map from "../components/Map";
<<<<<<< HEAD
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import markerUser from "../marker.png"
import markerLast from "../marker-last.png"
=======
//import Legend from '../components/Legend';
>>>>>>> 3ad655289b15a381afbf225738ceac2da96e7dc7

class DashboardPage extends React.Component {

  constructor() {
    super()
    this.state = {
      users: [],
      locations: []
    }
  }

  componentDidMount() {
    this.fetchUsers();
    this.fetchLocations();

    document.title = "Radarin"
  }

  refreshUsers(users) {
    this.setState({ users: users })
  }

  async fetchUsers() {
    try {
      let users = await getUsers()
      this.refreshUsers(users)
    } catch (error) {
      console.log("Error fetching user list from restapi. Is it on?")
    }
  }

  refreshLocations(locations) {
    this.setState({ locations: locations })
  }

  async fetchLocations() {
    try {
      let locations = await getLocations();
      this.refreshLocations(locations);
    } catch (error) {
      console.log("Error fetching Locations list from restapi. Alonso's fault")
    }
  }

  render() {
    return (
      <div>
        <h2>Home Page</h2>
          <table class="blueTable">
            <tr>
              <th>Legend</th>
            </tr>
            <tr>
              <td>Current location <img src={markerUser} width="20"></img></td>
            </tr>
            <tr>
              <td>Saved location <img src={markerLast} width="20"></img></td>
            </tr>
            <tr>
              <td>Friend location <img src={markerIconPng} width="12"></img></td>
            </tr>
          </table>
          <h4 class="alert">Click on the map to save a new location</h4>
     
        <div className="App-content">
          <Map locations={this.state.locations} fetchLocations={this.fetchLocations.bind(this)} />
        </div>

      </div >
    );
  }
}

export default DashboardPage;