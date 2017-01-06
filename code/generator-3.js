function *generatorFunction() {
  let array = ['a', 'b', 'c', 'd']
  for (let x of array) {
    // Get value from caller.
    let value = yield x
    console.log('Inside generator function:', value)
  }
}

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
