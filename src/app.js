require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();
const shopRT = require('./api/routes/routes');
const webRoutes = require('./web/routes/routes');
const adminRoutes = require('./admin/routes/routes');
const adminSellerPoint = require('./admin-seller-point/routes/routes');
const morgan = require('morgan');
const device = require('express-device');
const DeviceInfo = require('./api/middlewares/device-info-middleware');
const cookieParser = require('cookie-parser');

const whitelist = ['http://localhost:4301', 'https://claford.com']
const cors = require('cors');
const corsOptions = {
    credentials: true,
    origin: whitelist,
    // origin: function(origin, callback) {
    //     console.log('---------origin---------');
    //     console.log(origin);
    //     console.log('---------origin---------');
    //     if (whitelist.indexOf(origin) !== -1) {
    //         callback(null, true)
    //     } else {
    //         callback(new Error('Not allowed by CORS'))
    //     }
    // },
    allowedHeaders: 'Authorization, AUTH_TOKEN_X, AUTH_ROLE, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept,  Access-Control-Allow-Request-Method',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
/* 
 * Cors setup
 */
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(express.json());
app.use(morgan('dev'));
app.use(device.capture());
app.use(DeviceInfo);
app.use(cookieParser());
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Authorization, AUTH_TOKEN_X, AUTH_ROLE, auth_role_x, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept,  Access-Control-Allow-Request-Method');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//     res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//     next();
// });
// //enabled all cors
app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/api/v1/', shopRT);
app.use('/seller-point', adminSellerPoint);
app.use('/admin-center', adminRoutes);
app.use('/', webRoutes);

// console.log('---------uri8888888---------');
// console.log(path.join(__dirname));
// console.log(path.join(__dirname, '../public'));
// console.log(path.join(__dirname, '../web/views'));
// console.log('---------uri-99999999--------');

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '../web/views'));
// app.get('/', (req, res) => {
//     // const uri = path.normalize(`${path.resolve()}/html/index.html`);
//     //res.sendFile(path.join(uri));
//     return res.render('home');


//     // res.status(200).json({
//     //     djksd: 'fdkjfdjbfklfd'
//     // })
// });

module.exports = app;