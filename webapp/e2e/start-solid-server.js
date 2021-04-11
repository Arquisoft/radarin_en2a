const { createServer } = require('solid-server');
const request = require('supertest');
const fs = require('fs');

// to avoid errors due to the self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED=0;

const server = createServer({
    root: "./solid-server/data",
    configPath: "./solid-server/data/config",
    dbPath: "./solid-server/data/.db",
    sslKey: "./solid-server/key.pem",
    sslCert: "./solid-server/cert.pem",
    enforceToc: false,
    multiuser: true,
    port: 8443,
    serverUri: 'https://localhost:8443',
});

server.on('close', () => {
    // remove created files
    fs.rmdirSync("./solid-server/data", { recursive: true })
});

server.listen(8443, () => {
    console.log("Solid server running");
    // remember to add the subdomains to /etc/hosts or C:\Windows\System32\drivers\etc\hosts when running the tests locally, e.g. '127.0.0.1 user1.localhost'
    createUser("user1", "User1", "123456", false);
    createUser("user2", "User2", "123456", false);
    createUser("user3", "User3", "123456", true);
    createUser("user4", "User4", "123456", true);
});

process.on('SIGINT', () => {
    // to close the server on Ctrl+C
    server.close();
})

async function createUser(username, name, password, trustsRadarin) {
    const response = await request(server)
                        .post('/api/accounts/new')
                        .send(`username=${username}&name=${name}&password=${password}&repeat_password=${password}`)
                        .set("Content-Type", "application/x-www-form-urlencoded")
                        .set("Host", "localhost:8443");

    if (response.status == 302) {
        console.log(`Created user '${username}'`);

        if (trustsRadarin) {
            fs.writeFileSync(`./solid-server/data/${username}.localhost/profile/card$.ttl`, getTrustedRadarinAppProfileCard(name));
        }
    } else {
        console.log(`Failed to create user '${username}'`);
    }
}

// contents of profile/card$.ttl file that trusts the radarin app
function getTrustedRadarinAppProfileCard(name) {
    return `@prefix : <#>.
@prefix solid: <http://www.w3.org/ns/solid/terms#>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix pim: <http://www.w3.org/ns/pim/space#>.
@prefix schema: <http://schema.org/>.
@prefix ldp: <http://www.w3.org/ns/ldp#>.
@prefix pro: <./>.
@prefix n0: <http://www.w3.org/ns/auth/acl#>.
@prefix inbox: </inbox/>.
@prefix use: </>.

pro:card a foaf:PersonalProfileDocument; foaf:maker :me; foaf:primaryTopic :me.

:me
    a schema:Person, foaf:Person;
    n0:trustedApp
    [ n0:mode n0:Append, n0:Read, n0:Write; n0:origin <http://localhost:5000> ];
    ldp:inbox inbox:;
    pim:preferencesFile </settings/prefs.ttl>;
    pim:storage use:;
    solid:account use:;
    solid:privateTypeIndex </settings/privateTypeIndex.ttl>;
    solid:publicTypeIndex </settings/publicTypeIndex.ttl>;
    foaf:name "${name}".
`
}
