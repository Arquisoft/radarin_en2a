import React from 'react';
import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Icon from "awesome-react-icons";

class MyMenu extends React.Component {
  render() {
    return (
      <>
      <Navigation
          // you can use your own router's api to get pathname
          activeItemId="/management/members"
          onSelect={({itemId}) => {
            // maybe push to the route
          }}
          items={[
            {
              title: 'Friends',
              itemId: '/dashboard',
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
            },
          ]}
        />
    </>
    );
  }
}
export default MyMenu;