const port = 8111;

const fs = require('fs');
const http = require('http');
const express = require('express');
const body = require('body-parser');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));
app.use(body.json());
app.use(express.static('./public/'));

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})
