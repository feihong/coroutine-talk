const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

let fileNames = ['a.txt', 'b.txt', 'c.txt']

function *writeFiles() {
  for (let i=0; i < fileNames.length; i++) {
    console.log(i + ' foobar')
    yield fs.writeFileAsync(fileNames[i], i + ' foobar')
    yield Promise.delay(1000)
  }
  console.log('Done!')
}

let generator = writeFiles()

function handleGeneratorResult(result) {
  if (result.done) {
    console.log('Generator has no more values to process!')
  } else {
    let promise = result.value
    promise.then(() => {
      let newResult = generator.next()
      handleGeneratorResult(newResult)
    })
  }
}

handleGeneratorResult(generator.next())
