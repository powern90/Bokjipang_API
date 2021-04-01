var express = require('express');
var router = express.Router();
const auth = require('./auth');
const main = require('./main');
const board = require('./board');
const support = require('./support');
const update = require('./update');
const user = require('./user');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.use('/auth', auth);
router.use('/main', main);
router.use('/board', board);
router.use('/update', update);
router.use('/support', support);
router.use('/user', user);


/* GET home page. */
router.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


module.exports = router;
