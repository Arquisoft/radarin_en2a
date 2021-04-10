import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import DashboardPage from "./pages/dashboard";
import FriendsPage from "./pages/friends";
import SettingsPage from "./pages/settings";

const Routes = () => {
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
          <SettingsPage/>
        </Route>
        <Route path="/">
          <DashboardPage />
        </Route>
        
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
