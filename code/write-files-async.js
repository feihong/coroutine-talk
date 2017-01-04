const fs = require('fs')

let fileNames = ['1.txt', '2.txt', '3.txt']

function writeFiles(fileNames) {
  if (fileNames.length === 0) { return }
  var name = fileNames.shift()
  fs.writeFile(name, name + ' foobar', err => {
    writeFiles(fileNames)
  })
}

writeFiles(fileNames)
