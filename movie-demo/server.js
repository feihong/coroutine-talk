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
// app.use(route.get('/rating/', ratingAndPoster))
app.use(route.get('/movies/', fakeMovies))
app.use(route.get('/rating/', fakeRatingAndPoster))


function *movies() {
  let {lat, lng} = this.request.query
  let params = {
    startDate: moment().format('YYYY-MM-DD'),
    api_key: GRACENOTE_API_KEY,
    lat,
    lng,
  }
  try {
    let res = yield axios.get(GRACENOTE_URL, {params})
    this.body = convertMovies(res.data)
  } catch (err) {
    console.log(err)
    this.body = []
  }
}

function *ratingAndPoster() {
  let {title, year} = this.request.query
  let params = {
    t: title,
    y: year,
    type: 'movie',
    tomatoes: 'true',
    plot: 'short',
  }
  let res = yield axios.get(OMDB_URL, {params})
  let movie = res.data
  let ratings = [
    (parseInt(movie.Metascore) / 10),
    parseFloat(movie.imdbRating),
    parseFloat(movie.tomatoRating)
  ].filter(x => !isNaN(x))
  let avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length
  this.body = {
    rating: isNaN(avgRating) ? null : avgRating,
    poster: movie.Poster === 'N/A' ? null : movie.Poster,
  }
}

function *fakeMovies() {
  const fs = require('fs')
  let data = yield new Promise(resolve => {
    fs.readFile('gracenote-response.json', (err, data) => resolve(data))
  })
  let movies = JSON.parse(data)
  this.body = convertMovies(movies)
}

function *fakeRatingAndPoster() {
  yield new Promise(resolve => setTimeout(resolve, 400))
  this.body = {
    rating: Math.floor(Math.random() * 1000) / 100,
    poster: 'https://images-na.ssl-images-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_SX300.jpg'
  }
}

// Simplify the content that you get from the Gracenote API.
function convertMovies(movies) {
  let result = movies.map(movie => {
    let showtime = movie.showtimes[0]
    let time = moment(showtime.dateTime).format('h:mm A')
    return {
      title: movie.title,
      year: movie.releaseYear,
      genres: movie.genres,
      rating: null,
      poster: null,
      showtime: {
        time,
        venue: showtime.theatre.name
      },
    }
  })
  // Only return the first 12 movies to save time during demo.
  result = result.slice(0, 12)
  return result
}

app.use(serve('.'))

app.listen(8000)
