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
    // HOST_NAME: 'mongodb://localhost:27017/deonna_shop',
    HOST_NAME: 'mongodb+srv://satana:RyUUyGXJXpApSAEz@project-users.jxttd.mongodb.net/fakerusersflutter?retryWrites=true&w=majority',
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
}

module.exports = configs;