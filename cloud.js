const AV = require('leanengine')
const axios = require('axios')
const config = require('./config')

const initNews = function (source, sort, articles) {
  const News = AV.Object.extend('News')
  const NewsItem = new News()
  NewsItem.set('source', source)
  NewsItem.set('sort_by', sort)
  NewsItem.set('content',articles)
  NewsItem.save().then(function (item) {
    console.log('save ' + source +' news sortBy ' + sort + ' successd')
  }, function (error) {
    console.error('save ' + source +' news sortBy ' + sort + 'failed')
    console.error(error)
  })
}

const updateNews = function (source, sort, articles) {
  const newsSourceQuery = new AV.Query('News')
  newsSourceQuery.equalTo('source', source)
  
  const newsSortQuery = new AV.Query('News')
  newsSortQuery.equalTo('sort_by', sort)
  
  const newsQuery = AV.Query.and(newsSourceQuery, newsSortQuery)
  newsQuery.find().then(function (results) {
    if (results && results.length > 0) {
      const id = results[0].id
      const updateNews = AV.Object.createWithoutData('News', id)
      updateNews.set('content', articles)
      updateNews.save()
      console.log('update news success with ' + source + ' sort by ' + sort)
    } else {
      console.error('update news failed at ' + source + ' sort by ' + sort)
    } 
  }, function (error) {
    errorHandler(res, error, 1)
  })
}

const getNews = function (source, sort, callback) {
  console.log('Starting fetch ' + source +' news sortBy ' + sort)
  axios.get(config.API, {
    params: {
      source: source,
      sortBy: sort,
      apiKey: config.KEY
    }
  })
  .then(function (response) {
    if (response.data !== undefined && response.data.status === 'ok') {
      callback(source, sort, response.data.articles)
    } else {
      console.error('newsapi server is down')
    }
  })
  .catch(function (error) {
    console.error(error)
  })
}

const getList = function (results, callback) {
  results.forEach(function (channel) {
     channel.attributes.sortBysAvailable.forEach(function (sort) {
      getNews(channel.attributes.channel_id, sort, callback)
    })
  })
}

const queryChannel = function (callback) {
  const channelQuery = new AV.Query('Channel')
  channelQuery.find().then(function (results) {
    if (results && results.length >0) {
      getList(results, callback)
    } else {
      console.error('Data Channel Empty')
    }
  }, function (error) {
    console.error('Query Channel failed')
  })
}

AV.Cloud.define('initFetchAllNews', function(request, response){
  console.log('Starting fetchNews')
  queryChannel(initNews)
  return response.success()
})

AV.Cloud.define('updateAllNews', function(request, response){
  console.log('Updating All News...')
  queryChannel(updateNews)
  return response.success()
})

AV.Cloud.define('updateNewsById', function (request, response) {
  const id = request.params.id
  if (id === undefined) {
    return response.error('id is undefined')
  } else {
    console.log('Updating News By Id: ' + id)
    const query = new AV.Query('News')
    query.get(id).then(function (news) {
      if (news !== undefined) {
        getNews(news.attributes.source, news.attributes.sort_by ,updateNews)
      } else {
        console.error('update news by id error,no news found by this id')
      }
    }, function (error) {
      console.error('update news by id error')
      console.error(error)
    })
    return response.success()
  }
})

module.exports = AV.Cloud
