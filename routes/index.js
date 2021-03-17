var express = require('express');
var router = express.Router();
const auth = require('./auth')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.use('/auth', auth)

/* GET home page. */
router.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


module.exports = router;
