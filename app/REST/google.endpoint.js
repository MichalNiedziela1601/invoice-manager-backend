'use strict';
const google = require('googleapis');
const oauthToken = require('../services/googleApi');
const fs = require('fs');
const path = require('path');

function saveFile(auth, name)
{
    let service = google.drive({version: 'v3', auth: auth});

    return new Promise((resolve, reject) =>
    {
        service.files.create({
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

module.exports = function (server)
{

    server.route({
        method: 'POST',
        path: '/api/google',
        config: {

            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data'
            },

            handler: function (request, reply)
            {
                let data = request.payload;
                if (data.file) {
                    let name = data.file.hapi.filename;
                    let filepath = path.join(__dirname, '/uploads/', name);
                    let file = fs.createWriteStream(filepath);

                    file.on('error', function (err)
                    {
                        console.error(err)
                    });

                    data.file.pipe(file);

                    data.file.on('end', function (err)
                    {
                        if (err) {
                            throw err;
                        }
                        let ret = {
                            filename: data.file.hapi.filename,
                            headers: data.file.hapi.headers
                        };
                        oauthToken().then(auth =>
                        {
                            saveFile(auth, name).then(response => {
                                console.log('file',response);
                            });
                        }).catch(error =>
                        {
                            reply(error);
                        });

                        reply(JSON.stringify(ret));
                    })
                }

            }
        }
    })
}
