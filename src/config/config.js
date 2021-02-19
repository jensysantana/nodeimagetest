const path = require('path');
// console.log('---------path---------');
// // console.log(`${path.resolve(__dirname, '../../../')}\\`);
// console.log(path.join(__dirname, '../../web/views/'));
// console.log(path.join(__dirname));
// console.log(path.normalize(`${path.resolve()}/jensysantana/carla`));
// console.log(`${path.normalize(path.resolve())}`);
// console.log(__dirname);
// console.log('---------path--XXXX-------');
const configs = {
        HOST_NAME: 'mongodb://localhost:27017/marketstore',
        // HOST_NAME: 'mongodb+srv://satana:RyUUyGXJXpApSAEz@project-users.jxttd.mongodb.net/fakerusersflutter?retryWrites=true&w=majority',
        HOST_PORT: process.env.PORT || 4300,
        BASE_PATH: path.normalize(path.resolve()),
        // PUBLIC_PATH: `${path.resolve(__dirname, '../../')}\\`,
        PUBLIC_PATH: `${path.normalize(path.resolve())}\\`,
        PUBLIC_PATH_SRC: function(uri) {
            if (uri) {
                return path.join(__dirname, uri);
            }
            return path.join(__dirname);
        },
        SERVER_URL: 'http://localhost:4300/',
        TOKEN: {
            SIGN_UP: 60 * 60, //set to 24h
            SIGN_IN: 15 * 60,
            TOKENSEED: 'DSKDas@34#$%^*-+/+()*!',
            ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY,
            ACCESS_TOKEN_SECRET__REFRESHER_KEY: process.env.ACCESS_TOKEN_SECRET__REFRESHER_KEY,
        },
        APP: {
            NAME_APP: 'Claford',
            // APP_URL: 'http://localhost:4300/',
            APP_FRONT_END_URL: 'http://localhost:4301',
            APP_CATCH_WORD: 'claford, store, shop, vendor, multivendor, seller, sell, buy, market, market store, marketplace, mini market'
        },
        ISPRODUCTION_ENV: false,
        BLOCK_OPT_OR_EMAIL_SENDER_TIME: {
            EMAIL_SENDER_LIMIT: 3,
            EMAIL_SENDER_TIME_LIMIT: 3,
            PHONE_OTP_LIMIT: 3,
            PHONE_OTP_TIME_LIMIT: 3,
        }
    }
    /*
    const configxx = {
        appConf:{
            host: process.env.APP_HOST,
            port: process.env.APP_PORT,
            // basePath: path.resolve(),
            publicPath: `${path.resolve(__dirname, '../../')}\\`,
            name:process.env.APP_NAME,
            catchWord:process.env.APP_CATCH_WORD,
            // appPublicStorage:process.env.APP_PUBLIC_STORAGE,
            // appPrivateStorage:process.env.APP_PRIVATE_STORAGE
        },
        dbConfig:{
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dbName: process.env.DB_NAME,
            // user: process.env.USER,
            // password: process.env.DB_PASS
        },

        frontEnd:{
            url:process.env.FRONTEND_URL,
        },
        images:{
            nameLength: 40,
            logo:{
                size:200,
            }
        }
    }
    */


module.exports = configs;