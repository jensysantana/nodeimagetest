'use strict'
const express = require('express');
const app = express();
const path = require('path');

const { PUBLIC_PATH_SRC } = require('../../../api/config/config');

console.log('VIEW TESTER HERE ????');
// const normalizedPath = `/assets/img/products/home/2.jpg`;
// console.log(`******: ${PUBLIC_PATH}src/web/views`.replace('/\\/', '/'));
console.log(PUBLIC_PATH_SRC('../../web/views'));


console.log('VIEW TESTER HE????');
app.set('view engine', 'ejs');
// app.set('views', `${PUBLIC_PATH}src/web/views`);
app.set('views', PUBLIC_PATH_SRC('../../web/views'));
app.get('/', (req, res) => {

    // return res.status(200).json({
    //     hnsj: 'jnesy'
    // })drwxr-xr-x 
    /*
    const host = req.host;
    const filePath = req.protocol + "://" + host + '/' + req.file.path;
    console.log('---------req.protocol---------');
    // console.log(req.hostname);
    console.log(req.protocol);
    console.log('---------req.protocol---------');
    */
    //    res.render('home', { url: PUBLIC_PATH_SRC(normalizedPath) });
    // res.render('home');
    // res.render('home', { url: 'manzana' });

    // return res.sendFile(PUBLIC_PATH_SRC('../../web/views/'));
    return res.render('home');
});


module.exports = app;