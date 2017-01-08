const bluebird = require('bluebird')
const fs = require('fs-promise')

let fileNames = ['a.txt', 'b.txt', 'c.txt']

function *writeFiles() {
  for (let i=0; i < fileNames.length; i++) {
    console.log(i + ' foobar')
    yield fs.writeFile(fileNames[i], i + ' foobar')
    console.log(i + ' sleep')
    yield bluebird.delay(1000)
  }
  console.log('Done!')
}

let generator = writeFiles()
