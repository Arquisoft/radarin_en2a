const {defineFeature, loadFeature}=require('jest-cucumber');
const feature = loadFeature('./features/login.feature');

defineFeature(feature, test => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0'});
  })

  afterEach(async () => {
    // reset to clear any previous logged in session
    await resetBrowserContext();
  });

  test('The user is logging in for the first time in the site', ({given,when,then}) => {
    let idp;
    let username;
    let password;

    given('A user with a Solid Pod', () => {
      idp = "https://localhost:8443"
      username = "user1"
      password = "123456";
    });

    when('I fill the Identity Provider in the form and press submit', async () => {
      await expect(page).toFillForm('form[name="login"]', {
        idp: idp,
      })
      await expect(page).toClick('button', { text: 'Login' })
    });

    then('The user is redirected to Identity Provider login form', async () => {
      await page.waitForNavigation({'waitUntil': 'networkidle0'});
      await expect(page).toMatch('Login')
    });

    when('I fill the username and password and press login', async () => {
      await expect(page).toFillForm('form', {
        username: username,
        password: password,
      })
      await expect(page).toClick('button[id="login"]');
    });

    then('The user is redirected to the permissions page', async () => {
      await page.waitForNavigation({'waitUntil': 'networkidle0'});
      await expect(page).toMatch('Authorize')
    });

    when('I give permissions to the site', async () => {
      await expect(page).toClick('button[name="consent"]');
    });

    then('The main view with the map is shown in the screen', async () => {
      await page.waitForNavigation({'waitUntil': 'networkidle0'});
      await expect(page).toMatchElement('.leaflet-container', { timeout: 60000 }); // the map is shown
    });
  });

  test('The user is logging in after the first time', ({given,when,then}) => {
    let idp;
    let username;
    let password;

    given('A user with a Solid Pod that already joined Radarin', async () => {
      idp = "https://localhost:8443"
      username = "user3"
      password = "123456";
    });

    when('I fill the Identity Provider in the form and press submit', async () => {
      await expect(page).toFillForm('form[name="login"]', {
        idp: idp,
      })
      await expect(page).toClick('button', { text: 'Login' })
    });

    then('The user is redirected to Identity Provider login form', async () => {
      await page.waitForNavigation({'waitUntil': 'networkidle0'});
      await expect(page).toMatch('Login')
    });

    when('I fill the username and password and press login', async () => {
      await expect(page).toFillForm('form', {
        username: username,
        password: password,
      })
      await expect(page).toClick('button[id="login"]');
    });

    then('The main view with the map is shown in the screen', async () => {
      await page.waitForNavigation({'waitUntil': 'networkidle0'});
      await expect(page).toMatchElement('.leaflet-container', { timeout: 60000 }); // the map is shown
    });
  });
});