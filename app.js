const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit')

const mapRoutes = require('express-routes-mapper')
const { routes } = require('./config')

const searchRouter = mapRoutes(
  routes.bookRoutes,
  '/controllers/'
)

const userRouter = mapRoutes(
  routes.userRoutes,
  '/controllers/'
)

/**
 * Limit API Request 15min ban, allow 100 request per 10 min
 * @type {rateLimit}
 */
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use(cookieParser())

app.use(limiter)
app.use('/books', searchRouter)
app.use('/page', userRouter)

module.exports = app
