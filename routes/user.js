var express = require('express');
var router = express.Router();
const userController = require("../controllers/user");
const boardController = require("../controllers/board");
const authMiddleware = require('../middlewares/auth');

router.use('/', authMiddleware);

router.post('/update', userController.updateUserAPI);
router.post('/interest', userController.updateInterestAPI);
router.get('/post', boardController.getMyPostAPI);

module.exports = router;
