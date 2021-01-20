'use strict'

const express = require('express');
const app = express();


const { PUBLIC_PATH } = require('../../../app/config/config');

app.set('view engine', 'ejs');
app.set('views', `${PUBLIC_PATH}src/web/views`);

app.get('/', (req, res) => {
    res.render('about', { name: 'Jashly Abigahil' });
});


module.exports = app;