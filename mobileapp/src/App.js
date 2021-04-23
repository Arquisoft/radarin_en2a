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
  Image,
  StatusBar
} from 'react-native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';
import SessionProvider from './components/session/SessionProvider';
import { SessionContext } from './components/session/SessionContext';
import { connectSocket } from './Socket'

class App extends React.Component { 

  constructor(props) {
    super(props);
    connectSocket();
  }

  render() {
    return (
      <SessionProvider>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>

          <ScrollView contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              {/* v====== HERE STARTS THE BODY OF THE APPLICATION ======v */}

              <LoginForm  />
              
              <View>
              <SessionContext.Consumer>
              { context => 
                  (context.isLoggedIn)
                  ? <Dashboard name="to Radarin" context={context}></Dashboard>
                  : <View style={styles.engine}>
                      <Text>RADARIN</Text>
                      <Image source={require('./logo.svg')} />
                    </View>
              }
              </SessionContext.Consumer>
              </View>
              
              {/* ^======= HERE ENDS THE BODY OF THE APPLICATION =======^ */}
            </View>
          </ScrollView>


          {/*
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              <Welcome name="to Radarin"/>
              <LoginForm />
              
              
              <LearnMoreLinks />
            </View>
          </ScrollView>
          */}
        </SafeAreaView>
      </SessionProvider>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
