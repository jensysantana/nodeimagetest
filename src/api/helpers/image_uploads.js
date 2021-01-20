'use strict'
const multer = require('multer');
const { PUBLIC_PATH } = require('../config/config');
const path = require('path');

const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        req.fileErrorMessage = 'Unsupported file Type';
        cb(new Error(), false);
        // return req
    }
}


const uploadStorage = (folderPath, maxSize) => {
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {

            req.fileErrorMessage = 'Invalid destination file or Invalid file name 1 ';
            cb(null, `${PUBLIC_PATH}${folderPath}`);
        },
        filename: function(req, file, cb) {
            // cb(null, `${file.fileName + '-' + Date.now()}.jpg`);
            const {
                fieldname,
                originalname,
                encoding,
                mimetype
            } = file;
            const splitMimeType = mimetype.split('/').pop();
            const fileNamed = `${Date.now()}.${splitMimeType}`;
            req.fileErrorMessage = 'Invalid destination file or Invalid file name 2';
            cb(null, `${fileNamed}`);
        }
    });

    return multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: maxSize,
        }
    });
}

const fileFilterMiddleware = (destination, maxSize) => {

    return (req, res, next) => {

        return uploadStorage(destination, maxSize).single('image')(req, res, function(err) {

            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                return res.status(415).json({
                    response: {
                        data: null,
                        error: req.fileErrorMessage
                    }
                })
            } else if (err) {
                // An unknown error occurred when uploading.
                return res.status(415).json({
                    response: {
                        data: null,
                        error: req.fileErrorMessage
                    }
                })
            }

            if (typeof req.file.size === 'number' && req.file.size > maxSize) {
                req.fileErrorMessage = null;
                return res.status(415).json({
                    response: {
                        data: null,
                        error: 'File size is too big.'
                    }
                });
            } else {
                console.log('---------req.file---------');
                console.log(req.file);
                console.log('---------req.file---------');
                next();
            }
            // Everything went fine.
        });
    }
}

module.exports = fileFilterMiddleware;