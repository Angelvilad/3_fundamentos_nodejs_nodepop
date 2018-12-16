'use strict';

// Servicio de creación de thumbnail
const path = require('path');

const cote = require('cote');
const jimp = require('jimp');


const thumbnailResponder = new cote.Responder({ name: 'Servicio de creación de thumbnail' });

thumbnailResponder.on('create thumbnail', (req, done) => {
    console.log('servicio: petición de', req, Date.now());
    const newFileName = `thumbnail-${req.fileName}`;

    jimp.read(path.join(req.path, req.fileName))
        .then(async image => {
                await image
                .resize(100, 100)
                .quality(50)
                .writeAsync(path.join(req.path, newFileName));
                
                console.log('servicio: thumbnail creado con exito', Date.now());
                done({ succes: true, fileName: newFileName });                
        })
        .catch(err => {
            console.error(err);
            done({ success: false, errMessage: err.message });
        })
});