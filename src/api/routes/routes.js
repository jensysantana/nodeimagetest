'use strict'
const router = require('express').Router();
router.use('/auth', require('../controllers/AccountController/AccountController'));
router.use('/store', require('../controllers/store/StoreController'));

router.use('/products', require('../controllers/ProductController/ProductController'));
router.use('/categories', require('../controllers/CategoriesController/CategoriesController'));

// router.use(require('./homeViewController/home-view-controller'));
module.exports = router;