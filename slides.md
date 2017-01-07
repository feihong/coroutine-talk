# Coroutines in JavaScript

### Feihong Hsu
### github.com/feihong

---
# This talk is on GitHub

https://github.com/feihong/coroutine-talk

---
# Summary

- Simple coroutine example
- Overview of generators
- Live code a coroutine function
- Show more complex coroutine example

---
# What are coroutines?

- Control flow for asynchronous code that doesn't use callbacks
- Implemented using promises and generators
- Will become official language feature with the introduction of async/await syntax

---
# A simple example: writing 3 files

- Sequentially write to three files
- Four different types of control flow:
  - Synchronous
  - Callback
  - Promise
  - Coroutine

---
# Synchronous

```javascript
const fs = require('fs')

let fileNames = ['a.txt', 'b.txt', 'c.txt']
for (let i=0; i < fileNames.length; i++) {
  fs.writeFileSync(fileNames[i], i + ' foobar')
}
```

---
# Callback

```javascript
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
```

---
# Promise

```javascript
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

let fileNames = ['a.txt', 'b.txt', 'c.txt']

Promise.each(fileNames, (fileName, i) => {
  console.log(i + ' foobar')
  return fs.writeFileAsync(fileName, i + ' foobar').delay(1000)
})
.then(() => console.log('Done!'))
```

---
# Coroutine

```javascript
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

let fileNames = ['a.txt', 'b.txt', 'c.txt']

Promise.coroutine(function *() {
  for (let i=0; i < fileNames.length; i++) {
    console.log(i + ' foobar')
    yield fs.writeFileAsync(fileNames[i], i + ' foobar')
    yield Promise.delay(1000)
  }
  console.log('Done!')
})()
```

---
# What is a generator function?


---
# Generator functions can "return" multiple times

```javascript
function *generatorFunction() {
  let array = ['a', 'b', 'c', 'd']
  for (let x of array) {
    yield x
  }
}
```

---
# Generator functions return a generator

```javascript
generator = generatorFunction()

console.log('First for loop:')
for (let x of generator) {
  console.log(x)
}
```

---
# Once generators are done, they can't be iterated anymore

```javascript
generator = generatorFunction()

console.log('First for loop:')
for (let x of generator) {
  console.log(x)
}

// Generator is done, so nothing will be printed.
console.log('Second for loop:')
for (let x of generator) {
  console.log(x)
}
```

---
# Alternate method of iterating over generator

```javascript
generator = generatorFunction()

while (true) {
  let result = generator.next()
  if (result.done) {
    break
  }
  console.log(result.value)
}
```

---
# A generator function can take values from its caller

```javascript
function *generatorFunction() {
  let array = ['a', 'b', 'c', 'd']
  for (let x of array) {
    // Get value from caller.
    let value = yield x
    console.log('Inside generator function:', value)
  }
}
```

---
# Sending values into a generator

```javascript
generator = generatorFunction()

// Send values into the generator.
generator.next(1)       // first value is always ignored
generator.next(2)
generator.next(3)
generator.next(4)
generator.next(5)
// Generator is done, sending additional values won't do anything.
generator.next(6)
generator.next(7)
```