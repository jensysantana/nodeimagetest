const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4300;

// app.use('/', express.static(__dirname + 'html'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // const uri = path.normalize(`${path.resolve()}/html/index.html`);
    console.log('---------uri---------');
    console.log(path.join(__dirname, 'public'));
    console.log('---------uri---------');
    //res.sendFile(path.join(uri));
    return res.render(path.join(__dirname, 'index'));


    // res.status(200).json({
    //     djksd: 'fdkjfdjbfklfd'
    // })
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));


module.exports = app;