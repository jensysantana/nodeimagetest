'use strict'
const app = require('express')();
const AWS = require('aws-sdk');
const multer = require('multer');
const fileFilterMiddleware = require('../../helpers/image_uploads');
// const uuidv4 = require('uuid');
const { v4: uuidv4 } = require('uuid'); //and  uuidv4();
const fs = require('fs');
// const { ref } = require('yup');
// require('firebase/storage');

const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

// const storage = multer.memoryStorage({
//     destination: function(req, file, callback) {
//         callback(null, '');
//     }
// });
// const upload = multer({ storage }).single('image');
// const upload = fileFilterMiddleware('public\\assets\\images\\temp\\', 1024 * 1024 * 5);
// const upload = fileFilterMiddleware('', 1024 * 1024 * 5);

app.post('/', [fileFilterMiddleware('public/assets/images/temp/', 1024 * 1024 * 5)], async(req, res) => {


    /*
        <!-- The core Firebase JS SDK is always required and must be listed first -->
        <script src="https://www.gstatic.com/firebasejs/8.2.3/firebase-app.js"></script>
        <!-- TODO: Add SDKs for Firebase products that you want to use
            https://firebase.google.com/docs/web/setup#available-libraries -->
        <script src="https://www.gstatic.com/firebasejs/8.2.3/firebase-analytics.js"></script>
        const firebaseConfig = {
            apiKey: "AIzaSyAsE-ptOy91bAu3UZSYWoBFYeQ3qJR31uA",
            authDomain: "claford-d31eb.firebaseapp.com",
            projectId: "claford-d31eb",
            storageBucket: "claford-d31eb.appspot.com",
            messagingSenderId: "963313498796",
            appId: "1:963313498796:web:9836003518748565dd7d09",
            measurementId: "G-NMF5EQGW5M"
        };
        service firebase.storage {
            match /b/{bucket}/o {
                match /{allPaths=**} {
                allow read, write: if request.auth != null;
                }
            }
        }
    */

    const storage = new Storage({
        keyFilename: '../serverkey.js',
    });

    let bucketName = 'claford-d31eb';

    let filename = 'test.txt';

    // Testing out upload of file

    await storage.bucket(bucketName).upload(filename, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        // By setting the option `destination`, you can change the name of the
        // object you are uploading to a bucket.
        metadata: {
            // Enable long-lived HTTP caching headers
            // Use only if the contents of the file will never change
            // (If the contents will change, use cacheControl: 'no-cache')
            cacheControl: 'public, max-age=31536000',
        },
    });
    console.log(`${filename} uploaded to ${bucketName}.`);



    return res.status(200).json({
        response: {
            data: null,
            error: 'res.image jensy OK'
        },
    });



});

module.exports = app;