const express = require('express');
const path = require('path');

const app = express();


// app.use('/', express.static(__dirname + 'html'));
app.use('/', express.static(path.join(__dirname, '../../public')));
app.set('view engine', 'ejs');

console.log('---------uri8888888---------');
console.log(path.join(__dirname));
console.log(path.join(__dirname, '../../public'));
console.log(path.join(__dirname, '../web/views'));
console.log('---------uri-99999999--------');
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