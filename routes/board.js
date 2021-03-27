const express = require('express');
const router = express.Router();
const boardController = require('../controllers/board')
const authMiddleware = require('../middlewares/auth');

router.use('/', authMiddleware);

router.get('/', boardController.getBoardAPI);

module.exports = router;
//