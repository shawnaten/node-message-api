const frisby = require('frisby');

const baseUrl = 'http://hapi:80';
const creds = new Buffer('daniel.addison.wurzbach@maildrop.cc:notDaniel').toString('base64');
const createUrl = '/user/create?first=Daniel&middle=Addison&last=Wurzbach&password=notDaniel&email=daniel.addison.wurzbach@maildrop.cc';

var jwt;
var chatId;

frisby.create('Create User')
    .post(baseUrl + createUrl)
    .expectStatus(200)
    .afterJSON(verify)
    .toss();

function verify(json) {
    frisby.create('Verify User')
        .post(baseUrl + '/user/verify?token=' + json.token)
        .expectStatus(200)
        .after(getJWT)
        .toss();
}

function getJWT() {
    frisby.create('Get JWT')
        .addHeader('Authorization', 'Basic ' + creds)
        .get(baseUrl + '/auth?device_name=Test Phone')
        .expectStatus(200)
        .afterJSON(function(json) {
            jwt = json.access_token;
            postBroadcast();
        })
        .toss();
}

function postBroadcast() {
    frisby.create('Post Broadcast')
        .addHeader('Authorization', 'Bearer ' + jwt)
        .post(baseUrl + '/broadcast/post?title=Test Title&text=Some test text.&expires=86400')
        .expectStatus(200)
        .afterJSON(listBroadcasts)
        .toss();
}

function listBroadcasts() {
    frisby.create('List Broadcasts')
        .addHeader('Authorization', 'Bearer ' + jwt)
        .get(baseUrl + '/broadcast/list')
        .expectStatus(200)
        .inspectJSON()
        .after(remove)
        .toss();
}

function remove() {
    frisby.create('Remove User')
        .addHeader('Authorization', 'Basic ' + creds)
        .post(baseUrl + '/user/delete')
        .expectStatus(200)
        .toss();
}
