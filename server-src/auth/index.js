const express = require('express')

const local = require('./local')
const auth0 = require('./auth0')
const google = require('./google')
const twitter = require('./twitter')
const facebook = require('./facebook')

const router = express.Router()

router.use('/local', local)
router.use('/auth0', auth0)
router.use('/google', google)
router.use('/twitter', twitter)
router.use('/facebook', facebook)

module.exports = router
