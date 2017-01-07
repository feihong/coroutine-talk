# Live Coding Notes

## Starting code

```javascript
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

let fileNames = ['a.txt', 'b.txt', 'c.txt']

function *writeFiles() {
  for (let i=0; i < fileNames.length; i++) {
    console.log(i + ' foobar')
    yield fs.writeFileAsync(fileNames[i], i + ' foobar')
    console.log(i + ' sleep')
    yield Promise.delay(1000)
  }
  console.log('Done!')
}

let generator = writeFiles()
```

## Iterate through generator

```javascript
for (let promise of generator) {
  console.log(promise)
}
```

## Chain

```javascript
let promise = generator.next().value
promise.then(() => {
  let promise = generator.next().value
})
```

## Nested chaining

```javascript
function getNextPromise() {
  return generator.next().value
}

getNextPromise().then(() => {
  getNextPromise().then(() => {
    getNextPromise().then(() => {
      getNextPromise().then(() => {
        getNextPromise().then(() => {
          getNextPromise().then(() => {
            getNextPromise()
          })
        })
      })
    })
  })
})
```