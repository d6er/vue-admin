const express = require('express');

const local = require('./local')
const ebay = require('./ebay')

const router = express.Router();

router.use('/local', local)
router.use('/ebay', ebay)

module.exports = router;
