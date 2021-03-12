import { CombinedDataProvider, Text } from '@inrupt/solid-ui-react';
import { FOAF } from '@inrupt/lit-generated-vocab-common';
import React from 'react';
import ListGroup from "react-bootstrap/ListGroup";


class UserList extends React.Component{
    render() {
        return (
            <div className="UserList">
                <h2>List of already registered users</h2>
                <ListGroup>
                    {this.props.users.map(function(user, i){
                        return (
                            <ListGroup.Item id={i} key={i}>
                                <CombinedDataProvider thingUrl={user.webId} datasetUrl={user.webId}>
                                    <a href={user.webId}><Text property={FOAF.name.iri.value} /></a>
                                </CombinedDataProvider>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
           </div>
        )
    }
}

export default UserList