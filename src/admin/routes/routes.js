'use strict'

const express = require('express').Router;
const app = express();
const homePage = require('../controllers/home/home');

app.use('/', homePage);

module.exports = app;