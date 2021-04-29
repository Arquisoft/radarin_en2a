import React from 'react';

import '../App.css';
import { getUsers, deleteUserByWebId } from 'restapi-client';

import ListGroup from "react-bootstrap/ListGroup";

import Button from "react-bootstrap/Button";


class SettingsPage extends React.Component {

  constructor(props) {
    super(props)
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

  async deleteUser(webId) {

    let users = await getUsers();
    console.log("    USERS: " + users.map((user, i) => user.webId));


    console.log("REMOVING USER: " + webId)
    let requestUserWebId = this.props.session.info.webId; // Who is deleting?
    await deleteUserByWebId(requestUserWebId, webId);
    this.fetchUsers();
    
    let usersAfter = await getUsers();
    console.log("    USERS AFTER: " + usersAfter.map((user, i) => user.webId));
  }


  mapUsers(user, i)
  {
    console.log("Fetching data for user " + user.webId)
    let deleteFunc = this.deleteUser.bind(this);// Because JavaScript, we have to use this callback with bind(this)
    return (
        <ListGroup.Item id={i} key={i}>
            <a href={user.webId}>{user.webId}</a> 
            
            {(user.webId === this.props.session.info.webId) /* Dont delete ourselves!*/
              ? <></>
              : <Button onClick={() => deleteFunc(user.webId)}>Delete user</Button>
            }
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
          </>
          :
          <></>
          }
      </div>
    );
  }
}

export default SettingsPage;