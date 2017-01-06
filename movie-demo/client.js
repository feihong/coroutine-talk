$(document).ready(() => {
//=============================================================================

Promise.coroutine(function *() {
  let coords = yield getCurrentPosition()
  // console.log(coords)
  $('.location').text(`Your location is (${coords.latitude}, ${coords.longitude})`)
  let movies = yield $.getJSON('/movies', {lat: coords.latitude, lng: coords.longitude})
  console.log(movies)
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
