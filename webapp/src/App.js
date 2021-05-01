import React from 'react';

import { SessionContext, LogoutButton } from "@inrupt/solid-ui-react";

import './App.css';
import logo from './logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyHeader from "./components/MyHeader";
import MyMenu from "./components/MyMenu";
import Button from "react-bootstrap/Button";
import LoginForm from "./components/LoginForm";

import Routes from "./Routes";

class App extends React.Component {
  
  static contextType = SessionContext;

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <MyHeader />
        </header>
        
        {!this.context.session.info.isLoggedIn 
        
          ?<LoginForm  />
          :<div>
            <div className="App-menu"><MyMenu /></div>

            {/* Show a page depending on the current route */}
            <Routes session={this.context.session} />

            <LogoutButton>
              <Button>
                Logout
              </Button>
            </LogoutButton>
          </div>
        }
      
      </div>
    )
  }
}

export default App;