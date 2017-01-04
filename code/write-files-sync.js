const fs = require('fs')

let fileNames = ['a.txt', 'b.txt', 'c.txt']
for (let i=0; i < fileNames.length; i++) {
  fs.writeFileSync(fileNames[i], i + ' foobar')
}
