'use strict'

const ImageMiddlewareHelper = (req, res, next) => {
    // console.log('---------req.********1---------');
    // console.log(req.url);
    // const url = req.url;
    // // console.log(url.include('temp'));
    // console.log(url.split('/'));
    // // if (url.search('/temp/') > 0) {
    // //     req.url = `${SERVER_URL}images/ash4.jpg`;
    // // }
    // console.log('---------req.*********2----');
    next();
}

module.exports = ImageMiddlewareHelper;