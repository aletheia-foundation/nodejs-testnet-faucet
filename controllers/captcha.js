const svgCaptcha = require('svg-captcha')

module.exports = function (app) {
  app.get('/captcha.svg', function (req, res) {
    const captcha = svgCaptcha.create()
    req.session.captcha = captcha.text

    res.set('Content-Type', 'image/svg+xml')
    res.status(200).send(captcha.data)
  })
}
