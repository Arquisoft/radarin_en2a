import 'react-native';
import React from 'react';
import LoginForm from './LoginForm';
import { render, fireEvent } from '@testing-library/react-native';
import { SessionContext } from './session/SessionContext';

test('renders correctly', async () => {
    const { getByText } = render(<LoginForm />);

    // login button exist
    expect(getByText("Login")).toBeEnabled();
});

test('renders correctly while logging in', async () => {
    const { getByTestId, queryByText } = render(
        <SessionContext.Provider value={{ isLoggedIn: false, loginInProgress: true }}>
            <LoginForm />
        </SessionContext.Provider>
    );

    // login button does not exist
    expect(queryByText("Login")).toBeNull();
    expect(getByTestId("loginInProgressText")).not.toBeNull();
});

test('identity provider shortcuts work', () => {
    const { getByText, getByTestId } = render(<LoginForm />);

    const identityProviderInput = getByTestId("idpInput");
    
    fireEvent.press(getByText("Inrupt"));
    expect(identityProviderInput).toHaveProp("value", "https://inrupt.net");

    fireEvent.press(getByText("Solid Community"));
    expect(identityProviderInput).toHaveProp("value", "https://solidcommunity.net");
});

test('custom identity provider work', () => {
    const loginFn = jest.fn();

    const { getByText, getByTestId } = render(
        <SessionContext.Provider value={{ isLoggedIn: false, loginInProgress: false, login: loginFn }}>
            <LoginForm />
        </SessionContext.Provider>
    );

    const identityProviderInput = getByTestId("idpInput");
    
    const idp = "https://solidcommunity.net";
    fireEvent.changeText(identityProviderInput, idp);
    expect(identityProviderInput).toHaveProp("value", idp);

    fireEvent.press(getByText("Login"));

    expect(loginFn).toHaveBeenCalledWith(idp);
});