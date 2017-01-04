const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

let fileNames = ['1.txt', '2.txt', '3.txt']
Promise.each(fileNames, name => {
  return fs.writeFileAsync(name, name + ' foobar').delay(1000)
})
