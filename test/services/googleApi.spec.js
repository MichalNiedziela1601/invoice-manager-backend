'use strict';
const chai = require('chai');
const proxyquire = require('proxyquire');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const config = require('../../app/config');
chai.use(sinonChai);
const credentials = config.googleDrive.credentials;
const env = Object.assign({}, process.env);

const expect = chai.expect;

let OAuth2ClientMock = {
    transporter: {},
    clientId_: credentials.client_id,
    clientSecret_: credentials.client_secret,
    redirectUri_: credentials.redirect_uris[0],
    opts: {},
    credentials: {}
};
let OAuth2Mock = sinon.spy(function ()
{
    return OAuth2ClientMock;
});
function googleMockSpy()
{
    return {
        OAuth2: OAuth2Mock
    }
}
let googleMock = sinon.spy(googleMockSpy);

let api = null;
let googleApi = proxyquire('../../app/services/googleApi', {
    'google-auth-library': googleMock,
    '../config': config
});

describe('googleApi', function ()
{
    after(() =>
    {
        process.env = env;
    });
    describe('get Token', function ()
    {
        describe('when not found access_token', function ()
        {
            before(function ()
            {
                delete process.env.GOOGLE_DRIVE_ACCESS_TOKEN;
                api = googleApi();
            });
            it('should reject ', function ()
            {
                api.catch(error =>
                {
                    expect(error).eql('ACCESS TOKEN OR REFRESH TOKEN NOT FOUND');
                })
            });
        });
        describe('when not found refresh_token', function ()
        {
            before(function ()
            {
                process.env.GOOGLE_DRIVE_ACCESS_TOKEN = 'sdfjksdhfjksduisyfs8df';
                delete process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
                api = googleApi();
            });
            it('should reject ', function ()
            {
                api.catch(error =>
                {
                    expect(error).eql('ACCESS TOKEN OR REFRESH TOKEN NOT FOUND');
                })
            });
        });
        describe('when access_token and refresh_token are set', function ()
        {
            before(function ()
            {
                googleMock.reset();
                OAuth2Mock.reset();
                process.env.GOOGLE_DRIVE_ACCESS_TOKEN = 'sdfkjss89dfys9';
                process.env.GOOGLE_DRIVE_REFRESH_TOKEN = 'sdfdtertreteretert';
                process.env.GOOGLE_DRIVE_TOKEN_TYPE = 'Bearer';
                process.env.GOOGLE_DRIVE_EXPIRY_DATE = 147890909090;
                OAuth2ClientMock.credentials['access_token'] = process.env.GOOGLE_DRIVE_ACCESS_TOKEN;
                OAuth2ClientMock.credentials['refresh_token'] = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
                OAuth2ClientMock.credentials['token_type'] = process.env.GOOGLE_DRIVE_TOKEN_TYPE;
                OAuth2ClientMock.credentials['expiry_date'] = process.env.GOOGLE_DRIVE_EXPIRY_DATE;
                api = googleApi();
            });
            it('should call new GoogleAuth', function ()
            {
                expect(googleMock).callCount(1);
            });
            it('should call OAuth2 client', function ()
            {
                expect(OAuth2Mock).callCount(1);
                expect(OAuth2Mock).calledWith(credentials.client_id, credentials.client_secret, credentials.redirect_uris[0]);
            });
            it('should return token', function ()
            {
                api.then(token =>
                {
                    expect(token).to.deep.equal(OAuth2ClientMock);
                })
            });
        });

    });
});
