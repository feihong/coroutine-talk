const koa = require('koa')
const serve = require('koa-static')
const route = require('koa-route')
const axios = require('axios')
const app = koa()


const GRACENOTE_API_KEY = process.env.GRACENOTE_API_KEY
const GRACENOTE_URL = 'http://data.tmsapi.com/v1.1/movies/showings'

app.use(route.get('/movies/', movies))
app.use(route.get('/ratings/', ratings))

function *movies() {
  let {lat, lng} = this.request.query
  let params = {
    startDate: moment().format('YYYY-MM-DD'),
    api_key: GRACENOTE_API_KEY
    lat,
    lng,
  }
  let movies = yield axios.get(url, {params}).then(res => res.data)
  this.body = movies.map(movie => {
    return {
      title: movie.title,
      year: movie.releaseYear,
      genres: movie.genres,
    }
  })
}

function *ratings() {
  this.body = ["a", "b", "c"]
}

app.use(serve('.'))

app.listen(8000)
