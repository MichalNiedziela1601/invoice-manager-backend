'use strict';
const google = require('googleapis');
const fs = require('fs');
const path = require('path');
function saveFile(auth, name, invoice)
{
    let service = google.drive({version: 'v3', auth: auth});

    return new Promise((resolve, reject) =>
    {
        service.files.create({
            fields: 'id,webViewLink',
            resource: {
                name: name,
                mimeType: 'application/pdf',
                parents: [invoice.googleMonthFolderId]
            },
            media: {
                mimeType: 'application/pdf',
                body: fs.createReadStream(path.join('./app/REST/uploads/', name))
            }
        }, (err, file) =>
        {
            if (err) {
                reject(err);
            } else {
                fs.unlink(path.join('./app/REST/uploads/', name));
                resolve(file);
            }
        });
    })
}

function shareFile(auth, id)
{
    let service = google.drive({version: 'v3', auth: auth});
    return new Promise((resolve, reject) =>
    {
        let userPermission = {
            'type': 'anyone',
            'role': 'reader'
        };
        service.permissions.create({
            resource: userPermission,
            fileId: id
        }, (err, res) =>
        {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

function createFolder(auth, name)
{
    let service = google.drive({version: 'v3', auth: auth});
    return new Promise((resolve, reject) =>
    {
        let fileMetaData = {
            name: name,
            mimeType: 'application/vnd.google-apps.folder'
        };

        service.files.create({
            resource: fileMetaData,
            fields: 'id'
        }, (err, res) =>
        {
            if (err) {
                reject(err);
            } else {
                resolve(res.id);
            }
        })
    })
}

function createChildFolder(auth, name, parent)
{
    let service = google.drive({version: 'v3', auth: auth});
    return new Promise((resolve, reject) =>
    {
        let fileMetaData = {
            name: name,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parent]
        };

        service.files.create({
            resource: fileMetaData,
            fields: 'id'
        }, (err, res) =>
        {
            if (err) {
                reject(err);
            } else {
                resolve(res.id);
            }
        })
    })
}

function checkFolderExists(auth, id)
{
    let service = google.drive({version: 'v3', auth: auth});
    return new Promise((resolve, reject) =>
    {
        service.files.get({
            fileId: id,
            fields: 'name, id'

        }, (err, res) =>
        {
            if (err) {
                reject(err);
            } else {
                resolve(res.id);
            }
        })
    })
}

function findFolderByName(auth, name, parentId)
{
    let service = google.drive({version: 'v3', auth: auth});
    return new Promise((resolve, reject) =>
    {
        service.files.list({
            corpora: 'user',
            q: '"' + parentId + '" in parents and name="' + name + '"',
            spaces: 'drive',
            fields: 'files(id, name)'

        }, (err, res) =>
        {
            if (err) {
                reject(err);
            }
            resolve(res);
        })
    })
}

function deleteFile(auth,invoice){
    let service = google.drive({version: 'v3', auth: auth});
    return new Promise((resolve, reject) =>
    {
        service.files.delete({

            fileId: invoice.fileId
        }, (err, file) =>
        {
            if (err) {
                reject(err);
            } else {
                resolve(file);
            }
        });
    })
}

module.exports = {
    saveFile,
    shareFile,
    createFolder,
    createChildFolder,
    checkFolderExists,
    findFolderByName,
    deleteFile
};
