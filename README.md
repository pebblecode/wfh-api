# Wfh node backend
A node implementation of the wfh api


#Development
Install CouchDB:
http://couchdb.apache.org/#download

`npm i && npm i -g nodemon`
start server locally
`npm run dev`

When NODE_ENV === 'development' connection will be made with localhost couchdb. 

#Endpoints

| path       |  method | payload | details |
|------------|---------|---------|---------|
|   /workers |   GET   |         | get all workers, used by email cron and tv display |
|   /workers |   POST   |   `{"name":"John Snow", "email":"john.snow@pebblecode.com", status:"Sick" }`  | get all workers, used by email cron and tv display |
| /workers   | PUT | `{"email":"john.snow@pebblecode.com", "status":"Holiday"}` | Update status for worker|


#Deployment
- is done via git push like heroku, this is a awsbox image, for more details see: https://github.com/mozilla/awsbox/blob/master/doc/HOW_DO_I.md  and https://github.com/mozilla/awsbox

`git remote add aws 46.51.183.129`

#Remote access to AWSBOX
- more details on awsbox setup and layout: https://github.com/mozilla/awsbox/tree/master/doc
admin
`ssh ec2-user@46.51.183.129`
app user
`ssh app@46.51.183.129`

#environment variables
on remote server
/users/app/config.json

