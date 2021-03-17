var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var sequelize = require('./models').sequelize; // sequelize require
const config = require('./config')

var app = express();
sequelize.sync();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('jwt-secret', config.secret)

app.use('/', indexRouter);

module.exports = app;
