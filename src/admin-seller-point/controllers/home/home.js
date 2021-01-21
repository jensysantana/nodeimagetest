'use strict'
const app = require('express')();
const { PUBLIC_PATH_SRC } = require('../../../config/config');

app.set('view engine', 'ejs');
app.set('views', PUBLIC_PATH_SRC('../admin/views'));
app.get('/', (req, res) => {

    return res.render('index');
    // return res.status(200).json({
    //     success: true,
    //     data: 'jensy satnana desde admin del administrador'
    // });
});

module.exports = app;