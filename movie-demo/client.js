$(document).ready(() => {
//=============================================================================

co(function *() {
  let coords
  try {
    coords = yield getCurrentPosition()
    $('.location').text(`Your location is (${coords.latitude}, ${coords.longitude})`)
  } catch (err) {
    $('.location').text(`Could not get location: ${err}`)
    return
  }

  let movies = yield $.getJSON('/movies', {lat: coords.latitude, lng: coords.longitude})
  for (let movie of movies) {
    let data = yield $.getJSON(
      '/rating', {title: movie.title, year: movie.year})
    movie.rating = data.rating
  }
  movies.sort((a, b) => b.rating - a.rating)

  for (let movie of movies) {
    $(`<div>
        <strong>${movie.title}</strong>,
        rating: ${movie.rating.toFixed(1)},
        next showtime: ${movie.showtime.time} at ${movie.showtime.venue}
      </div>`).appendTo('.movies')
  }

  try {
    let top5 = movies.slice(0, 5)
    for (let movie of top5) {
      speak(`${movie.title}, playing ${movie.showtime.time} at ${movie.showtime.venue}`)
    }
  } catch (err) {
    console.log(`Unable to speak: ${err}`)
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
})
