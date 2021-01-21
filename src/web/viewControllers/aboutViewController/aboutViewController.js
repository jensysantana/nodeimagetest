'use strict'

const express = require('express');
const app = express();


const { PUBLIC_PATH_SRC } = require('../../../config/config');

// app.set('views', `${PUBLIC_PATH}src/web/views`);
app.set('view engine', 'ejs');
app.set('views', PUBLIC_PATH_SRC('/web/views'));

app.get('/', (req, res) => {
    res.render('about', { name: 'Jashly Abigahil' });
});


module.exports = app;