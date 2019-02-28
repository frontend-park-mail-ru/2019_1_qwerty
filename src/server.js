const port = 8000;

const fs = require('fs');
const http = require('http');
const express = require('express');
const body = require('body-parser');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));
app.use(body.json());
app.use(express.static('./src/public/'));

const users = {
    "bobroff" : {
        email:"k@gmail.com",
        score:"34"
    }
};

app.post('/login', function (req, res) {
    const nickname = req.body.nickname;
    const password = req.body.password;

    if (!nickname || !password ){
        return
    }
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
});
