const bluebird = require('bluebird')
const fs = require('fs-promise')

let fileNames = ['a.txt', 'b.txt', 'c.txt', 'd.txt']

bluebird.each(fileNames, (fileName, i) => {
  return fs.readFile(fileName, 'utf8')
  .then(text => {
    console.log(`${i+1}. ${text}`)
  })
  .then(() => bluebird.delay(1000))
})
.then(() => console.log('Done!'))
