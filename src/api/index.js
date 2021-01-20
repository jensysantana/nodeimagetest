const app = require('./app');
const PORT = process.env.PORT || 4300;
const { HOST_NAME } = require('./config/config');
const { connectionDb } = require('./db/database');

async function conectDb() {
    await connectionDb();
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
}

conectDb().then(() => {
    console.log(`Server conected on port: ${ HOST_NAME }`);
}).catch(err => console.error(err));

module.exports = app;