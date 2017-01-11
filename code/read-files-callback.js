const fs = require('fs')

let fileNames = ['a.txt', 'b.txt', 'c.txt', 'd.txt']

function readFiles(index, fileNames) {
  if (fileNames.length === 0) { return }

  let fileName = fileNames.shift()
  let text = fs.readFile(fileName, 'utf8', (err, text) => {
    console.log(`${index+1}. ${text}`)
    readFiles(index + 1, fileNames)
  })
}

readFiles(0, fileNames)
