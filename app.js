const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const admin = require('firebase-admin');
const serviceAccount = require('./bokjipang-firebase-adminsdk-uhfgo-768bff3684.json');


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

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bokjipang-default-rtdb.firebaseio.com"
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.set('jwt-secret', config.secret)

app.all('*', (req, res, next) => {
    let protocol = req.headers['x-forwarded-proto'] || req.protocol;
    if (protocol === 'https') {
        next();
    } else {
        let from = `${protocol}://${req.hostname}${req.url}`;
        let to = `https://${req.hostname}${req.url}`;
        console.log(`[${req.method}]: ${from} -> ${to}`);
        res.redirect(307, to);
    }
});

app.use('/', indexRouter);

module.exports = app;
