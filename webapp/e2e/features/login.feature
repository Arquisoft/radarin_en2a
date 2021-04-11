Feature: User Login

Scenario: The user is logging in for the first time in the site
  Given A user with a Solid Pod
  When I fill the Identity Provider in the form and press submit
  Then The user is redirected to Identity Provider login form
  When I fill the username and password and press login
  Then The user is redirected to the permissions page
  When I give permissions to the site
  Then The main view with the map is shown in the screen

Scenario: The user is logging in after the first time
  Given A user with a Solid Pod that already joined Radarin
  When I fill the Identity Provider in the form and press submit
  Then The user is redirected to Identity Provider login form
  When I fill the username and password and press login
  Then The main view with the map is shown in the screen