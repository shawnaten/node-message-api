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
*Needs Basic authorization header.*

POST /user/delete

```
curl -w '\n' -u shawnmaten@gmail.com:1234password --request POST 'http://107.170.11.25/user/delete'
```


