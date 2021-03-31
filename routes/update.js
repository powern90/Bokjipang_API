var express = require('express');
var router = express.Router();
const updateController = require("../controllers/update");

router.get('/', updateController.sendNotificationAPI);

module.exports = router;
