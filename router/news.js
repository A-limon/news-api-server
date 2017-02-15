const express = require('express')
const router = express.Router()
const Util = require('../helper/util')
const Lean = require('../helper/leancloud')
const Config = require('../config')

router.get('/', function (req, res) {
  const source = req.query.source
  const sortBy = req.query.sortBy
  if (source !== undefined && sortBy !== undefined) {
    Lean.andQuery('News',[{key: 'source', value: source}, {key: 'sort_by', value: sortBy}], function (results) {
       Util.successHandler(res, results[0])
    }, function (error) {
      Util.errorHandler(res, {
        code: Config.ERROR.sql.code,
        msg: Config.ERROR.sql.msg,
        error: error
      })
    })
  } else {
    Util.errorHandler(res, Config.ERROR.param)
  }
})

router.post('/multi', function (req, res) {
  if (req.body === undefined || req.body.ids === undefined || req.body.ids.length ===0) {
    Util.errorHandler(res, Config.ERROR.param)
  } else {
    Lean.multiQuery('News', 'objectId', req.body.ids, function (results) {
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
