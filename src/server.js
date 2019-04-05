const port = 8000;

const express = require('express');
const body = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fallback = require('express-history-api-fallback');
const app = express();

app.use(morgan('dev'));
app.use(body.json());
app.use(cookieParser());
// app.use(express.static('./src/public/'));
app.use(express.static('./src/public/'));

app.use(fallback('index.html', { root: './src/public' }));

// app.get('/*', function (req, res) {
//     res.sendFile('/public/index.html', { root: __dirname });
// });

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${port}`);
});
