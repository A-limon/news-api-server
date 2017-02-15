const AV = require('leanengine')
const Config = require('../config')

const Lean = {
  findAll: function (className, successCb, errorCb) {
    const query = new AV.Query(className)
    query.find().then(function (results) {
      if (results && results.length >0) {
        successCb(results)
      } else {
        errorCb(Config.ERROR.noData)
      }
    }, function (error) {
      errorCb({
        code: Config.ERROR.sql.code,
        msg: Config.ERROR.sql.code.msg,
        error: error
      })
    })
  },
  multiQuery: function (className, propName, queryList, successCb, errorCb) {
    let requestList = []
    const find = function (prop) {
      const query = new AV.Query(className)
      query.equalTo(propName, prop)
      requestList.push(query)
    }
    queryList.forEach(function (prop) {
      find(prop)
    })
    const query = AV.Query.or(...requestList)
    query.find().then(function (results) {
      if (results && results.length > 0 ) {
        successCb(results)
      } else {
        errorCb(Config.ERROR.noData)
      }
    }, function (error) {
      errorCb({
        code: Config.ERROR.sql.code,
        msg: Config.ERROR.sql.code.msg,
        error: error
      })
    })
  },
  andQuery: function (className, queryListObj, successCb, errorCb) {
    let requestList = []
    const find = function (key, value) {
      const query = new AV.Query(className)
      query.equalTo(key, value)
      requestList.push(query)
    }
    queryListObj.forEach(function (item) {
      find(item.key, item.value)
    })
    const query = AV.Query.and(...requestList)
    query.find().then(function (results) {
      if (results && results.length > 0 ) {
        successCb(results)
      } else {
        errorCb(Config.ERROR.noData)
      }
    }, function (error) {
      errorCb({
        code: Config.ERROR.sql.code,
        msg: Config.ERROR.sql.code.msg,
        error: error
      })
    })
  },
  searchQuery: function (className, searchKey, searchValue, successCb, errorCb) {
    const query = new AV.Query(className)
    query.contains(searchKey, searchValue)
    query.find().then(function (results) {
      if (results && results.length >0) {
        successCb(results)
      } else {
        errorCb(Config.ERROR.noData)
      }
    }, function (error) {
      errorCb({
        code: Config.ERROR.sql.code,
        msg: Config.ERROR.sql.code.msg,
        error: error
      })
    })
  }
}

module.exports = Lean
