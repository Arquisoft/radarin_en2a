const { defineFeature, loadFeature } = require('jest-cucumber');
const feature = loadFeature('./features/saveLocation.feature');

defineFeature(feature, test => {
    beforeEach(async () => {
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    })

    afterEach(async () => {
        // reset to clear any previous logged in session
        await resetBrowserContext();
    });

    test('The user is saving a location from the webapp', ({ given, when, then }) => {
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
            await page.waitForNavigation({ 'waitUntil': 'networkidle0' });
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
            await page.waitForNavigation({ 'waitUntil': 'networkidle0' });
            await expect(page).toMatchElement('.leaflet-container', { timeout: 60000 }); // the map is shown
        });

        when('I click on a point of the map', async () => {
            await expect(page).toClick('.leaflet-container');
        });

        then('A saved location mark appears and that point', async () =>    {
            await page.waitForNavigation({ 'waitUntil': 'networkidle0'});
            await expect(page).toMatchElement('Marker', {icon: "../../src/marker-last.png"});
        });

        
    });
});