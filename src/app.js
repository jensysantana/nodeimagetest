const express = require('express');
const path = require('path');
const app = express();
const shopRT = require('./api/routes/routes');
const webRoutes = require('./web/routes/routes');
const adminRoutes = require('./admin/routes/routes');
const adminSellerPoint = require('./admin-seller-point/routes/routes');
const morgan = require('morgan');

/* 
 * Cors setup
 */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, AUTH_TOKEN_X, AUTH_ROLE, auth_role_x, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept,  Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
// app.use(cors());
// //enabled all cors
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(express.json());
app.use(morgan('dev'));
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