const koa = require('koa')
const serve = require('koa-static')
const app = koa()

app.use(function *(){
  this.body = 'Hello World'
})

app.use(serve('.'))

app.listen(8000)
