'use strict'

const express = require('express').Router;
const app = express();
const homePage = require('../controllers/home/HomeController');

app.use('/', homePage);

module.exports = app;