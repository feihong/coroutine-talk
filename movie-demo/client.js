(function() {
//=============================================================================

const main = co.wrap(function *() {
  let coords
  try {
    coords = yield getCurrentPosition()
    this.location = `Your location is (${coords.latitude}, ${coords.longitude})`
  } catch (err) {
    this.location = `Could not get location: ${err}`
    return
  }

  this.status = 'Fetching movies...'
  this.movies = yield $.getJSON(
    '/movies', {lat: coords.latitude, lng: coords.longitude})

  this.status = 'Fetching ratings and posters...'
  for (let movie of this.movies) {
    this.status = `Fetching rating and poster for ${movie.title}`
    let data = yield $.getJSON(
      '/rating', {title: movie.title, year: movie.year})
    movie.rating = data.rating
    movie.poster = data.poster

    this.progressValue++
  }

  // All rating data has been downloaded, so sort movies by rating, descending.
  this.movies.sort((a, b) => b.rating - a.rating)

  this.status = 'Announcing top 5 rated movies...'
  let top5 = this.movies.slice(0, 5)
  try {
    for (let movie of top5) {
      speak(`${movie.title}, playing ${movie.showtime.time} at ${movie.showtime.venue}`)
    }
  } catch (err) {
    console.log(`Unable to speak: ${err}`)
  }

  this.status = ''
})

const app = new Vue({
  el: '#app',
  data: {
    location: '',
    status: '',
    progressValue: 0,
    movies: [],
  },
  created: main
})

function getCurrentPosition() {
  if (navigator.geolocation === undefined) {
    return Promise.reject(new Error('Geolocation is not available'))
  }
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position.coords),
      error => reject(error)
    )
  })
}


function speak(text) {
  if (window.speechSynthesis === undefined) {
    return Promise.reject(new Error('Speech synthesis is not available'))
  }

  return new Promise((resolve, reject) => {
    let utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
    utterance.onend = resolve
  })
}

//=============================================================================
})()
