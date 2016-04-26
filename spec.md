# API Specification

The service is running at <http://104.131.115.246/>.

Some endpoints need authorization headers. For each you add an "Authorization" header key and some value. For basic auth the key is "Basic ENCODED_CREDENTIALS" where ENCODED_CREDENTIALS is the base64 encoding string "email:password". For token auth the key is "Bearer TOKEN" where TOKEN is the string returned from the auth endpoint. The auth endpoint should be thought of as authenticating a device for access. Your app should save the token and not require the user to login (make a call to auth) each time. In the examples below curl is used so we do not manually apply the authorization headers. You may have to depending on what tools you use in Android however.

```
# Copy and paste these into the terminal first
# Replace the values with whatever you like
# Emails can be accessed at https://maildrop.cc/

BASE_URL='http://104.131.115.246'
NAME_1='First_Person'do
NICK_1='fperson'
EMAIL_1='first.person@maildrop.cc'
NAME_2='Second_Person'
NICK_2='sperson'
EMAIL_2='second.person@maildrop.cc'
PASSWORD='1234password'
DEVICE_NAME='Test_Device'
TOPIC='Test_Topic'
MESSAGE='Test_Message'
KEY='NOT_A_REAL_KEY'
```

# User Endpoints

## Create User

POST /user/create?name=NAME&nick=NICK&email=EMAIL&password=PASSWORD

```
# Create 2 accounts

curl -X POST "$BASE_URL/user/create?name=$NAME_1&nick=$NICK_1&email=$EMAIL_1&password=$PASSWORD"

curl -X POST "$BASE_URL/user/create?name=$NAME_2&nick=$NICK_2&email=$EMAIL_2&password=$PASSWORD"
```

## Verify User
*The link will be provided in the email.*

GET /user/verify?token=TOKEN

## Delete User
*Needs basic authorization header.*

POST /user/delete

```
# Delete both users

curl -u $EMAIL_1:$PASSWORD -X POST "$BASE_URL/user/delete"

curl -u $EMAIL__2:$PASSWORD -X POST "$BASE_URL/user/delete"
```

# Auth Endpoints
*All of these need basic authorization header.*

## Get Auth Token

GET /auth?device_name=DEVICE_NAME

```
# Save access token for first account

ACCESS_TOKEN_1=`curl -u $EMAIL_1:$PASSWORD "$BASE_URL/auth?device_name=$DEVICE_NAME" | perl -pe 's/{"access_token":"(.+)"}/$1/'`

ACCESS_TOKEN_2=`curl -u $EMAIL_2:$PASSWORD "$BASE_URL/auth?device_name=$DEVICE_NAME" | perl -pe 's/{"access_token":"(.+)"}/$1/'`
```

# Direct Message Endpoints
*All of these need bearer authorization header.*

## Send Message
POST /message/send?email=EMAIL&text=TEXT

```
curl -H "Authorization: Bearer $ACCESS_TOKEN_1" -X POST "$BASE_URL/message/send?email=$EMAIL_2&text=$MESSAGE"
```

## List Messages
GET /message/list

```
curl -H "Authorization: Bearer $ACCESS_TOKEN_1" "$BASE_URL/message/list"
```

## Upload Public Key
POST /message/key?key=KEY

```
curl -H "Authorization: Bearer $ACCESS_TOKEN_1" -X POST "$BASE_URL/message/key?key=$KEY"

curl -H "Authorization: Bearer $ACCESS_TOKEN_2" -X POST "$BASE_URL/message/key?key=$KEY"
```

## Get Public Key for user
GET /message/key?email=email

```
curl -H "Authorization: Bearer $ACCESS_TOKEN_1" "$BASE_URL/message/key?email=$EMAIL_2"
```

# Chat Endpoints
*All of these need bearer authorization header.*

## Start Chat

POST /chat/start?topic=TOPIC

```
CHAT_ID=`curl -H "Authorization: Bearer $ACCESS_TOKEN_1" -X POST "$BASE_URL/chat/start?topic=$TOPIC" | perl -pe 's/{"id":"(.+)"}/$1/'`
```

## List Chats
GET /chat/list

```
curl -H "Authorization: Bearer $ACCESS_TOKEN_1" "$BASE_URL/chat/list"
```

## Add Person to Chat

POST /chat/add?id=ID&email=EMAIL

```
curl -H "Authorization: Bearer $ACCESS_TOKEN_1" -X POST "$BASE_URL/chat/add?id=$CHAT_ID&email=$EMAIL_2"
```

## Leave a Chat
*Chats are deleted when the last person leaves the chat.*

POST /chat/leave

```
curl -H "Authorization: Bearer $ACCESS_TOKEN_2" -X POST "$BASE_URL/chat/leave?id=$CHAT_ID"
```
