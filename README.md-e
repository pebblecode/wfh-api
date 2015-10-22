# Wfh node backend
A node implementation of the wfh api

#Development
`npm i && npm i -g nodemon`
start server locally
`npm run dev`

#Endpoints

| path       |  method | payload | details |
|------------|---------|---------|---------|
|   /workers |   GET   |         | get all workers, used by email cron and tv display |
|   /workers |   POST   |   `{"name":"John Snow", "email":"john.snow@pebblecode.com", status:"Sick" }`  | get all workers, used by email cron and tv display |
| /workers   | PUT | `{"email":"john.snow@pebblecode.com", "status":"Holiday"}` | Update status for worker|


#Deployment
- like heroku with git, this is a awsbox image, for more details see: https://github.com/mozilla/awsbox/blob/master/doc/HOW_DO_I.md  and https://github.com/mozilla/awsbox

`git remote add aws 54.75.16.57`

#Remote access to AWSBOX
- more details on awsbox setup and layout: https://github.com/mozilla/awsbox/tree/master/doc
admin
`ssh ec2-user@54.75.16.57`
app user
`ssh app@54.75.16.57`

#environment variables


