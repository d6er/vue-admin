const express = require('express')
const mongo = require('../mongo')

// Router
const router = express.Router();

router.get('/', (req, res) => {
  let data = { RuName: 'Yoshihiro_Watan-Yoshihir-1b29-4-djxslw' }
  ebay.call('GetSessionID', data).then(response => {
    req.session.SessionID = response.SessionID // todo: use passport?
    let url = 'https://signin.sandbox.ebay.com/ws/eBayISAPI.dll'
        + '?SignIn&runame=' + data.RuName + '&SessID=' + response.SessionID
    res.redirect(url)
  })
})

router.get('/accept', (req, res) => {
  let accountData = {}
  
  // FetchToken
  let data = { SessionID: req.session.SessionID }
  ebay.call('FetchToken', data).then(response => {
    accountData.Token = response
    
    // GetUser
    let data = { RequesterCredentials: { eBayAuthToken: response.eBayAuthToken } }
    return ebay.call('GetUser', data)
  }).then(response => {
    accountData.User = response.User
    
    // todo: add ebay user data. use Passport Authorize?
    mongo.addAccount(req.user._id, accountData)
    
    res.redirect('/user')
  })
})

module.exports = router
