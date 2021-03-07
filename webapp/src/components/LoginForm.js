import React from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { LoginButton } from "@inrupt/solid-ui-react";

class LoginForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {idp: "https://inrupt.net", currentUrl: "https://localhost:3000"}
    }

    componentDidMount(){
        this.setState({currentUrl: window.location.href})
    }

    changeIdentityProvider(e) {
      const idp = e.target.value;
      this.setState({idp: idp});
    }

    render() {
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Identity Provider</Form.Label>
                    <Form.Control name="idp" type="url" placeholder="Enter identity provider" onChange={this.changeIdentityProvider.bind(this)} value={this.state.idp} />
                </Form.Group>
                <LoginButton oidcIssuer={this.state.idp} redirectUrl={this.state.currentUrl}>
                    <Button>
                    Login
                    </Button>
              </LoginButton>
            </Form>
        )
    }
}

export default LoginForm