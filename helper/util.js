const axios = require('axios')
const Config = require('../config')

const Util = {
  getRandomNumber: function (start, end, length) {
    let arr = []
    while (arr.length < length) {
      const randomnumber = Math.floor(Math.random() * (end - start + 1)) + start
      if (arr.indexOf(randomnumber) > -1) continue
        arr[arr.length] = randomnumber
    }
    return arr
  },
  post: function (API, requestData, successCb, errorCb) {
    axios.post(API , requestData)
    .then(function (response) {
      if (response.data !== undefined && response.data.code === 1) {
        successCb(response.data)
      } else {
        errorCb(Config.ERROR.noData)
      }
    })
    .catch(function (error) {
      errorCb({
        code: Config.ERROR.net.code,
        msg: Config.ERROR.net.msg,
        error: error
      })
    })
  },
  successHandler: function (res, data) {
    res.send({
      code: 1,
      data: data
    })
  },
  errorHandler: function (res, error) {
    console.error(error)
    res.send({
      code: error.code,
      msg: error.msg
    })
  },
}

module.exports = Util
