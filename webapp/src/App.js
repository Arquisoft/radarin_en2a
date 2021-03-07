import React from 'react';
import { SessionProvider} from "@inrupt/solid-ui-react";
import './App.css';
import logo from './logo.svg';
import Welcome from './components/Welcome';
import LoginForm from "./components/LoginForm";
import UserList from "./components/UserList";
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component{
  constructor(){
    super()
    this.state = {users:[]}
  }

  refreshUsers(users){
    this.setState({users:users})
  }

  render(){
    return(
      <SessionProvider sessionId="radarin_en2a">
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <Welcome name="ASW students"/>
          </header>
          <div className="App-content">
            <LoginForm/>
            <UserList users={this.state.users}/>
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