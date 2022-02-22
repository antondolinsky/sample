You can access this sample project at:

https://dev1841.dactvo485wng3.amplifyapp.com/

The project runs entirely on AWS, using the following services:

1. IAM
2. DynamoDB
3. Lambda
4. API Gateway
5. Amplify

The Lambda runs Go code that communicates with DynamoDB.
The front end, deployed through Amplify, runs ReactJS.

**Note**: The admin password is 'admin'.

TODO:

If I had more time, I would add the following features:

1. Store photos in an S3 bucket so that there is no practical file size restriction (the current code stores them in DynamoDB, which restricts a record to about 400 KB).
2. Add validation of new records.
3. Store admin password in cookies.
4. RESTify the back end routes more.
