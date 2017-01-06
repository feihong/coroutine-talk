function *generatorFunction() {
  let array = ['a', 'b', 'c', 'd']
  for (let x of array) {
    yield x
  }
}

generator = generatorFunction()

while (true) {
  let result = generator.next()
  if (result.done) {
    break
  }
  console.log(result.value)
}
