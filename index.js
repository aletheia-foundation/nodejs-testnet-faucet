var express = require('express')
var fs = require('fs')
var https = require('https')
var bodyParser = require('body-parser')
var querystring = require('querystring')
var session = require('express-session')
var config = require('config')
global.P = global.Promise = require('bluebird')

var app = express()
app.fs = fs
app.https = https
app.querystring = querystring

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
