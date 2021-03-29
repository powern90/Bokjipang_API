const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const indexRouter = require('./routes/index');
const sequelize = require('./models').sequelize; // sequelize require
const config = require('./config')

const app = express();
sequelize.sync()
    .then(() => {
        console.log("DB Connection Success");
    })
    .catch((err) => {
        console.log("DB Connection Failed: "+ err);
    });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('jwt-secret', config.secret)

// app.all('*', (req, res, next) => {
//     let protocol = req.headers['x-forwarded-proto'] || req.protocol;
//     if (protocol === 'https') {
//         next();
//     } else {
//         let from = `${protocol}://${req.hostname}${req.url}`;
//         let to = `https://${req.hostname}${req.url}`;
//         console.log(`[${req.method}]: ${from} -> ${to}`);
//         res.redirect(307, to);
//     }
// });

app.use('/', indexRouter);

module.exports = app;
