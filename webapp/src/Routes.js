import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import DashboardPage from "./pages/dashboard";
import FriendsPage from "./pages/friends";
import SettingsPage from "./pages/settings";

const Routes = (props) => {
  console.log("ROUTER REDIRECTING WITH SESSION INFO: "+ JSON.stringify(props.session));
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/friends">
          <FriendsPage />
        </Route>
        <Route path="/dashboard">
          <DashboardPage />
        </Route>
        <Route path="/settings">
          {
            (props.session.info.isAdmin )
            ? <SettingsPage session={props.session}/>
            : <Redirect to="/dashboard" />
          }
        </Route>
        <Route path="/">
          <DashboardPage />
        </Route>
        
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
