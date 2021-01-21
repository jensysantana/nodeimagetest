const mongoose = require('mongoose');
const { HOST_NAME } = require('../config/config');
async function connectionDb() {

    await mongoose.connect(HOST_NAME, {
        // dbName: 'deonna_shop',
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,

    });
    console.log('Database connected');
}

module.exports = {
    connectionDb
};