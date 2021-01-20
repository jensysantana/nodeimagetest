'use strict'
const app = require('express')();
// const AWS = require('aws-sdk');
// const multer = require('multer');
const fileFilterMiddleware = require('../../helpers/image_uploads');
// const { v4: uuidv4 } = require('uuid'); //and  uuidv4();
// const fs = require('fs');

// const s3 = new AWS.S3({
//     credentials: {
//         accessKeyId: process.env.WS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.SECRET_ACCESS_KEY
//     }
// });
// const storage = multer.memoryStorage({
//     destination: function(req, file, callback) {
//         callback(null, '');
//     }
// });
// const upload = multer({ storage }).single('image');
const upload = fileFilterMiddleware('public/assets/img/temp/', 1024 * 1024 * 5);
// const upload = fileFilterMiddleware('', 1024 * 1024 * 5);

app.post('/', [upload], async(req, res) => {
    /*
        START UPLOAD FILES
    */
    // const myFyle = req.file.originalname;
    // myFyle.split('.').pop();
    // const params = {
    //     Bucket: process.env.AWS_BUCKLET_NAME + '/images',
    //     Key: `${uuidv4()}.${myFyle}`,
    //     Body: req.file.buffer,

    // };
    // s3.upload(params, (err, data) => {

    //     if (err) {
    //         return res.status(500).send(err);
    //     }
    //     return res.status(200).send(data)
    //         // console.log('---------data---------');
    //         // console.log(err);
    //         // console.log(data);
    //         // console.log('---------data---------');
    // });
    /*
        END UPLOAD FILES
    */

    // s3.listBuckets({}, (err, data) => {
    //     if (err) throw err;
    //     console.log('---------data---------');
    //     console.log(data);
    //     console.log('---------data---------');
    // });

    // const paramsx = {
    //     Bucket: 'claford'
    // }
    // s3.listObjectsV2(paramsx, (err, data) => {
    //     if (err) throw err;
    //     console.log('kkkkk');
    //     console.log(data);
    //     console.log('kkkkk');
    // });

    /*
    const getObject = {
        Bucket: 'claford',
        Key: 'images/a39d1aea-4245-4f3b-b18f-02762a7d67b2.2.jpg'
    }
    s3.getObject(getObject, (err, data) => {
        if (err) throw err;
        console.log(']]]]]]]]');
        console.log(data);
        console.log(']]]]]]]]');

        fs.writeFileSync('imagen_de_s3.png', data.Body, 'binary', (error) => {
            if (error) throw error;
            console.log('---------imagen grabada al disco---------');
            console.log(data.Body);
            console.log('---------imagen grabada al disco---------');
            return res.status(200).send(data)
        })
    });



    */
    // fs.readFile('imagen_de_s4.png', (err, data) => {
    //     if (err) throw err;

    //     const pametersSaveFileTows3 = {
    //         Bucket: process.env.AWS_BUCKLET_NAME,
    //         Key: `${uuidv4()}filename.jpg`,
    //         Body: data,
    //     }
    //     console.log('---------my save file---------');
    //     console.log(data);
    //     console.log('---------my save file---------');
    //     s3.putObject(pametersSaveFileTows3, (error, data) => {
    //         if (error) throw error;
    //         console.log('IMAGE SUBIDA....');
    //     })
    // })





    // console.log('---------req.file---------');
    // console.log(req.file);
    // console.log('---------req.file---------');
    //     // Everything went fine.
    // })
    // {
    //     fieldname: 'image',
    //     originalname: 'Screenshot (69).png',
    //     encoding: '7bit',
    //     mimetype: 'image/png',
    //     destination: 'C:\\Users\\ar-se\\OneDrive\\Escritorio\\Deonna_store\\backend\\src\\assets\\images\\temp\\',
    //     filename: 'undefined-undefined-1610461089725.png',
    //   store\\backend\\src\\assets\\images\\temp\\undefined-undefined-1610461089725.png',    
    //     size: 105527
    //   }
    return res.status(200).json({
        response: {
            data: null,
            error: 'res.image jensy OK'
        },
    });



});

module.exports = app;