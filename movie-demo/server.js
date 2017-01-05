const koa = require('koa')
const serve = require('koa-static')
const route = require('koa-route')
const app = koa()


const GRACENOTE_API_KEY = process.env.GRACENOTE_API_KEY


app.use(route.get('/movies/', movies))
app.use(route.get('/ratings/', ratings))

function *movies() {
  this.body = ["a", "b", "c"]
}

function *ratings() {
  this.body = ["a", "b", "c"]
}

app.use(serve('.'))

app.listen(8000)
