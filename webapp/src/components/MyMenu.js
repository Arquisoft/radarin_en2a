import React from 'react';
import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Icon from "awesome-react-icons";

class MyMenu extends React.Component {
  constructor() {
    super();
  }

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
              title: 'Amigos',
              itemId: '/dashboard',
              // you can use your own custom Icon component as well
              // icon is optional
              elemBefore: () => <Icon name="users" />,
            },
            {
              title: 'Comentarios',
              itemId: '/management',
              elemBefore: () => <Icon name="message-circle" />,
              subNav: [
                {
                  title: 'Ejemplo',
                  itemId: '/management/projects',
                },
                {
                  title: 'Ejemplo',
                  itemId: '/management/members',
                },
              ],
            },
            {
              title: 'Notificaciones',
              itemId: '/another',
              elemBefore: () => <Icon name="bell" />,
              subNav: [
                {
                  title: 'Ejemplo',
                  itemId: '/management/teams',
                },
              ],
            },
          ]}
        />
    </>
    );
  }
}
export default MyMenu;