const co = require('co')
const fs = require('fs-promise')
const bluebird = require('bluebird')

let fileNames = ['a.txt', 'b.txt', 'c.txt']

co(function *() {
  for (let i=0; i < fileNames.length; i++) {
    console.log(i + ' foobar')
    yield fs.writeFile(fileNames[i], i + ' foobar')
    yield bluebird.delay(1000)
  }
  console.log('Done!')
})
