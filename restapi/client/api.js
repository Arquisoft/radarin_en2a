
export async function addUser(webId) {
    let response = await fetch(getApiEndPoint() + '/users/add', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({'webId': webId})
    })
    return await response.json()
}

export async function getUsers() {
    let response = await fetch(getApiEndPoint() + '/users/list')
    return await response.json()
}

export async function getLocations() {
    let response = await fetch(getApiEndPoint() + '/locations/list')
    return await response.json()
}

export async function addLocation(userWebId, latitude, longitude) {
    let response = await fetch(getApiEndPoint() + '/locations/add', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({'userWebId': userWebId, 'latitude': latitude, 'longitude': longitude})
    })
    return await response.json()
}

function getApiEndPoint() {
    //REACT_APP_API_URI is an enviroment variable defined in the file .env.development or .env.production
    return process.env.REACT_APP_API_URI || 'http://localhost:5000/api';
}