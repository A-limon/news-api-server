const express = require('express')
const router = express.Router()
const Util = require('../helper/util')
const Lean = require('../helper/leancloud')
const Config = require('../config')

router.get('/', function (req, res) {
  Lean.findAll('Channel', function (results) {
    Util.successHandler(res, results)
  }, function (error) {
    Util.errorHandler(res, error)
  })
})

router.get('/random', function (req, res) {
  Lean.findAll('Channel', function (results) {
    const randomNumber = 5
    const randomArr = Util.getRandomNumber(0, results.length-1, randomNumber)
    const returnData = []
    for (let i = 0; i < randomNumber; i++) {
      returnData.push(results[randomArr[i]])
    }
    Util.successHandler(res, returnData)
  }, function (error) {
    Util.errorHandler(res, {
      code: Config.ERROR.sql.code,
      msg: Config.ERROR.sql.msg,
      error: error
    })
  })
})

router.post('/multi', function (req, res) {
  if (req.body === undefined || req.body.ids === undefined || req.body.ids.length ===0) {
    Util.errorHandler(res, Config.ERROR.param)
  } else {
    Lean.multiQuery('Channel', 'objectId', req.body.ids, function (results) {
      Util.successHandler(res, results)
    }, function (error) {
      Util.errorHandler(res, {
        code: Config.ERROR.sql.code,
        msg: Config.ERROR.sql.msg,
        error: error
      })
    })
  }
})

module.exports = router
