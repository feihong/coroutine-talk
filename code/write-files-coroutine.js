const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

let fileNames = ['a.txt', 'b.txt', 'c.txt']

Promise.coroutine(function *() {
  for (let i=0; i < fileNames.length; i++) {
    yield fs.writeFileAsync(fileNames[i], i + ' foobar')
    yield Promise.delay(1000)
  }
})()
