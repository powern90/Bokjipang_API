const express = require('express');
const router = express.Router();
const boardController = require('../controllers/board')
const authMiddleware = require('../middlewares/auth');

router.use('/', authMiddleware);

router.get('/', boardController.getBoardAPI);
router.get('/post', boardController.getPostAPI);

module.exports = router;