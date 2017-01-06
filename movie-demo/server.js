const koa = require('koa')
const serve = require('koa-static')
const route = require('koa-route')
const axios = require('axios')
const moment = require('moment')
const app = koa()


const GRACENOTE_API_KEY = process.env.GRACENOTE_API_KEY
const GRACENOTE_URL = 'http://data.tmsapi.com/v1.1/movies/showings'
const OMDB_URL = 'http://omdbapi.com/'

// app.use(route.get('/movies/', movies))
// app.use(route.get('/rating/', rating))
app.use(route.get('/movies/', fakeMovies))
app.use(route.get('/rating/', fakeRating))


function *movies() {
  let {lat, lng} = this.request.query
  let params = {
    startDate: moment().format('YYYY-MM-DD'),
    api_key: GRACENOTE_API_KEY,
    lat,
    lng,
  }
  let res = yield axios.get(GRACENOTE_URL, {params})
  this.body = res.data.map(movie => {
    return {
      title: movie.title,
      year: movie.releaseYear,
      genres: movie.genres,
      showtime: movie.showtimes[0].dateTime,
    }
  })
}

function *rating() {
  let {title, year} = this.request.query
  let params = {
    t: title,
    y: year,
    type: 'movie',
    tomatoes: 'true'
  }
  let res = yield axios.get(OMDB_URL, {params})
  let movie = res.data
  let avgRating = (
    (parseInt(movie.Metascore) / 10) +
    parseFloat(movie.imdbRating) +
    parseFloat(movie.tomatoRating)
  ) / 3
  this.body = {rating: avgRating}
}

function *fakeMovies() {
  const fs = require('fs')
  let data = yield new Promise(resolve => {
    fs.readFile('gracenote-response.json', (err, data) => resolve(data))
  })
  let movies = JSON.parse(data)
  this.body = movies.map(movie => {
    return {
      title: movie.title,
      year: movie.releaseYear,
      genres: movie.genres,
      showtime: movie.showtimes[0].dateTime,
    }
  })
}

function *fakeRating() {
  this.body = {rating: Math.floor(Math.random() * 100) / 10}
}

app.use(serve('.'))

app.listen(8000)
