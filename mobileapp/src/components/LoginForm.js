import React from 'react';
import { Button, TextInput, View, Text  } from 'react-native';
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
                    ?<Text>Logging in...</Text> 
                    :<>
                        <View>
                            <Text>Identity provider:</Text>
                            <TextInput
                                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                                onChangeText={this.changeIdentityProvider.bind(this)}
                                value={this.state.idp}
                            />
                        </View>
                        <Button onPress={() => context.login(this.state.idp)} title = "Login"/>
                    </>
            }
            </SessionContext.Consumer>
        )
        /*
        return (
            <SessionContext.Consumer>
            { context => 
                context.loginInProgress ?
                    <Button disabled title = "Logging in..."/> :
                context.logoutInProgress ?
                    <Button disabled title = "Logging out..."/> :
                context.isLoggedIn ?
                    <Button onPress={() => context.logout()} title = "Logout"/> :
                    <Button onPress={() => context.login(this.state.idp)} title = "Login"/>
            }
            </SessionContext.Consumer>
        )
        */
    }
}

export default LoginForm