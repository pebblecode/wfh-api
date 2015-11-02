# Wfh node backend
A node implementation of the wfh api, more details see blogpost: http://pebblecode.com/blog/hack-day-wfh-bot/


#Development && installation
[Install CouchDB](http://couchdb.apache.org/#download) and run.
For a nicer couch db ui install: `npm i -g fauxton` then in a new shell run `fauxton`

`npm i && npm i -g nodemon`
start server locally
`npm run dev`

When NODE_ENV === 'development' connection will be made with localhost couchdb. 

#Configuration
Copy config.template.js > config.js and complete the default fields getEnv('ENV_VAR','DEFAULT_VALUE'),
to get a slack token visit: https://api.slack.com/web


#Endpoints

| path       |  method | payload | details |
|------------|---------|---------|---------|
|   /workers |   GET   |         | get all workers, used by email cron and tv display |
|   /workers |   POST   |   `{"name":"John Snow", "email":"john.snow@pebblecode.com", status:"Sick" }`  | get all workers, used by email cron and tv display |
| /workers   | PUT | `{"email":"john.snow@pebblecode.com", "status":"Holiday"}` | Update status for worker|


#Deployment
- Up to you. we currently use heroku. 
- DB is [couchdb](http://couchdb.apache.org/) and hosted on [Cloudant](https://cloudant.com/) create a database called: `wfh`

#Helpful Links
 - Slack [api](https://api.slack.com/).
