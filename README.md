# Node Messaging API

This project was developed for an independent study course with Dr. Jianwei Niu at UTSA. It's a (very) simple RESTful API for a mock bank customer service system. It's built using Node, Hapi, and MongoDB. It's setup for Docker and Docker Compose. It was used for one of Dr. Niu's SE courses where students connected to it from an Android app. [Sample code](/android_sample) for the Android app is also available. The endpoints are documented [here](/spec.md). An earlier version of this project is available [here][v1-repo].

## Features
- Account creation and login
- Auth using JWT
- Send messages between any user

## For Dr. Niu's Software Engineering Course Students
The API specification and example curl commands are in the file spec.md. An example Android project is in the folder android_sample. To integrate with an existing Android project:
- Copy over all the files in the models package
- Copy over AuthHeaders.java and MessagingService.java
- Add the 2 retrofit libraries in app/build.gradle
- The service is setup and in the activity and fragment classes, you'll need to pull lines of code from there as needed
- I've commented LOOK HERE near the key pieces

The sample project has all the endpoints setup to use but doesn't utilize all of them. It demonstrates account creation and authenticating / login.

[v1-repo]: https://github.com/shawnmaten/node-bank-ticket-api
