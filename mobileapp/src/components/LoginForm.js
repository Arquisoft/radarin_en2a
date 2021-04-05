import React from 'react';
import { Button, Linking } from 'react-native';
import { sessionLogin } from 'restapi-client';

class LoginForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {idp: "https://inrupt.net"}
    }

    componentDidMount() {
    }

    changeIdentityProvider(e) {
      const idp = e.target.value;
      this.setState({idp: idp});
    }

    render() {
        return (
            <Button onPress={this.onLogin.bind(this)} title = "Login"/>
        )
    }

    async onLogin() {
        sessionLogin(
            url => Linking.openURL(url),
            "radarinen2a://login",
            this.state.idp,
        );
    }
}

export default LoginForm