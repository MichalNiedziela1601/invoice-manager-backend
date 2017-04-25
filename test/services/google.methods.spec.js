'use strict';
const chai = require('chai');
const proxyquire = require('proxyquire');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
chai.use(sinonChai);

const expect = chai.expect;
let filesCreateFunc = sinon.spy();
let permissionsCreateFun = sinon.spy();
let filesGetFunc = sinon.spy();
let filesListFunc = sinon.spy();
let googleMock = {
    drive: sinon.stub()
};
let errorMock = {
    error: true
};

let pathMock = {
    join: sinon.stub().returns('./app/REST/uploads/filename')
};

let fsMock = {
    createReadStream: sinon.stub().returns(pathMock.join()),
    unlink: sinon.stub().returns(pathMock.join)
};

let googleMethodsMock = proxyquire('../../app/services/google.methods', {
    'googleapis': googleMock,
    'fs': fsMock,
    'path': pathMock
});

googleMethodsMock.catch = sinon.stub();

function callbackErrorFiles()
{
    filesCreateFunc = function (obj, callback)
    {
        callback(errorMock);
    };
    googleMock.drive.returns({
        files: {create: filesCreateFunc}
    })
}

function callbackSuccessFiles()
{
    filesCreateFunc = function (obj, callback)
    {
        callback(0, {res: true});
    };
    googleMock.drive.returns({
        files: {create: filesCreateFunc}
    });
}

describe('Google Methods', function ()
{
    describe('saveFile', function ()
    {
        let invoice = {
            googleMonthFolderId: 'fhg89yert8'
        };
        before(function ()
        {
            googleMock.drive.returns(
                    {
                        files: {create: filesCreateFunc}
                    }
            );
            googleMethodsMock.saveFile('auth', 'filename', invoice);
        });
        it('should call google.drive', function ()
        {
            expect(googleMock.drive).callCount(1);
            expect(googleMock.drive).calledWith({version: 'v3', auth: 'auth'})
        });
        it('should call files.create', function ()
        {

            expect(filesCreateFunc).callCount(1);
            expect(filesCreateFunc).calledWith(
                    {
                        fields: 'id,webViewLink',
                        resource: {
                            name: 'filename',
                            mimeType: 'application/pdf',
                            parents: [invoice.googleMonthFolderId]
                        },
                        media: {
                            mimeType: 'application/pdf',
                            body: './app/REST/uploads/filename'
                        }
                    }, sinon.match.func
            )
        });
        describe('when call callback', function ()
        {
            describe('when callback returns error', function ()
            {
                before(function ()
                {
                    filesCreateFunc = function (obj, callback)
                    {
                        callback(errorMock);
                    };
                    googleMock.drive.returns(
                            {
                                files: {create: filesCreateFunc}
                            }
                    );

                });
                it('should reject', function ()
                {
                    return googleMethodsMock.saveFile('auth', 'filename', invoice).catch(error =>
                    {
                        expect(error).to.be.eql(errorMock);
                    });
                });
            });
            describe('when callback not return error', function ()
            {
                before(function ()
                {
                    filesCreateFunc = function (obj, callback)
                    {
                        callback(0, {file: true});
                    };
                    googleMock.drive.returns(
                            {
                                files: {create: filesCreateFunc}
                            }
                    );

                });
                it('should call unlink', function ()
                {
                    return googleMethodsMock.saveFile('auth', 'filename', invoice).then(file =>
                    {
                        expect(fsMock.unlink).callCount(1);
                        expect(file).to.be.eql({file: true});
                    });

                });
            });
        });

    });

    describe('shareFile', function ()
    {
        let id = 'sdufiasf67';
        before(function ()
        {
            googleMock.drive = sinon.stub();
            googleMock.drive.returns(
                    {
                        permissions: {create: permissionsCreateFun}
                    }
            );
            googleMethodsMock.shareFile('auth', id);
        });
        it('should call google drive', function ()
        {
            expect(googleMock.drive).callCount(1);
            expect(googleMock.drive).calledWith({version: 'v3', auth: 'auth'});
        });
        it('should call permission.create', function ()
        {
            expect(permissionsCreateFun).callCount(1);
            expect(permissionsCreateFun).calledWith({
                resource: {
                    'type': 'anyone',
                    'role': 'reader'
                },
                fileId: id
            }, sinon.match.func);
        });
        describe('when call callback', function ()
        {
            describe('when callback returns error', function ()
            {
                before(function ()
                {
                    permissionsCreateFun = function (obj, callback)
                    {
                        callback(errorMock);
                    };
                    googleMock.drive.returns(
                            {
                                permissions: {create: permissionsCreateFun}
                            }
                    );

                });
                it('should reject', function ()
                {
                    return googleMethodsMock.shareFile('auth', 'filename').catch(error =>
                    {
                        expect(error).to.be.eql(errorMock);
                    });
                });
            });
            describe('when callback not return error', function ()
            {
                before(function ()
                {
                    permissionsCreateFun = function (obj, callback)
                    {
                        callback(0, {res: true});
                    };
                    googleMock.drive.returns(
                            {
                                permissions: {create: permissionsCreateFun}
                            }
                    );

                });
                it('should call unlink', function ()
                {
                    return googleMethodsMock.shareFile('auth', 'filename').then(res =>
                    {
                        expect(res).to.be.eql({res: true});
                    });

                });
            });
        });
    });

    describe('createFolder', function ()
    {
        before(function ()
        {
            googleMock.drive = sinon.stub();
            filesCreateFunc = sinon.spy();
            googleMock.drive.returns(
                    {
                        files: {create: filesCreateFunc}
                    }
            );

            googleMethodsMock.createFolder('auth', 'Firma');
        });
        it('should call google drive', function ()
        {
            expect(googleMock.drive).callCount(1);
            expect(googleMock.drive).calledWith({version: 'v3', auth: 'auth'});
        });
        it('should call files.create', function ()
        {
            expect(filesCreateFunc).callCount(1);
            expect(filesCreateFunc).calledWith({
                resource: {
                    name: 'Firma',
                    mimeType: 'application/vnd.google-apps.folder'
                },
                fields: 'id'
            }, sinon.match.func);
        });
        describe('when call callback', function ()
        {
            describe('when callback returns error', function ()
            {
                before(function ()
                {
                    callbackErrorFiles();
                });
                it('should reject error', function ()
                {
                    googleMethodsMock.createFolder('auth', 'FIrma').catch(error =>
                    {
                        expect(error).eql(errorMock);
                    })
                });
            });
            describe('when callback not return error', function ()
            {
                before(function ()
                {
                    callbackSuccessFiles();
                });

                it('should resolve result', function ()
                {
                    googleMethodsMock.createFolder('auth', 'iushsd89f').then(result =>
                    {
                        expect(result).eql({res: true});
                    })
                });

            });
        });
    });

    describe('createChildFolder', function ()
    {
        let parent = 'jskdhf8sd7f';
        before(function ()
        {
            googleMock.drive = sinon.stub();
            filesCreateFunc = sinon.spy();
            googleMock.drive.returns(
                    {
                        files: {create: filesCreateFunc}
                    }
            );

            googleMethodsMock.createChildFolder('auth', 'April', parent);
        });
        it('should call google drive', function ()
        {
            expect(googleMock.drive).callCount(1);
            expect(googleMock.drive).calledWith({version: 'v3', auth: 'auth'});
        });
        it('should call files.create', function ()
        {
            expect(filesCreateFunc).callCount(1);
            expect(filesCreateFunc).calledWith({
                resource: {
                    name: 'April',
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [parent]
                },
                fields: 'id'
            }, sinon.match.func);
        });
        describe('when call callback', function ()
        {
            describe('when callback returns error', function ()
            {
                before(function ()
                {
                    callbackErrorFiles();
                });
                it('should reject error', function ()
                {
                    googleMethodsMock.createChildFolder('auth', 'FIrma', 'sdfsdf').catch(error =>
                    {
                        expect(error).eql(errorMock);
                    })
                });
            });
            describe('when callback not return error', function ()
            {
                before(function ()
                {
                    callbackSuccessFiles();
                });

                it('should resolve result', function ()
                {
                    googleMethodsMock.createChildFolder('auth', 'iushsd89f', 'sdfhsd87').then(result =>
                    {
                        expect(result).eql({res: true});
                    })
                });
            });
        });
    });

    describe('checkFolderExists', function ()
    {
        let id = 'sjdfs7df9sf';
        before(function ()
        {
            googleMock.drive = sinon.stub();
            googleMock.drive.returns(
                    {
                        files: {get: filesGetFunc}
                    }
            );
            googleMethodsMock.checkFolderExists('auth', id);
        });
        it('should call google.drive', function ()
        {
            expect(googleMock.drive).callCount(1);
            expect(googleMock.drive).calledWith({version: 'v3', auth: 'auth'})
        });
        it('should call files.get', function ()
        {
            expect(filesGetFunc).callCount(1);
            expect(filesGetFunc).calledWith(
                    {
                        fileId: id,
                        fields: 'name, id',
                    }, sinon.match.func
            )
        });
        describe('when call callback', function ()
        {
            describe('when callback returns error', function ()
            {
                before(function ()
                {
                    filesGetFunc = function (obj, callback)
                    {
                        callback(errorMock);
                    };
                    googleMock.drive.returns(
                            {
                                files: {get: filesGetFunc}
                            }
                    );

                });
                it('should reject', function ()
                {
                    return googleMethodsMock.checkFolderExists('auth', id).catch(error =>
                    {
                        expect(error).to.be.eql(errorMock);
                    });
                });
            });
            describe('when callback not return error', function ()
            {
                let fileMock = {id: id, name: 'blabla'};
                before(function ()
                {
                    filesGetFunc = function (obj, callback)
                    {
                        callback(0, fileMock);
                    };
                    googleMock.drive.returns(
                            {
                                files: {get: filesGetFunc}
                            }
                    );

                });
                it('should resolve', function ()
                {
                    return googleMethodsMock.checkFolderExists('auth', id).then(file =>
                    {
                        expect(file).to.be.eql(fileMock.id);
                    });

                });
            });
        });

    });

    describe('findFolderByName', function ()
    {
        let name = 'April';
        let parentId = 'sjdhfsgs9879f9ss';
        before(function(){
            googleMock.drive = sinon.stub();
            googleMock.drive.returns(
                    {
                        files: {list: filesListFunc}
                    }
            );
            googleMethodsMock.findFolderByName('auth',name,parentId);
        });
        it('should call google.drive', function ()
        {
            expect(googleMock.drive).callCount(1);
            expect(googleMock.drive).calledWith({version: 'v3', auth: 'auth'})
        });
        it('should call files.list', function ()
        {
            expect(filesListFunc).callCount(1);
            expect(filesListFunc).calledWith(
                    {
                        corpora: 'user',
                        q: '"' + parentId + '" in parents and name="' + name + '"',
                        spaces: 'drive',
                        fields: 'files(id, name)'
                    }, sinon.match.func
            );
        });
        describe('when call callback', function ()
        {
            describe('when callback returns error', function ()
            {
                before(function ()
                {
                    filesListFunc = function (obj, callback)
                    {
                        callback(errorMock);
                    };
                    googleMock.drive.returns(
                            {
                                files: {list: filesListFunc}
                            }
                    );

                });
                it('should reject', function ()
                {
                    return googleMethodsMock.findFolderByName('auth',name,parentId).catch(error =>
                    {
                        expect(error).to.be.eql(errorMock);
                    });
                });
            });
            describe('when callback not return error', function ()
            {
                let fileMock = {files: [{id: 'sdfhsjfs', name: 'blabla'}]};
                before(function ()
                {
                    filesListFunc = function (obj, callback)
                    {
                        callback(0, fileMock);
                    };
                    googleMock.drive.returns(
                            {
                                files: {list: filesListFunc}
                            }
                    );

                });
                it('should resolve', function ()
                {
                    return googleMethodsMock.findFolderByName('auth',name,parentId).then(file =>
                    {
                        expect(file).to.be.eql(fileMock);
                    });

                });
            });
        });

    });

});
