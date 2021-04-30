import React from 'react';
import { getFriends } from 'restapi-client';
import { SessionContext } from '@inrupt/solid-ui-react';
import { FOAF } from '@inrupt/lit-generated-vocab-common';
import { CombinedDataProvider, Text } from '@inrupt/solid-ui-react';

class FriendsPage extends React.Component {
  static contextType = SessionContext;
  
  state = {
    friends: [],
    loading: true
  }

  async componentDidMount() {
    this.setState({ friends: await getFriends(this.context.session.info.sessionId) });
    var self = this;
    setTimeout(() => {
      self.setState({ loading: false });
    }, 50);
  }

  handelOnLoad = () => {
    this.setState({
      loading: false
    })
  }

  render() {
    if (this.state.loading) {
      return (
        <h2>Loading...</h2>);
    }
    else {
      return (
        <SessionContext.Consumer>
          {context =>
            <div>
              <h2>Friends Page</h2>
              <h3>Number of friends: {this.state.friends.length}</h3>
              {this.state.friends.map(f =>
                <CombinedDataProvider thingUrl={f.webId} datasetUrl={f.webId}>
                  <h4> <a href={f.webId}><Text property={FOAF.name.iri.value} /></a></h4>
                </CombinedDataProvider>
              )}
            </div>
          }
        </SessionContext.Consumer>)
    }
  }

}

export default FriendsPage;