var express = require('express');
var router = express.Router();
const updateController = require("../controllers/update");

router.get('/', updateController.sendNotificationAPI);
router.post('/', updateController.insertNewAPI);

module.exports = router;
