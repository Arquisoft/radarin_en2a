/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar
} from 'react-native';

import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';
import SessionProvider from './components/session/SessionProvider';
import { SessionContext } from './components/session/SessionContext';

class App extends React.Component { 

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SessionProvider>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.headerBackground}>
            <Text style={styles.headerText}>
              Welcome to
              {'\n'}
              Radarin
            </Text>
          </View>
          <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
            <View>
              {/* v====== HERE STARTS THE BODY OF THE APPLICATION ======v */}
              <SessionContext.Consumer>
              { context => 
                  (context.isLoggedIn)
                  ? <Dashboard context={context}></Dashboard>
                  : <LoginForm  />
              }
              </SessionContext.Consumer>              
              {/* ^======= HERE ENDS THE BODY OF THE APPLICATION =======^ */}
            </View>
          </ScrollView>
        </SafeAreaView>
      </SessionProvider>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: 16,
  },
  headerText: {   
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  headerBackground: {
    paddingBottom: 16,
    paddingTop: 16,
    paddingHorizontal: 32,
    backgroundColor: '#282C34',
  },
});

export default App;
