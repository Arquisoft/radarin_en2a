/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import NotificationsWebSocket from './src/NotificationsWebSocket';
import {name as appName} from './app.json';
import { API_URL } from '@env';

// needed by restapi-client
process.env.REACT_APP_API_URI = API_URL;

NotificationsWebSocket.configurePushNotifications();
AppRegistry.registerComponent(appName, () => App);
