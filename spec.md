# API Specification

The service is running at <http://107.170.11.25/>.

Some endpoints need authorization headers. For each you add an "Authorization" header key and some value. For basic auth the key is "Basic ENCODED_CREDENTIALS" where ENCODED_CREDENTIALS is the base64 encoding string "email:password". For token auth the key is "Bearer TOKEN" where TOKEN is the string returned from the auth endpoint. The auth endpoint should be thought of as authenticating a device for access. Your app should save the token and not require the user to login (make a call to auth) each time. In the examples below curl is used so we do not manually apply the authorization headers. You may have to depending on what tools you use in Android however.

## Create User

POST /user/create?name=NAME&nick=NICK&email=EMAIL&password=PASSWORD

```
curl -w '\n' --request POST 'http://107.170.11.25/user/create?name=Shawn%20Aten&nick=saten&email=shawnmaten@gmail.com&password=1234password'
```

## Verify User

GET /user/verify?token=TOKEN

```
curl -w '\n' 'http://107.170.11.25/user/verify?token=571658430c5cd3bf00290aa4'
```

## Delete User
*Needs basic authorization header.*

POST /user/delete

```
curl -w '\n' -u shawnmaten@gmail.com:1234password --request POST 'http://107.170.11.25/user/delete'
```

## Get Auth Token
*Needs basic authorization header.*

GET /auth?device_name=DEVICE_NAME

```
curl -w '\n' -u shawnmaten@gmail.com:1234password 'http://107.170.11.25/auth?device_name=Test%20Device%201'
```

## Start Chat
*Needs bearer authorization header.*

POST /chat/start?topic=TOPIC

```
curl -w '\n' -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOjE0NjEwODYwMDU2NzUsImV4cCI6MTQ5MjYyMjAwNTY3NSwic3ViIjoiNTcxNjY3MTliNTQ0ZjM0ODAwNTdjZmMzIiwiYXVkIjoiNTcxNjY3MTliNTQ0ZjM0ODAwNTdjZmMzIiwianRpIjoiYmQzZGM1ZGQtYThmNy00NzMwLTkzYWItY2NjM2RjMDhmMjA2IiwiaWF0IjoxNDYxMDg2MDA1fQ.yrncsGnim2sIoQa_cuRECG_jBvrE6cd8W_5aRvHXqAE' --request POST 'http://107.170.11.25/chat/start?topic=Test%20Topic'
```

## Add Person to Chat
*Needs bearer authorization header.*

POST /chat/add?id=ID&email=EMAIL

```
curl -w '\n' -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOjE0NjEwODYwMDU2NzUsImV4cCI6MTQ5MjYyMjAwNTY3NSwic3ViIjoiNTcxNjY3MTliNTQ0ZjM0ODAwNTdjZmMzIiwiYXVkIjoiNTcxNjY3MTliNTQ0ZjM0ODAwNTdjZmMzIiwianRpIjoiYmQzZGM1ZGQtYThmNy00NzMwLTkzYWItY2NjM2RjMDhmMjA2IiwiaWF0IjoxNDYxMDg2MDA1fQ.yrncsGnim2sIoQa_cuRECG_jBvrE6cd8W_5aRvHXqAE' --request POST 'http://107.170.11.25/chat/add?id=3daa3984007aa306&email=shawnmaten%2B2@gmail.com'

## Leave a Chat
*Needs bearer authorization header.*

POST /chat/leave

```
curl -w '\n' -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOjE0NjEwODYwMDU2NzUsImV4cCI6MTQ5MjYyMjAwNTY3NSwic3ViIjoiNTcxNjY3MTliNTQ0ZjM0ODAwNTdjZmMzIiwiYXVkIjoiNTcxNjY3MTliNTQ0ZjM0ODAwNTdjZmMzIiwianRpIjoiYmQzZGM1ZGQtYThmNy00NzMwLTkzYWItY2NjM2RjMDhmMjA2IiwiaWF0IjoxNDYxMDg2MDA1fQ.yrncsGnim2sIoQa_cuRECG_jBvrE6cd8W_5aRvHXqAE' --request POST 'http://107.170.11.25/chat/leave?id=3daa3984007aa306'
```
```

