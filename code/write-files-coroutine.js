const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

let fileNames = ['1.txt', '2.txt', '3.txt']

Promise.coroutine(function *() {
  for (let name of fileNames) {
    yield fs.writeFileAsync(name, name + ' foobar')
    yield Promise.delay(1000)
  }
})()
