# Live Coding Notes

## Starting code

```javascript
const bluebird = require('bluebird')
const fs = require('fs-promise')

let fileNames = ['a.txt', 'b.txt', 'c.txt', 'd.txt']

function *readFiles() {
  for (let i=0; i < fileNames.length; i++) {
    let text = yield fs.readFile(fileNames[i], 'utf8')
    console.log(`${i+1}. ${text}`)
    yield bluebird.delay(1000)
    console.log('slept')
  }
  console.log('Done!')
}

let generator = readFiles()
```

## Get the first promise

```javascript
let promise = generator.next().value
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
promise.then(newValue => {
  let promise = generator.next(newValue).value
})
```

## Nested chaining

```javascript
function getNextPromise(newValue) {
  return generator.next(newValue).value
}

getNextPromise().then(val =>
  getNextPromise(val).then(val =>
    getNextPromise(val).then(val =>
      getNextPromise(val).then(val =>
        getNextPromise(val).then(val =>
          getNextPromise(val).then(val =>
            getNextPromise(val).then(val =>
              getNextPromise(val).then(val =>
                getNextPromise(val)
              )
            )
          )
        )
      )
    )
  )
)
```

## Self-calling function

```javascript
function getNextPromise(newValue) {
  let promise = generator.next(newValue).value
  promise.then(newValue => getNextPromise(newValue))
}

getNextPromise()
```

## Handle the base case

```javascript
function getNextPromise(newValue) {
  let promise = generator.next(newValue).value
  if (promise === undefined) {
    console.log('The generator is out of promises!')
  } else {
    promise.then(newValue => getNextPromise(newValue))
  }
}

getNextPromise()
```

## Minor refinements

```javascript
function handleNextPromise(newValue) {
  let promise = generator.next(newValue).value
  if (promise !== undefined) {
    promise.then(newValue => handleNextPromise(newValue))
  }
}

handleNextPromise()
```

## Create a custom coroutine() function

```javascript
function coroutine(generatorFunction) {
  let generator = generatorFunction()

  function handleNextPromise(newValue) {
    let promise = generator.next(newValue).value
    if (promise !== undefined) {
      promise.then(newValue => handleNextPromise(newValue))
    }
  }

  handleNextPromise()
}
```
