'use strict';
const GoogleAuth = require('google-auth-library');
const config = require('../config');

module.exports = function ()
{
    return new Promise((resolve, reject) =>
    {
        const clientSecret = config.googleDrive.credentials.client_secret;
        const clientId = config.googleDrive.credentials.client_id;
        const redirectUrl = config.googleDrive.credentials.redirect_uris[0];
        const auth = new GoogleAuth();
        const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
        if (!process.env.GOOGLE_DRIVE_ACCESS_TOKEN || !process.env.GOOGLE_DRIVE_REFRESH_TOKEN) {
            reject('ACCESS TOKEN OR REFRESH TOKEN NOT FOUND')
        } else {
            oauth2Client.credentials['access_token'] = process.env.GOOGLE_DRIVE_ACCESS_TOKEN;
            oauth2Client.credentials['token_type'] = process.env.GOOGLE_DRIVE_TOKEN_TYPE;
            oauth2Client.credentials['refresh_token'] = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
            oauth2Client.credentials['expiry_date'] = process.env.GOOGLE_DRIVE_EXPIRY_DATE;
            resolve(oauth2Client);
        }
    });
};
