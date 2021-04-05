import React from 'react';
import { Button } from 'react-native';
import { SessionContext } from './session/SessionContext';

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
    }
}

export default LoginForm