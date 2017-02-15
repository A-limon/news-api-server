const express = require('express')
const router = express.Router()
const Util = require('../helper/util')
const Lean = require('../helper/leancloud')
const Config = require('../config')

router.get('/', function (req, res) {
  const channel = req.query.channel
  if (channel !== undefined && channel.length > 0) {
    Lean.searchQuery('Channel', 'channel_id', channel, function (results) {
      Util.successHandler(res, results)
    }, function (error) {
      Util.errorHandler(res, error)
    })
  } else {
    Util.errorHandler(res, Config.ERROR.param)
  }
})

module.exports = router
