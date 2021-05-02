Feature: Save location

Scenario: The user is saving a location from the webapp
  Given A user with a Solid Pod that already joined Radarin
  When I fill the Identity Provider in the form and press submit
  Then The user is redirected to Identity Provider login form
  When I fill the username and password and press login
  Then The main view with the map is shown in the screen
  When I click on a point of the map
  Then a saved location mark appears and that point
  When I click on that mark
  Then I can see and edit its content