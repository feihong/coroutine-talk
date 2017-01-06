(function() {
//=============================================================================

const main = co.wrap(function *(app) {
  let coords
  try {
    coords = yield getCurrentPosition()
    app.location = `Your location is (${coords.latitude}, ${coords.longitude})`
  } catch (err) {
    app.location = `Could not get location: ${err}`
    return
  }

  app.status = 'Fetching movies...'
  app.movies = yield $.getJSON('/movies', {lat: coords.latitude, lng: coords.longitude})

  app.status = 'Fetching ratings and posters...'
  let movies = [...app.movies]
  for (let movie of movies) {
    app.status = `Fetching rating and poster for ${movie.title}`
    let data = yield $.getJSON(
      '/rating', {title: movie.title, year: movie.year})
    // if (data.rating === null) {
    //   console.log(movie.title, data)
    // }
    movie.rating = data.rating
    movie.poster = data.poster
  }

  // Sort movies by rating.
  app.movies.sort((a, b) => b.rating - a.rating)

  app.status = 'Announcing top 5 rated movies...'
  let top5 = app.movies.slice(0, 5)
  try {
    for (let movie of top5) {
      speak(`${movie.title}, playing ${movie.showtime.time} at ${movie.showtime.venue}`)
    }
  } catch (err) {
    console.log(`Unable to speak: ${err}`)
  }

  app.status = ''
})

const app = new Vue({
  el: '#app',
  data: {
    location: '',
    status: '',
    movies: [],
  },
  created() {
    main(this)
  }
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
