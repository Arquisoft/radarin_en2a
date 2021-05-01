import React from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { LoginButton, SessionContext } from "@inrupt/solid-ui-react";

class LoginForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {idp: "https://inrupt.net", currentUrl: "https://localhost:3000", loggingIn: false}
    }

    componentDidMount(){
        let url = window.location.href.split("#")[0];
        console.log("PARSING URL FROM '" + window.location.href + "' TO '" + url + "'");
        this.setState({currentUrl: url})
    }

    changeIdentityProvider(e) {
      const idp = e.target.value;
      this.setState({idp: idp});
    }

    setIdentityProvider(idp) {
        this.setState({idp: idp});
    }

    render() {
        return (
            <SessionContext.Consumer>
            { context => 
                (context.sessionRequestInProgress) 
                ?<span>Logging in...</span> 
                :<>
                    <Form name="login">
                        <Form.Group>
                            <Form.Label>Identity Provider</Form.Label>
                            <Form.Control name="idp" type="url" placeholder="Enter identity provider" onChange={this.changeIdentityProvider.bind(this)} value={this.state.idp} />
                        
                        </Form.Group>
                        <>
                        <Button onClick={() => this.setIdentityProvider('https://inrupt.net')}>Inrupt</Button>
                        <Button onClick={() => this.setIdentityProvider('https://solidcommunity.net')}>Solid Community</Button>
                        </>
                        <LoginButton oidcIssuer={this.state.idp} redirectUrl={this.state.currentUrl}>
                            <Button>
                            Login
                            </Button>
                        </LoginButton>
                    </Form>
                </>
            }
            </SessionContext.Consumer>
        )
    }
}

export default LoginForm