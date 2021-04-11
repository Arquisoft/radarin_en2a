import React from 'react';

import '../App.css';
import { getUsers, deleteUserByWebId, _registerUser } from 'restapi-client';

import ListGroup from "react-bootstrap/ListGroup";

import Button from "react-bootstrap/Button";


class SettingsPage extends React.Component {

  constructor() {
    super()
    this.userIndex = 0;
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    this.fetchUsers();
  }

  refreshUsers(users) {
    this.setState({ users: users })
  }

  async fetchUsers() {
    try {
      let users = await getUsers();
      this.refreshUsers(users);
    } catch (error) {
      console.log("Error fetching user list from restapi. Is it on?")
    }
  }

  async deleteUser(webId){
    await deleteUserByWebId(webId);
    this.fetchUsers();
  }

  async createUser() {
    let webId = "myUser_" + this.userIndex;
    console.log("CREATING DUMMY USER: " + webId)
    await _registerUser(webId);
    this.userIndex = this.userIndex+1;
    this.fetchUsers();
  }


  mapUsers(user, i)
  {
    console.log("Fetching data for user " + user.webId)
    let deleteFunc = this.deleteUser.bind(this);// Because JavaScript, we have to use this callback with bind(this)
    return (
        <ListGroup.Item id={i} key={i}>
            <a href={user.webId}>{user.webId}</a> | 
            <Button onClick={() => deleteFunc(user.webId)}>Delete user</Button>
        </ListGroup.Item>
    );
  }

  render() {
    return (
      <div>
          <h2>Admin Settings Page</h2>
          
          {
          (this.state.users !== undefined)
          ?
          <>
            <ListGroup>
              {/*Because JavaScript, we have to use this callback with bind(this)*/}
              {this.state.users.map(this.mapUsers.bind(this))}
            </ListGroup>
            <Button onClick={() => this.createUser()}>Create dummy user</Button>
          </>
          :
          <></>
          }
      </div>
    );
  }
}

export default SettingsPage;