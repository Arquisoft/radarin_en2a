import React from 'react'
import { render } from "@testing-library/react";
import LoginForm from "./LoginForm";

test('check that everything is rendering propertly', async () => {
  const { getByText } = render(<LoginForm/>);
  expect(getByText("Login")).toBeInTheDocument();
});