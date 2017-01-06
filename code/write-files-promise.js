const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

let fileNames = ['a.txt', 'b.txt', 'c.txt']

Promise.each(fileNames, (fileName, i) => {
  console.log(i + ' foobar')
  return fs.writeFileAsync(fileName, i + ' foobar').delay(1000)
})
.then(() => console.log('Done!'))
