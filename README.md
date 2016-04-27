# Node Messaging API
*For independent study project with Dr. Jianwei Niu at UTSA.*

*For students of Dr. Niu's Software Engineering course.*  
The API specification and example curl commands are in the file spec.md. An example Android project is in the folder android_sample. To integrate with an existing Android project:
- copy over all the files in the models package
- copy over AuthHeaders.java and MessagingService.java
- add the 2 retrofit libraries in app/build.gradle
- the service is setup and in the activity and fragment classes, you'll need to pull lines of code from there as needed
- I've commented LOOK HERE near the key pieces

The sample project has all the endpoints setup to use but doesn't utilize all of them. It demonstrates account creation and authenticating / login.
