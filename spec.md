# API Specification

The service is running at <http://107.170.11.25/>.

Some endpoints need authorization headers. For each you add an "Authorization" header key and some value. For basic auth the key is "Basic ENCODED_CREDENTIALS" where ENCODED_CREDENTIALS is the base64 encoding string "email:password". For token auth the key is "Bearer TOKEN" where TOKEN is the string returned from the auth endpoint. The auth endpoint should be thought of as authenticating a device for access. Your app should save the token and not require the user to login (make a call to auth) each time. In the examples below curl is used so we do not manually apply the authorization headers. You may have to depending on what tools you use in Android however.

```
BASE_URL='http://107.170.11.25'
NAME_1='First_Person'
NICK_1='fperson'
EMAIL_1='first.person@maildrop.cc'
NAME_2='Second_Person'
NICK_2='sperson'
EMAIL_2='second.person@maildrop.cc'
PASSWORD='1234password'
DEVICE_NAME='Test_Device'
TOPIC='Test_Topic'
```

## Create User

POST /user/create?name=NAME&nick=NICK&email=EMAIL&password=PASSWORD

```
# Create 2 accounts

curl -X POST "$BASE_URL/user/create?name=$NAME_1&nick=$NICK_1&email=$EMAIL_1&password=$PASSWORD"

curl -X POST "$BASE_URL/user/create?name=$NAME_2&nick=$NICK_2&email=$EMAIL_2&password=$PASSWORD"
```

## Verify User

GET /user/verify?token=TOKEN

## Delete User
*Needs basic authorization header.*

POST /user/delete

```
curl -u $EMAIL_1:$PASSWORD -X POST "$BASE_URL/user/delete"
```

## Get Auth Token
*Needs basic authorization header.*

GET /auth?device_name=DEVICE_NAME

```
# Save access token for first account

ACCESS_TOKEN_1=`curl -u $EMAIL_1:$PASSWORD "$BASE_URL/auth?device_name=$DEVICE_NAME" | perl -pe 's/{"access_token":"(.+)"}/$1/'`

ACCESS_TOKEN_2=`curl -u $EMAIL_2:$PASSWORD "$BASE_URL/auth?device_name=$DEVICE_NAME" | perl -pe 's/{"access_token":"(.+)"}/$1/'`
```

## Start Chat
*Needs bearer authorization header.*

POST /chat/start?topic=TOPIC

```
CHAT_ID=`curl -H "Authorization: Bearer $ACCESS_TOKEN_1" -X POST "$BASE_URL/chat/start?topic=$TOPIC" | perl -pe 's/{"id":"(.+)"}/$1/'`
```

## Add Person to Chat
*Needs bearer authorization header.*

POST /chat/add?id=ID&email=EMAIL

```
curl -H "Authorization: Bearer $ACCESS_TOKEN_1" -X POST "$BASE_URL/chat/add?id=$CHAT_ID&email=$EMAIL_2"
```

## Leave a Chat
*Needs bearer authorization header.*

POST /chat/leave

```
curl -H "Authorization: Bearer $ACCESS_TOKEN_2" -X POST "$BASE_URL/chat/leave?id=$CHAT_ID"
```
