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

- Asynchronous control flow without callbacks
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
const bluebird = require('bluebird')
const fs = require('fs-promise')

let fileNames = ['a.txt', 'b.txt', 'c.txt']

bluebird.each(fileNames, (fileName, i) => {
  console.log(i + ' foobar')
  return fs.writeFile(fileName, i + ' foobar')
  .then(() => bluebird.delay(1000))
})
.then(() => console.log('Done!'))
```

---
# Coroutine

```javascript
const co = require('co')
const fs = require('fs-promise')
const bluebird = require('bluebird')

let fileNames = ['a.txt', 'b.txt', 'c.txt']

co(function *() {
  for (let i=0; i < fileNames.length; i++) {
    console.log(i + ' foobar')
    yield fs.writeFile(fileNames[i], i + ' foobar')
    yield bluebird.delay(1000)
  }
  console.log('Done!')
})
```

---
# What is a generator function?

- Defined using `function *()` syntax
- Body usually contains `yield` expressions
- Regardless of what value is `return`ed, invoking a generator function always returns a generator object

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
let generator = generatorFunction()

for (let x of generator) {
  console.log(x)
}
```

---
# Once generators are done, they can't be iterated anymore

```javascript
let generator = generatorFunction()

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
let generator = generatorFunction()

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
// Generator is done.
generator.next(6)       // ignored
generator.next(7)       // ignored
```

---
# Ways in which a generator function is not like a normal function

- Can produce multiple outputs
- Can take multiple inputs
- Control shifts back and forth between caller and callee

---
# How does the co() function work?

- Takes a generator function
- Invokes the generator function to get a generator
- Extracts promises from generator
- When promises are fulfilled, feeds those values back into generator
- A promise is `then`ed to the next promise to preserve execution order

---
# Live draw a diagram

You can view the final diagram here:

todo

---
# Live code a coroutine function

Let's use our simple example to iteratively create a function that executes coroutines.

---
# Starting point

```javascript
const bluebird = require('bluebird')
const fs = require('fs-promise')

let fileNames = ['a.txt', 'b.txt', 'c.txt']

function *writeFiles() {
  for (let i=0; i < fileNames.length; i++) {
    console.log(i + ' foobar')
    yield fs.writeFile(fileNames[i], i + ' foobar')
    console.log(i + ' sleep')
    yield bluebird.delay(1000)
  }
  console.log('Done!')
}

let generator = writeFiles()
```

---
# What our coroutine function is missing

- No type checking to make sure yielded objects are actually promises
- Does not pass values back into the generator
- Does not throw errors into generator (cannot use try/catch inside coroutine)

---
# A more complex coroutine example

Demonstrates how to

- Use `co.wrap()` to convert a generator function into a normal promise-returning function
- Wrap geolocation and speech synthesis APIs into promise-returning functions
- Use `jQuery.getJSON()` inside a coroutine
- Use coroutines with [Vue](https://vuejs.org/) framework

---
# Libraries for working with coroutines

- [co](https://github.com/tj/co)
- [koa](http://koajs.com/)
- [co-mocha](https://www.npmjs.com/package/co-mocha)
- [And many more...](https://github.com/tj/co/wiki)


---
# 完成

Questions?
