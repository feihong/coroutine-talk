const fs = require('fs')

let fileNames = ['a.txt', 'b.txt', 'c.txt', 'd.txt']
for (let i=0; i < fileNames.length; i++) {
  let text = fs.readFileSync(fileNames[i], 'utf8')
  console.log(`${i+1}. ${text}`)
}
