const co = require('co')
const fs = require('fs-promise')
const bluebird = require('bluebird')

let fileNames = ['a.txt', 'b.txt', 'c.txt', 'd.txt']

co(function *() {
  for (let i=0; i < fileNames.length; i++) {
    let text = yield fs.readFile(fileNames[i], 'utf8')
    console.log(`${i+1}. ${text}`)
    yield bluebird.delay(1000)
  }
  console.log('Done!')
})
