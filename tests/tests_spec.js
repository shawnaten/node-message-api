const frisby = require('frisby');

const baseUrl = 'http://hapi:80';
const goodCreds = new Buffer('taylor.aldus.perrin@maildrop.cc:notTaylor').toString('base64');
const badCreds = new Buffer('taylor.aldus.perrin@maildrop.cc:badPassword').toString('base64');
const baseCreateUrl = baseUrl + '/user/create?first=Taylor&middle=Aldus' + 
    '&last=Perrin&password=notTaylor';
const validCreateUrl = baseCreateUrl + '&email=taylor.aldus.perrin@maildrop.cc';
const invalidCreateUrl = baseCreateUrl + '&email=wrong@maildrop.cc';

var jwt;
var chatId;

createValidUser();
createInvalidUser();

function createValidUser() {
    frisby.create('Create with Valid Bank User')
        .post(validCreateUrl)
        .expectStatus(200)
        .afterJSON(verifyUser)
        .toss();
}

function createInvalidUser() {
    frisby.create('Create with Invalid Bank User')
        .post(invalidCreateUrl)
        .expectStatus(400)
        .expectBodyContains('bank customer not found')
        .toss();   
}

function verifyUser(json) {
    frisby.create('Verify User')
        .post(baseUrl + '/user/verify?token=' + json.token)
        .expectStatus(200)
        .after(createWithExistingUser)
        .after(goodLogin)
        .after(badLogin)
        .toss();
}

function createWithExistingUser(err, res, body) {
    frisby.create('Try Create with Verfied Account')
        .post(validCreateUrl)
        .expectStatus(400)
        .toss();   
}

function goodLogin() {
    frisby.create('Login with Good Creds')
        .addHeader('Authorization', 'Basic ' + goodCreds)
        .post(baseUrl + '/auth/test/login')
        .expectStatus(200)
        .after(getJWT)
        .toss();
}

function badLogin() {
    frisby.create('Login with Bad Creds')
        .addHeader('Authorization', 'Basic ' + badCreds)
        .post(baseUrl + '/auth/test/login')
        .expectStatus(401)
        .toss();
}

function getJWT() {
    frisby.create('Get JWT')
        .addHeader('Authorization', 'Basic ' + goodCreds)
        .get(baseUrl + '/auth?device_name=Phone 1')
        .expectStatus(200)
        .afterJSON(storeJWT)
        .toss();
}

function storeJWT(json) {
    jwt = json.access_token;
    tokenAuth();
    startChat();
}

function tokenAuth() {
    frisby.create('Token Auth with Good Token')
        .addHeader('Authorization', 'Bearer ' + jwt)
        .post(baseUrl + '/auth/test/token')
        .expectStatus(200)
        .toss();
}

function startChat() {
    frisby.create('Start Chat')
        .addHeader('Authorization', 'Bearer ' + jwt)
        .post(baseUrl + '/chat/support/start?topic=Test Topic 1')
        .expectStatus(200)
        .afterJSON(storeChat)
        .toss();
}

function storeChat(json) {
    chatId = json.id;
    listChats1();
}

function listChats1() {
    frisby.create('List Chats 1')
        .addHeader('Authorization', 'Bearer ' + jwt)
        .get(baseUrl + '/chat/support/list')
        .expectStatus(200)
        .expectJSONLength('chats', 1)
        .after(removeChat)
        .toss();
}

function removeChat() {
    frisby.create('Remove Chat')
        .addHeader('Authorization', 'Bearer ' + jwt)
        .post(baseUrl + '/chat/support/remove?id=' + chatId)
        .expectStatus(200)
        .after(listChats2)
        .toss();
}

function listChats2() {
    frisby.create('List Chats 2')
        .addHeader('Authorization', 'Bearer ' + jwt)
        .get(baseUrl + '/chat/support/list')
        .expectStatus(200)
        .expectJSONLength('chats', 0)
        .after(deleteUser) // keep moving this
        .toss();
}

function deleteUser() {
    frisby.create('Delete User')
        .addHeader('Authorization', 'Basic ' + goodCreds)
        .post(baseUrl + '/user/delete')
        .expectStatus(200)
        .toss();
}
