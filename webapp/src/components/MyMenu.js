import React from 'react';
import {Navigation} from 'react-minimal-side-navigation';
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

  getExpandedItems()
  {
    return [ this.navItem,  
    {
      title: <a href="/dashboard">Home</a>,
      itemId: '/dashboard',
      // you can use your own custom Icon component as well
      // icon is optional
      elemBefore: () => <Icon name="map-pin" />
    },
    {
      title: <a href="/friends">Friends</a>,
      itemId: '/friends', // TODO go to friends page
      // you can use your own custom Icon component as well
      // icon is optional
      elemBefore: () => <Icon name="users" />,
    },
    {
      title: 'Comments',
      itemId: '/management',
      elemBefore: () => <Icon name="message-circle" />,
      
    },
    {
      title: 'Alerts',
      itemId: '/another',
      elemBefore: () => <Icon name="bell" />,
    },
    {
      title: 'Settings',
      itemId: '/settings',
      elemBefore: () => <Icon name="settings" />,
    }];
  }

  getCollapsedItems()
  {
    return [this.navItem];
  }


  render() {
    return (
      <>
      <Navigation
            // you can use your own router's api to get pathname
            //activeItemId="/management/members"
            onSelect={({itemId}) => { 
              
              if (itemId == 'nav') {
                if (this.state.isExpanded) {
                  this.setState({
                    isExpanded: false,
                    items: this.getCollapsedItems()
                  });
                }
                else {
                  this.setState({
                    isExpanded: true,
                    items: this.getExpandedItems()
                  });
                }
              }
            }}
            items={this.state.items}
          />
      </>
    );

  }
}
export default MyMenu;