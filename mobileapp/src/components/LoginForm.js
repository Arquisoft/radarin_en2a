import React from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SessionContext } from './session/SessionContext';

class LoginForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {idp: "https://inrupt.net", loggingIn: false}
    }

    componentDidMount() {
    }

    changeIdentityProvider(text) {
      const idp = text;
      this.setState({idp: idp});
    }

    render() {
        return (
            <SessionContext.Consumer>
            { context => 
                context.isLoggedIn 
                ?
                <></>
                :
                    (context.loginInProgress) 
                    ?<Text testID="loginInProgressText" style={styles.loggingInText}>Logging in...</Text> 
                    :<View style={styles.container}>
                        <View style={styles.singleComponentRow}>
                            <TextInput testID="idpInput" onChangeText={this.changeIdentityProvider.bind(this)} value={this.state.idp} style={styles.input}/>
                        </View>
                        <View style={styles.multiComponentRow}>
                            <TouchableOpacity style={styles.smallButton} onPress={() => this.changeIdentityProvider("https://inrupt.net")}>
                                <Text style={styles.smallButtonLabel}>Inrupt</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.smallButton} onPress={() => this.changeIdentityProvider("https://solidcommunity.net")}>
                                <Text style={styles.smallButtonLabel}>Solid Community</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.singleComponentRow}>
                            <TouchableOpacity style={styles.button} onPress={() => context.login(this.state.idp)}>
                                <Text style={styles.buttonLabel}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            }
            </SessionContext.Consumer>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  singleComponentRow: {
    justifyContent: 'space-between',
    padding: 3,
    marginHorizontal: 20,
  },
  multiComponentRow: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 3,
    marginHorizontal: 20,
  },
  smallButton: {
    alignSelf: 'stretch',
    borderRadius: 2,
    backgroundColor: '#2296F3',
    width: '45%',
    paddingVertical: 4,
    marginBottom: 10,
  },
  smallButtonLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
    textAlign: "center",
    textTransform: 'uppercase',
  },
  button: {
    alignSelf: 'stretch',
    borderRadius: 2,
    backgroundColor: '#2296F3',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 10,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    fontSize: 16,
  },
  loggingInText: {
    textAlign: 'center',
    fontSize: 20,
  }
});

export default LoginForm