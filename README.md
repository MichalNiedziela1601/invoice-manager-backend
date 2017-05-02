# invoice-manager-backend

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


### Getting new token from Google 
 ```
 npm run token
 ```
 After this, please copy url from console to browser and choose account where files will be store. Allow application to get access into
 Google Drive and copy new code into console. Next copy and set environment variables: GOOGLE_DRIVE_ACCESS_TOKEN, GOOGLE_DRIVE_REFRESH_TOKEN,
GOOGLE_DRIVE_TOKEN_TYPE, GOOGLE_DRIVE_EXPIRY_DATE.
