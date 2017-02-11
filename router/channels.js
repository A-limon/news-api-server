const express = require('express')
const AV = require('leanengine')
const router = express.Router()
const config = require('../config')

router.get('/', function (req, res) {
  const channelQuery = new AV.Query('Channel')
  channelQuery.find().then(function (results) {
    if (results && results.length >0) {
      res.send({
        code: 1,
        data: results
      })
    } else {
      res.send({
        code: 0,
        msg: 'Data Channel Empty'
      })
      console.error('Data Channel Empty')
    }
  }, function (error) {
    res.send({
      code: 0,
      msg: 'Query Channel failed'
    })
    console.error('Query Channel failed')
  })
})

module.exports = router
