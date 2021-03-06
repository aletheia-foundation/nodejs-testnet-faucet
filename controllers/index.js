const config = require('config')
const blockchainHelper = require('../helpers/blockchain-helper')
const responseHelper = require('../helpers/response-helper')
const log = require('winston')

module.exports = function (app) {
  app.post('/', function (request, response) {
    if (config.get('validateCaptcha') && !isCaptchaValid(request)) {
      return responseHelper.sendError(response, {code: 500, title: 'Error', message: 'Invalid captcha'})
    }
    request.session.captcha = ''
    const receiver = request.body.receiver
    return blockchainHelper.sendEthTo({
      from: config.get('ethereum.account'),
      to: receiver,
      amountInEther: config.get('ethereum.etherToTransfer')
    })
    .then((hash) => {
      const successResponse = {
        code: 200,
        title: 'Success',
        message: 'Tx is posted to blockchain',
        txHash: hash
      }
      response.send({ success: successResponse })
    })
    .catch((err) => {
      log.error('Error sending transaction', err)
      return responseHelper.sendError(response, {message: 'Error sending transaction'})
    })
  })
}

function isCaptchaValid (request) {
  const recaptureResponse = request.body['captcha']
  return recaptureResponse && request.session.captcha === recaptureResponse
}
