const fs = require('fs')

let fileNames = ['1.txt', '2.txt', '3.txt']
for (let name of fileNames) {
  fs.writeFileSync(name, name + ' foobar')
}
