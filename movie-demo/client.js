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
    let dt = moment(movie.showtime)
    let time = dt.format('h:mm A')
    $(`<div>
        <strong>${movie.title}</strong>,
        rating: ${movie.rating},
        next showtime: ${time}
      </div>`).appendTo('.movies')
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

//=============================================================================
})
