'use strict';
module.exports = {
    db: {
        user: 'invoice_manager',
        password: 'invoice-zaq1@WSX',
        database: 'invoice_manager',
        port: 5432,
        host: 'localhost'
    },
    port: process.env.PORT || 3000,
    secret: process.env.SECRET_JWT || 'zaq!@wsxCDE#',
    googleDrive: {
        credentials: {
            'client_id': process.env.GOOGLE_DRIVE_CLIENT_ID || '282763231357-17qupkomnva4aba5gl2i9glres64au0m.apps.googleusercontent.com',
            'project_id': process.env.GOOGLE_DRIVE_PROJECT_ID || 'invoice-manager-161314',
            'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
            'token_uri': 'https://accounts.google.com/o/oauth2/token',
            'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
            'client_secret': process.env.GOOGLE_DRIVE_CLIENT_SECRET || 'AcDs8Ziw0htVaoeC-8a9tijV',
            'redirect_uris': [
                'urn:ietf:wg:oauth:2.0:oob',
                'http://localhost'
            ]
        }
    }
};
