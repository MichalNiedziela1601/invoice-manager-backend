'use strict';
const readLine = require('readline');
const GoogleAuth = require('google-auth-library');
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const credentials = require('../app/config').googleDrive.credentials;

function getNewToken(params)
{
    let authUrl = params.oauth2Client.generateAuthUrl({
        accessType: 'offline',
        scope: params.scopes
    });
    console.log('Authorize this app by visiting this url: \n', authUrl);
    let rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve, reject) =>
    {
        rl.question('Enter the code from that page here: \n', code =>
        {
            rl.close();
            params.oauth2Client.getToken(code, (err, token) =>
            {
                if (err) {
                    reject('Error while trying to retrieve access token', err);
                } else {
                    params.oauth2Client.credentials = token;
                    resolve(params.oauth2Client);
                }
            });
        });
    });
}

let clientSecret = credentials.client_secret;
let clientId = credentials.client_id;
let redirectUrl = credentials.redirect_uris[0];
let auth = new GoogleAuth();
let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
let params = {
    oauth2Client: oauth2Client,
    scopes: SCOPES
};
getNewToken(params)
        .then(oauth2Client =>
        {
            console.log(oauth2Client);
        })
        .catch(err =>
        {
            throw err;
        });

