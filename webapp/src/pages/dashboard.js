import React from 'react';

import '../App.css';
import UserList from "../components/UserList";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getUsers, getLocations } from 'restapi-client';
import Map from "../components/Map";

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

  refreshLocations(locations)   {
    this.setState({ locations: locations})
  }

  async fetchLocations()  {
    try{
      let locations = await getLocations();
      this.refreshLocations(locations);
    }catch(error) {
      console.log("Error fetching Locations list from restapi. Alonso's fault")
    }
  }

  render() {
  return (
    <div>
        <h2>Home Page</h2>
        <div className="App-content">

            <Map locations = {this.state.locations}/>
                {
                    (this.state.users != undefined)
                    ? <UserList users={this.state.users} />
                    : <></>
                }
                
                <a className="App-link"
                href="https://github.com/Arquisoft/radarin_en2a"
                target="_blank"
                rel="noopener noreferrer">Source code</a>
        </div>
    </div>
  );
}
}

export default DashboardPage;