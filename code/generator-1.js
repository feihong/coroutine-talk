function *generatorFunction() {
  let array = ['a', 'b', 'c', 'd']
  for (let x of array) {
    yield x
  }
}

generator = generatorFunction()

console.log('First for loop:')
for (let x of generator) {
  console.log(x)
}

// Try to print out an exhausted generator (nothing will come out).
console.log('Second for loop:')
for (let x of generator) {
  console.log(x)
}
