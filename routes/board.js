const express = require('express');
const router = express.Router();
const boardController = require('../controllers/board')
const authMiddleware = require('../middlewares/auth');

router.use('/', authMiddleware);

router.get('/', boardController.getBoardAPI);
router.get('/post', boardController.getPostAPI);
router.post('/reply/update', boardController.updateReplyAPI);
router.post('/reply/add', boardController.addReplyAPI);
router.post('/post/update', boardController.updatePostAPI);
router.post('/reply')

module.exports = router;