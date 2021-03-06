import React from 'react';
import {Navigation} from 'react-minimal-side-navigation';
import { SessionContext } from "@inrupt/solid-ui-react";
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Icon from "awesome-react-icons";

class MyMenu extends React.Component {
  
  constructor()
  {
    super()

    this.navItem = {
      title: 'Navigation',
      itemId: 'nav',
      elemBefore: () => <Icon name="more-vertical" />,
    };

    this.state = {
      isExpanded: false,
      items: this.getCollapsedItems()
    }
  }

  getExpandedItems(isAdmin)
  {
    let nav = [ this.navItem,  
      {
        title: <a href="#/dashboard">Home</a>,
        itemId: '/dashboard',
        // you can use your own custom Icon component as well
        // icon is optional
        elemBefore: () => <Icon name="map-pin" />
      },
      {
        title: <a href="#/friends">Friends</a>,
        itemId: '/friends', // TODO go to friends page
        // you can use your own custom Icon component as well
        // icon is optional
        elemBefore: () => <Icon name="users" />,
      }];

    if (isAdmin) {
      nav.push({
        title: <a href="#/settings">Settings</a>,
        itemId: '/settings',
        elemBefore: () => <Icon name="settings" />,
      });
    }

    nav.push({
      title: <a href="/radarinen2a-mobileapp.apk">Download the mobile app</a>,
      itemId: 'mobileapp-download',
      elemBefore: () => <Icon name="smartphone" />,
    });

    return nav;
  }

  getCollapsedItems()
  {
    return [this.navItem];
  }


  render() {
    return (
      <SessionContext.Consumer> 
      { context => 
      <>
          {(context.session.info.isAdmin)
            ?<p className="admin-disclaimer">You are logged in as an administrator</p>
            :<></>
          }

          <Navigation
              // you can use your own router's api to get pathname
              //activeItemId="/management/members"
              onSelect={({itemId}) => { 
                
                if (itemId === 'nav') {
                  if (this.state.isExpanded) {
                    this.setState({
                      isExpanded: false,
                      items: this.getCollapsedItems()
                    });
                  }
                  else {
                    this.setState({
                      isExpanded: true,
                      items: this.getExpandedItems(context.session.info.isAdmin)
                    });
                  }
                }
              }}
              items={this.state.items}
            />
        </>
      }
      </SessionContext.Consumer>
    );

  }
}
export default MyMenu;