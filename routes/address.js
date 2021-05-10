const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address')

router.get('/', addressController.addressAPI);

module.exports = router;