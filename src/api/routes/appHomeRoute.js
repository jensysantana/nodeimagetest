'use strict'

const app = require('express')();
app.get('/', (req, res) => {
    return res.status(200).json({
        response: 'Invalid api route.'
    });
});

module.exports = app;