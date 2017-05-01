# Node Messaging API

This is a project developed for an independent study course with Dr. Jianwei Niu at UTSA. It's version 2 of a simple RESTful API, version 1 is [here](https://github.com/shawnmaten/node-bank-ticket-api). This version was setup as a more general messaging service. It was used for one of Dr. Niu's other courses where students connected to it from an Android app, [sample code](/android_sample) for which is also in this repo. The API Spec is available [here](/spec.md).

## Features
- Account creation and login
- Auth using JWT
- Message between any user

## Dr. Niu's Software Engineering Course Students
The API specification and example curl commands are in the file spec.md. An example Android project is in the folder android_sample. To integrate with an existing Android project:
- copy over all the files in the models package
- copy over AuthHeaders.java and MessagingService.java
- add the 2 retrofit libraries in app/build.gradle
- the service is setup and in the activity and fragment classes, you'll need to pull lines of code from there as needed
- I've commented LOOK HERE near the key pieces

The sample project has all the endpoints setup to use but doesn't utilize all of them. It demonstrates account creation and authenticating / login.
