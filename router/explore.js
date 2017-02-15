const express = require('express')
const router = express.Router()
const Util = require('../helper/util')
const Config = require('../config')

const innerGet = function (API, requestData) {
  return new Promise( function (resolve, reject) {
    Util.post(API, requestData, function (data) {
      resolve(data.data)
    }, function (error) {
      reject(error)
    })
  })
}

router.get('/', function (req, res) {
  const remcommend = {
    channels: function innerChannels () {
      return innerGet(Config.INNERAPI + '/channels/multi', {
        ids: ['589d83868ac247002b83a52e','589d83868ac247002b83a4fa', '589d83868ac247002b83a505', '589d83868ac247002b83a50e', '589d83868ac247002b83a530']
      })
    },
    news: function innerChannels () {
      return innerGet(Config.INNERAPI + '/news/multi', {
        ids: ['589d8e0961ff4b006b3b14ce','589d8e0a1b69e60059bdbee4', '589d8e090ce46300562dad33', '589d8e1386b599006b2f5be3', '589d8e155c497d0056271f8d']
      })
    }
  }
  const helper = function () {
    const handleResult = function (results, value) {
      results.push(value)
      return results
    }
    const pushValue = handleResult.bind(null, [])
    const tasks = [remcommend.channels, remcommend.news]
    return tasks.reduce(function (promise, task) {
        return promise.then(task).then(pushValue)
    }, Promise.resolve())
  }
  helper()
  .then(function (fetchData) {
    const returnData = [
      {
        id: 'the-verge',
        channel: {},
        news: []
      },
      {
        id: 'bbc-news',
        channel: {},
        news: []
      },
      {
        id: 'espn',
        channel: {},
        news: []
      },
      {
        id: 'ign',
        channel: {},
        news: []
      },
      {
        id: 'the-washington-post',
        channel: {},
        news: []
      }
    ]
    const findData = function (data, name, target) {
      let result = {}
      data.forEach(function (item) {
        if (item[name] === target) {
          result = item
        }
      })
      return result
    }
    returnData.forEach(function (item) {
      item.channel = findData(fetchData[0], 'channel_id', item.id)
      item.news = findData(fetchData[1], 'source', item.id)
    })
    Util.successHandler(res, returnData)
  })
  .catch(function (error) {
    Util.errorHandler(res, {
      code: Config.ERROR.sql.code,
      msg: Config.ERROR.sql.msg,
      error: error
    })
  })
})

module.exports = router
