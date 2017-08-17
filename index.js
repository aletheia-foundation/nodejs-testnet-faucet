const express = require('express')
const fs = require('fs')
const https = require('https')
const bodyParser = require('body-parser')
const querystring = require('querystring')
const session = require('express-session')
const config = require('config')
const winston = require('winston')
const expressWinston = require('express-winston')

global.P = global.Promise = require('bluebird')

const app = express()
app.fs = fs
app.https = https
app.querystring = querystring

winston.level = 'verbose'
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    })
  ],
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) {
    if (req.method === 'GET' && req.path.startsWith('/assets')) {
      return true
    }
  }
}))

app.use(express.static(__dirname + '/public'))
app.use(session({
  secret: config.get('sessionSecret'),
  resave: true,
  saveUninitialized: false
}))

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

require('./controllers/index')(app)
require('./controllers/captcha')(app)
require('./controllers/getTxCallBack')(app)

app.get('/', function (request, response) {
  response.send('test network faucet')
})

app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), function () {
  console.log('test network faucet is running on port', app.get('port'))
})
