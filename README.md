# Deploy
The Ingestor Project


# Requirements (my local environment):
Node.js v9.5.0 </br>
NPM v5.6.0 </br>
Nodemon v1.17.2 </br>
Angular CLI: 1.7.3 </br>
mySql v5.7.21 </br>
TypeScript v2.5 </br>
ts-node v4.1

# Installation
  * Clone project
  * Run <code>npm install</code> to install JS dependencies
  * Run <code>npm run prod</code> to build Angular
  * Make sure ./archive folder has write permissions (it is where .xls file will be uploaded)
  * Create mySql database 'deploy' with user 'deploy' and password 'test' (database configs can be found in server/config.ts)
  * Run <code>nodemon</code>
  
  You should be able to access app through http://localhost:7000 in your browser
