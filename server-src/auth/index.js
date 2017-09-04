const local = require('./local')

const express = require('express');
const router = express.Router();

router.use('/local', local)

module.exports = router;
