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
        password:"hi",
        score:"34"
    }
};

app.post('/signin', function (req, res) {
    const nickname = req.body.nickname;
    const password = req.body.password;

    console.log(users);

    if (!nickname || !password) {
        res.status(400).json({error: 'Please, input your Nickname or Password'});
        return;
    }



    if (!users[nickname] || users[nickname].password !== password) {
        console.log("asd");
        res.status(400).json({error: 'Не верный Nickname и/или пароль'});
        return;
    }

    res.status(200).json(users);
});

app.post('/signup', function (req, res) {
    const nickname = req.body.nickname;
    const password = req.body.password;
    const email = req.body.email;

    if (!nickname || !password || !email) {
        res.status(400).json({error: 'Please, input your Nickname or Password or Email'});
        return;
    }

    if (users[nickname]) {
        console.log("asd");
        res.status(400).json({error:'Such player already exists'});
        return;
    }

    users[nickname] = {email, password, score:0};

    res.status(200).json(users);
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
});
