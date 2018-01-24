# invoice-manager-backend
### Before start: 

ENVIRONMENTS in application should be set before first start: 
* PORT - port number of sockets - default: 3000
* SECRET_JWT - secret string to secure JWT
* GOOGLE_DRIVE_CLIENT_ID - ID of client google api
* GOOGLE_DRIVE_PROJECT_ID - ID of project google api
* GOOGLE_DRIVE_CLIENT_SECRET - secret password to auth client
* GOOGLE_DRIVE_ACCESS_TOKEN - access token to your Google Drive
* GOOGLE_DRIVE_REFRESH_TOKEN - refresh token to your Google Drive
* GOOGLE_DRIVE_TOKEN_TYPE - token type - default 'Bearer'
* GOOGLE_DRIVE_EXPIRY_DATE - expiry date of token

Set email and password in seed/sql/seed.sql in insert data to user table. Password must be a bcrypt hash

### Getting new token from Google on first start
 ```
 GOOGLE_DRIVE_CLIENT_ID=your_client_id GOOGLE_DRIVE_PROJECT_ID=your_project_id GOOGLE_DRIVE_CLIENT_SECRET=your_secret npm run token
 ```
 After this, please copy url from console to browser and choose account where files will be store. Allow application to get access into
 Google Drive and copy new code into console. Next copy and set environment variables: GOOGLE_DRIVE_ACCESS_TOKEN, GOOGLE_DRIVE_REFRESH_TOKEN,
GOOGLE_DRIVE_TOKEN_TYPE, GOOGLE_DRIVE_EXPIRY_DATE.



### Run database 
```
docker-compose up
```

### Install dependencies
```
npm install
```
### Run seed 
```
npm run seed
```

### Run server 
```
npm start
```



### Run eslint task
```
grunt lint
```

### Run test
```
npm test
```

