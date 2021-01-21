'use strict'
const router = require('express').Router();
router.use('/welcome-shop', require('../controllers/Shop/ShopController'));

router.use('/products', require('../controllers/ProductController/ProductController'));

// router.use(require('./homeViewController/home-view-controller'));
module.exports = router;