const express = require('express')
const AV = require('leanengine')
const router = express.Router()
const config = require('../config')

const errorHandler = function (res, msg ,log) {
  res.send({
    code: 0,
    msg: msg
  })
  if (log !== undefined && log > 0) {
    console.error(msg)
  }
}

const handelNews = function (res, source, sortBy) {
  const newsSourceQuery = new AV.Query('News')
  newsSourceQuery.equalTo('source', source)
  
  const newsSortQuery = new AV.Query('News')
  newsSortQuery.equalTo('sort_by', sortBy)
  
  const newsQuery = AV.Query.and(newsSourceQuery, newsSortQuery)
  newsQuery.find().then(function (results) {
    if (results && results.length > 0) {
      res.send({
        code: 1,
        data: results[0].attributes.content
      })
    } else {
      errorHandler(res, 'no news')
    } 
  }, function (error) {
    errorHandler(res, error, 1)
  })
}

router.get('/', function (req, res) {
  const source = req.query.source
  const sortBy = req.query.sortBy

  if (source !== undefined && sortBy !== undefined) {
    const channelQuery = new AV.Query('Channel')
    channelQuery.equalTo('channel_id', source)
    channelQuery.find().then(function (results) {
      if (results && results.length > 0) {
        if (results[0].attributes.sortBysAvailable.indexOf(sortBy) !== -1) {
          handelNews(res, source, sortBy)
        } else {
          errorHandler(res, 'no this sort way')
        }
      } else {
        errorHandler(res, 'no channel')
      } 
    }, function (error) {
      errorHandler(res, error, 1)
    })
  } else {
    errorHandler(res, 'not availabled')
  }
})

module.exports = router
