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

getNextPromise().then(() =>
  getNextPromise().then(() =>
    getNextPromise().then(() =>
      getNextPromise().then(() =>
        getNextPromise().then(() =>
          getNextPromise().then(() =>
            getNextPromise()
          )
        )
      )
    )
  )
)
```

## Self-calling function

```javascript
function getNextPromise() {
  let promise = generator.next().value
  promise.then(() => getNextPromise())
}

getNextPromise()
```

## Handle the base case

```javascript
function getNextPromise() {
  let promise = generator.next().value
  if (promise === undefined) {
    console.log('The generator is out of promises!')
  } else {
    promise.then(() => getNextPromise())
  }
}

getNextPromise()
```

## Minor refinements

```javascript
function handleNextPromise() {
  let promise = generator.next().value
  if (promise !== undefined) {
    promise.then(handleNextPromise)
  }
}

handleNextPromise()
```

## Create a custom coroutine() function

```javascript
function coroutine(generatorFunction) {
  let generator = generatorFunction()

  function handleNextPromise() {
    let promise = generator.next().value
    if (promise !== undefined) {
      promise.then(handleNextPromise)
    }
  }

  handleNextPromise()
}
```
