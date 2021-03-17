var express = require('express');
var router = express.Router();
const userController = require("../controllers");
const authMiddleware = require('../middlewares/auth')
const auth = require('./auth')

router.use('/auth', auth)

/* GET home page. */
router.use('/', authMiddleware)
router.get('/', userController.basicAPI);
router.post('/', userController.postAPI);


module.exports = router;
