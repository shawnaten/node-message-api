const frisby = require('frisby');

const baseUrl = 'http://hapi:80';
const creds = new Buffer('taylor.francis.butt@maildrop.cc:notTaylor').toString('base64');
const createUrl = '/user/create?first=Taylor&middle=Francis&last=Butt&password=notTaylor&email=taylor.francis.butt@maildrop.cc';

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
            startChat();
        })
        .toss();
}

function startChat() {
    frisby.create('Start Chat')
        .addHeader('Authorization', 'Bearer ' + jwt)
        .post(baseUrl + '/chat/support/start?topic=Test Topic')
        .expectStatus(200)
        .afterJSON(function(json) {
            chatId = json.id;
            postMessage();
        })
        .toss();
}

function postMessage() {
    frisby.create('Post Message')
        .addHeader('Authorization', 'Bearer ' + jwt)
        .post(baseUrl + '/message/post?id=' + chatId + '&text=A test message.')
        .expectStatus(200)
        .after(listMessages)
        .toss();
}

function listMessages() {
    frisby.create('List Messages')
        .addHeader('Authorization', 'Bearer ' + jwt)
        .get(baseUrl + '/message/list?id=' + chatId)
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
