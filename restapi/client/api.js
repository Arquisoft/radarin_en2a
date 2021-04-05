
/**
 * @returns A list with User models of all registered users.
 */
export async function getUsers() {
    let response = await fetch(getApiEndPoint() + '/users/list')
    return await checkResponse(response)
}

/**
 * @returns A list with Location models of all locations.
 */
export async function getLocations() {
    let response = await fetch(getApiEndPoint() + '/locations/list')
    return await checkResponse(response)
}

/**
 * Adds a new location to the specified user.
 * @param {*} userWebId  The webId of a registerd user.
 * @param {*} latitude The latitude of the coordinate.
 * @param {*} longitude The longitude of the coordinate.
 * @returns The Location model
 * @throws if the user does not exist.
 */
export async function addLocation(userWebId, latitude, longitude) {
    let response = await fetch(getApiEndPoint() + '/locations/add', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({'userWebId': userWebId, 'latitude': latitude, 'longitude': longitude})
    })
    return await checkResponse(response)
}

export async function sessionLogin(doRedirect, redirectUrl, oidcIssuer, isMobile) {
    let url = getApiEndPoint() + `/session/login?redirectUrl=${redirectUrl}&oidcIssuer=${oidcIssuer}`;
    if (isMobile) {
        url += "&mobile";
    }
    doRedirect(getApiEndPoint() + `/session/login?redirectUrl=${redirectUrl}&oidcIssuer=${oidcIssuer}`);
}

export async function sessionLogout(sessionId) {
    let response = await fetch(getApiEndPoint() + `/session/logout?sessionId=${sessionId}`)
    return await checkResponse(response)
}

export async function sessionInfo(sessionId) {
    let response = await fetch(getApiEndPoint() + `/session/info?sessionId=${sessionId}`)
    return await checkResponse(response)
}

export async function sessionFetch(sessionId, resource) {
    let url = getApiEndPoint() + `/session/fetch?resource=${resource}`;
    if (sessionId !== null) {
        url += `&sessionId=${sessionId}`;
    }

    return await fetch(url)
}

/**
 * If the status code is 200 (OK), it returns the response JSON; otherwise, it throws it as an error
 */
async function checkResponse(response) {
    if (response.status != 200) {
        throw await response.json() // this json contains the error message
    }
    return await response.json()
}

function getApiEndPoint() {
    //REACT_APP_API_URI is an enviroment variable defined in the file .env.development or .env.production
    return process.env.REACT_APP_API_URI || 'http://localhost:5000/api';
}