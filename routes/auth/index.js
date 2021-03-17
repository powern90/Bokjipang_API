var express = require('express');
var router = express.Router();
const userController = require("../../controllers/auth");
const authMiddleware = require('../../middlewares/auth')

router.post('/register', userController.registerAPI);
router.get('/all', userController.getAPI);
router.post('/checkphone', userController.phone_duplicateAPI);
router.post('/enroll', userController.enrollAPI);
router.post('/login', userController.loginAPI);

router.use('/check', authMiddleware)
router.get('/check', userController.checkAPI);

module.exports = router;
