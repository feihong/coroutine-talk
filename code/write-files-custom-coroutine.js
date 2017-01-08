const bluebird = require('bluebird')
const fs = require('fs-promise')

let fileNames = ['a.txt', 'b.txt', 'c.txt']

coroutine(function *writeFiles() {
  for (let i=0; i < fileNames.length; i++) {
    console.log(i + ' foobar')
    yield fs.writeFile(fileNames[i], i + ' foobar')
    console.log(i + ' sleep')
    yield bluebird.delay(1000)
  }
  console.log('Done!')
})

function coroutine(generatorFunction) {
  let generator = generatorFunction()

  function handleNextPromise() {
    let promise = generator.next().value
    if (promise !== undefined) {
      promise.then(handleNextPromise)
    }
  }

  handleNextPromise()
}
