const fs = require('fs')

let fileNames = ['a.txt', 'b.txt', 'c.txt']

function writeFiles(index, fileNames) {
  if (fileNames.length === 0) { return }

  let fileName = fileNames.shift()
  fs.writeFile(fileName, index + ' foobar', () => {
    writeFiles(index + 1, fileNames)
  })
}

writeFiles(0, fileNames)
