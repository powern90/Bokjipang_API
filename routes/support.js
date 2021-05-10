const express = require('express');
const router = express.Router();
const supportController = require('../controllers/support')
const authMiddleware = require('../middlewares/auth');

router.use('/', authMiddleware);

router.get('/', supportController.getsupportAPI);
router.get('/add', supportController.addList);
// router.get('/post', supportController.getPostAPI);
router.get('/search', supportController.searchPost);

module.exports = router;
