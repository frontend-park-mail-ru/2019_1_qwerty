const port = 8000;

const fs = require('fs');
const http = require('http');
const express = require('express');
const body = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');
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

const ids = {};

app.post('/signin', function (req, res) {
    const [nickname, password] = [req.body.nickname, req.body.password];

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

    const  id = uuid();
    ids[id] = nickname;

    res.cookie("sessionid", id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
    res.status(200).json(users);
});

app.post('/signup', function (req, res) {
    const [nickname, password, email] = [req.body.nickname, req.body.password, req.body.email];

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
    const id = uuid();
    ids[id] = nickname;


    res.cookie('sessionid', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
    res.status(201).json({id});
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
});
