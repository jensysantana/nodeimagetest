const express = require('express');
const path = require('path');
const app = express();
const shopRT = require('./routes/routes');
// const webRoutes = require('../web/routes/routes');

// app.use('/', express.static(__dirname + 'html'));
app.use('/', express.static(path.join(__dirname, '../../public')));

app.use('/api/v1/', shopRT);
// app.use('/', webRoutes);

console.log('---------uri8888888---------');
console.log(path.join(__dirname));
console.log(path.join(__dirname, '../../public'));
console.log(path.join(__dirname, '../web/views'));
console.log('---------uri-99999999--------');



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../web/views'));
app.get('/', (req, res) => {
    // const uri = path.normalize(`${path.resolve()}/html/index.html`);
    //res.sendFile(path.join(uri));
    return res.render('home');


    // res.status(200).json({
    //     djksd: 'fdkjfdjbfklfd'
    // })
});

module.exports = app;