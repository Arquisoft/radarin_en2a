import React from 'react';
import { SessionProvider, SessionContext, LogoutButton } from "@inrupt/solid-ui-react";
import './App.css';
import logo from './logo.svg';
import LoginForm from "./components/LoginForm";
import UserList from "./components/UserList";
import 'bootstrap/dist/css/bootstrap.min.css';
import { addUser, getUsers, getLocations } from 'restapi-client';
import Button from "react-bootstrap/Button";
import Map from "./components/Map";
import MyHeader from "./components/MyHeader";
import MyMenu from "./components/MyMenu";

class App extends React.Component {
  static contextType = SessionContext;

  constructor() {
    super()
    this.state = {
      users: [],
      locations: [],
      isLoggedIn: false,
    }
  }

  componentDidMount() {
    this.context.session.onLogin(() => this.onLogin());
    this.context.session.onLogout(() => this.onLogout());
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

  onLogin() {
    console.log("onLogin: ", this.context.session.info.webId, this.context.session.info.isLoggedIn);
    addUser(this.context.session.info.webId).then(() => this.fetchUsers());
    this.setState({ isLoggedIn: true });
  }

  onLogout() {
    console.log("onLogout: ", this.context.session.info.webId, this.context.session.info.isLoggedIn);
    this.setState({ isLoggedIn: false })
  }

  render() {
    return (
      <SessionProvider sessionId="radarin_en2a">
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <MyHeader />
          </header>
         
            {!this.state.isLoggedIn ?
              <LoginForm  /> :
              <>
                <div className="App-menu"><MyMenu /></div>

                <Map locations = {this.state.locations}/>
                <LogoutButton>
                  <Button>
                    Logout
                  </Button>
                </LogoutButton>
              </>
            }
             <div className="App-content">
            <UserList users={this.state.users} />
            <a className="App-link"
              href="https://github.com/Arquisoft/radarin_en2a"
              target="_blank"
              rel="noopener noreferrer">Source code</a>
          </div>
        </div>
      </SessionProvider>
    )
  }
}

export default App;