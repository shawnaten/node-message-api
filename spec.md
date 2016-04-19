## Create User

POST /user/create?name=NAME&nick=NICK&email=EMAIL&password=PASSWORD

```
curl --request POST 'http://107.170.11.25/user/create?name=Shawn%20Aten@gmail.com&password=1234password'
```

## Verify User

POST /user/verify?token=TOKEN

```
curl 'http://107.170.11.25/user/verify?token=571658430c5cd3bf00290aa4'
```

## Delete User
