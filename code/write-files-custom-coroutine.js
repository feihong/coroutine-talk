const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

let fileNames = ['a.txt', 'b.txt', 'c.txt']

coroutine(function *writeFiles() {
  for (let i=0; i < fileNames.length; i++) {
    console.log(i + ' foobar')
    yield fs.writeFileAsync(fileNames[i], i + ' foobar')
    console.log(i + ' sleep')
    yield Promise.delay(1000)
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
