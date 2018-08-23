const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mapRoutes = require('express-routes-mapper')
const { routes } = require('./config')

const booksRouter = mapRoutes(
  routes.bookRoutes,
  '/controllers/'
)

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use(cookieParser())

app.use('/books', booksRouter)
app.use((err, req, res, next) => {
  if (err.status === 400) { return res.status(err.status).send('Incorrect JSON...') }
  return next(err)
})
module.exports = app
