const SETTING = {
  API: 'https://newsapi.org/v1/articles',
  KEY: process.env.NEWS_API_KEY,
  INNERAPI: process.env.INNER_API,
  ERROR: {
    param: {
      code: -1,
      msg: 'param error'
    },
    noData: {
      code: -2,
      msg: 'no data'
    },
    sql: {
      code: -3,
      msg: 'sql error'
    },
    net: {
      code: -4,
      msg: 'net error'
    }
  }
}

module.exports = SETTING
