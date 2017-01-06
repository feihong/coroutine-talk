$(document).ready(() => {
//=============================================================================

Promise.coroutine(function *() {
  let coords = yield getCurrentPosition()
  // console.log(coords)
  $('.location').text(`Your location is (${coords.latitude}, ${coords.longitude})`)
  let movies = yield $.getJSON('/movies', {lat: coords.latitude, lng: coords.longitude})
  console.log(movies[0])
  for (let movie of movies) {
    let data = yield $.getJSON(
      '/rating', {title: movie.title, year: movie.year})
    movie.rating = data.rating
  }
  movies.sort((a, b) => b.rating - a.rating)
  for (let movie of movies) {
    $(`<div>
        <strong>${movie.title}</strong>,
        rating: ${movie.rating},
        next showtime: ${movie.showtime.time} at ${movie.showtime.venue}
      </div>`).appendTo('.movies')
  }

  let top10 = movies.slice(0, 10)
  for (let movie of top10) {
    speak(movie.title)
  }
})()

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position.coords),
      error => reject(error)
    )
  })
}

function speak(text) {
  if (window.speechSynthesis === undefined) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    let utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
    utterance.onend = resolve
  })
}

//=============================================================================
})
