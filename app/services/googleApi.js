'use strict';
const path = require('path');
const fs = require('fs');
const readLine = require('readline');
const GoogleAuth = require('google-auth-library');
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const SECRET_FILE = path.join(__dirname, 'client_invoice_secret.json');
const TOKEN_FILE = 'drive-nodejs-quickstart.json';

function getClientSecretFile(clientSecretFile)
{
    return new Promise((resolve, reject) =>
    {
        fs.readFile(clientSecretFile, (err, result) =>
        {
            if (err) {
                return reject('Error loading client secret file => ' + err);
            }
            resolve(JSON.parse(result))
        })
    })
}

function getToken(oauth2Client, scopes, tokenFileName)
{
    return new Promise((resolve, reject) =>
    {
        fs.readFile(TOKEN_DIR + tokenFileName, (err, token) =>
        {
            if (err) {
                console.log('Need to get new token');
                let params = {
                    oauth2Client: oauth2Client,
                    scopes: scopes,
                    tokenFileName: tokenFileName
                };
                reject(params);
            } else {
                oauth2Client.credentials = JSON.parse(token);
                resolve(oauth2Client);
            }
        })
    })
}

function storeToken(token, tokenFileName)
{
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_DIR + tokenFileName, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_DIR + tokenFileName);
}

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
                    storeToken(token, params.tokenFileName);
                    resolve(params.oauth2Client);
                }
            });
        });
    });
}


module.exports = function ()
{
    return getClientSecretFile(SECRET_FILE).then(credentials =>
    {
        console.log('Get client secret file from local');
        const clientSecret = credentials.installed.clientSecret;
        const clientId = credentials.installed.clientId;
        const redirectUrl = credentials.installed.redirectUris[0];
        const auth = new GoogleAuth();
        const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
        return getToken(oauth2Client, SCOPES, TOKEN_FILE);
    })
            .then(null, params =>
            {
                return getNewToken(params);
            })
            .then(oauth2Client =>
            {
                return oauth2Client;
            })
            .catch(err =>
            {
                throw err;
            })

};
