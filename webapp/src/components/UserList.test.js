import React from 'react';
import { render, fireEvent, getByText } from "@testing-library/react";
import UserList from "./UserList";

test('check that the list of users renders propertly', async () => {
    const userList = [{webId: 'https://fulano.pod.provider/profile/card#me' }];
    const {getByText} = render(<UserList users={userList}/>);
    expect(getByText('Fetching data...')).toBeInTheDocument();
  });