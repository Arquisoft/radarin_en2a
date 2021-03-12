import React from 'react'
import { render } from "@testing-library/react";
import LoginForm from "./LoginForm";
import { SessionContext } from '@inrupt/solid-ui-react';

test('check that everything is rendering propertly', async () => {
  const { getByText } = render(
    <SessionContext.Provider value={{sessionRequestInProgress: false}}>
      <LoginForm/>
    </SessionContext.Provider>);
  expect(getByText("Login")).toBeInTheDocument();
});

test('check that everything is rendering propertly while logging in', async () => {
  const { getByText } = render(
    <SessionContext.Provider value={{sessionRequestInProgress: true}}>
      <LoginForm/>
    </SessionContext.Provider>);
  expect(getByText("Logging in...")).toBeInTheDocument();
});