'use strict'
const app = require('express')();

app.get('/', (req, res) => {

    console.log('------------------');
    console.log(req.params);
    console.log('------------------');
    return res.status(200).json({
        name: 'in data 11'
    });

});
app.post('/', (req, res) => {

    console.log('------------------');
    console.log(req.body.name);
    console.log('------------------');
    return res.status(200).json({
        name: 'in data'
    });

});

module.exports = app;