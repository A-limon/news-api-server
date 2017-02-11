const express = require('express')
const app = express()
const AV = require('leanengine')
const NewsRuoter = require('./router/news')
const ChannelsRuoter = require('./router/channels')

// setting
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
})

// use leancloud
AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
})
app.use(AV.express())
require('./cloud')

// root router
app.get('/', (req, res) => res.send('All About News.'))

// news router
app.use('/news', NewsRuoter)

// channels router
app.use('/channels', ChannelsRuoter)

// app.use(function(req, res, next) {
//   const err = new Error('Not Found')
//   err.status = 404
//   next(err)
// })

app.listen(3000, function () {
  console.log('News API Server is listening on port 3000, Good Luck!')
})


