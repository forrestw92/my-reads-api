const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit')

const mapRoutes = require('express-routes-mapper')
const routes = require('./config/routes')
const auth = require('./policies/auth.policy')
const bookRouter = mapRoutes(
  routes.bookRoutes,
  '/controllers/'
)

const tokenRouter = mapRoutes(
  routes.tokenRoutes,
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
const corsOptions = {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
    methods: ['GET', 'PUT', 'POST', 'OPTIONS'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use(cookieParser())

app.use(limiter)
app.all('/books/*', (req, res, next) => auth(req, res, next))

app.use('/books', bookRouter)
app.use('/token', tokenRouter)

module.exports = app
