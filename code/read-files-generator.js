const bluebird = require('bluebird')
const fs = require('fs-promise')

let fileNames = ['a.txt', 'b.txt', 'c.txt', 'd.txt']

function *readFiles() {
  for (let i=0; i < fileNames.length; i++) {
    let text = yield fs.readFile(fileNames[i], 'utf8')
    console.log(`${i+1}. ${text}`)
    yield bluebird.delay(1000)
    console.log('slept')
  }
  console.log('Done!')
}

let generator = readFiles()

function handleNextPromise(value) {
  let promise = generator.next(value).value
  if (promise !== undefined) {
    promise.then(newValue => handleNextPromise(newValue))
  }
}

handleNextPromise()
