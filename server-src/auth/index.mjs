import express from 'express'

import local from './local'
import auth0 from './auth0'
import google from './google'
import twitter from './twitter'
import facebook from './facebook'

const router = express.Router()

router.use('/local', local)
router.use('/auth0', auth0)
router.use('/google', google)
router.use('/twitter', twitter)
router.use('/facebook', facebook)

export { router }
