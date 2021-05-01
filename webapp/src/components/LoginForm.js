import React from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { LoginButton, SessionContext } from "@inrupt/solid-ui-react";


import './LoginForm.css'; // Tell webpack that Button.js uses these styles

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

    handleKeypress(e) {
        if (e.key === "Enter")
            this.btn.click();
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
                            <Form.Control className="input" name="idp" type="url" placeholder="Enter identity provider" 
                            onKeyPress={this.handleKeypress.bind(this)}
                            onChange={this.changeIdentityProvider.bind(this)} value={this.state.idp} />
                        
                            <Form.Control className="smallButton" as="select" onChange={this.changeIdentityProvider.bind(this)} >
                                <option value='https://inrupt.net'>Inrupt</option>
                                <option value='https://solidcommunity.net'>Solid Community</option>
                            </Form.Control>
                        </Form.Group>
                        <div  className="singleComponentRow">
                            <LoginButton oidcIssuer={this.state.idp} redirectUrl={this.state.currentUrl} >
                                <Button className="button" type='button' variant="primary" ref={node => (this.btn = node)} >
                                Login
                                </Button>
                            </LoginButton>
                        </div>
                    </Form>
                </>
            }
            </SessionContext.Consumer>
        )
    }
}

export default LoginForm