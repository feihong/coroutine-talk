const bluebird = require('bluebird')
const fs = require('fs-promise')

let fileNames = ['a.txt', 'b.txt', 'c.txt']

bluebird.each(fileNames, (fileName, i) => {
  console.log(i + ' foobar')
  return fs.writeFile(fileName, i + ' foobar')
  .then(() => bluebird.delay(1000))
})
.then(() => console.log('Done!'))
