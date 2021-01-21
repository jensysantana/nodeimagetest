'use strict'
const routes = require('express').Router();
const homePage = require('../viewControllers/homeViewController/home-view-controller');
// const aboutPage = require('../viewControllers/aboutViewController/aboutViewController');



// routes.use('/about', aboutPage);
routes.use('/', homePage);
module.exports = routes;