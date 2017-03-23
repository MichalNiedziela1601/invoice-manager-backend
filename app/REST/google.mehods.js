const google = require('googleapis');
const fs = require('fs');
const path = require('path');
function saveFile(auth, name)
{
    let service = google.drive({version: 'v3', auth: auth});

    return new Promise((resolve, reject) =>
    {
        service.files.create({
            fields: 'id,webViewLink',
            resource: {
                name: name,
                mimeType: 'application/pdf'
            },
            media: {
                mimeType: 'application/pdf',
                body: fs.createReadStream(path.join(__dirname, '/uploads/', name))
            }
        }, (err, file) =>
        {
            if (err) {
                reject(err);
            } else {
                fs.unlink(path.join(__dirname, '/uploads/', name));
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

module.exports = {
    saveFile,
    shareFile
};
