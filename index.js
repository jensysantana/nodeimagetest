const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4300;

// app.use('/', express.static(__dirname + 'html'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

console.log('---------uri8888888---------');
console.log(path.join(__dirname));
console.log(path.join(__dirname, 'public'));
console.log(path.join(__dirname, '/views/'));
console.log('---------uri-99999999--------');
app.set('views', path.join(__dirname, '/views'));
app.get('/', (req, res) => {
    // const uri = path.normalize(`${path.resolve()}/html/index.html`);
    //res.sendFile(path.join(uri));
    return res.render('index');


    // res.status(200).json({
    //     djksd: 'fdkjfdjbfklfd'
    // })
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));


module.exports = app;