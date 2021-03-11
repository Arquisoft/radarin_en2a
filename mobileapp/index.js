/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// needed by restapi-client, inside an Android emulator the machine's localhost is accessed through 10.0.2.2
process.env.REACT_APP_API_URI = process.env.REACT_APP_API_URI || 'http://10.0.2.2:5000/api';

AppRegistry.registerComponent(appName, () => App);
