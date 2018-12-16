'use strict';

const path = require('path');

const multer = require('multer');

// Multer upload config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'images', 'anuncios'));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
    }
})

module.exports = multer({ storage: storage });