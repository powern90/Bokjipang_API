var express = require('express');
var router = express.Router();
const mainController = require("../controllers/main");
const authMiddleware = require('../middlewares/auth');

router.use('/', authMiddleware);

router.get('/', mainController.getMainAPI);
router.get('/board', mainController.getBoardAPI);
// router.get('/zzim', mainController.getZzimAPI);
router.get('/high', mainController.getHighAPI);


module.exports = router;
