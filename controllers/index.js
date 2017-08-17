const config = require('config')
const blockchainHelper = require('../helpers/blockchain-helper')
const responseHelper = require('../helpers/response-helper')

module.exports = function (app) {
  app.post('/', function (request, response) {
    if (config.get('validateCaptcha')) {
      return validateCaptcha(request, response)
    }
    var receiver = request.body.receiver

    return blockchainHelper.sendEthTo({
      from: config.get('ethereum.account'),
      to: receiver,
      amountInEther: config.get('ethereum.etherToTransfer')
    })
    .then((hash) => {
      var successResponse = {
        code: 200,
        title: 'Success',
        message: 'Tx is posted to blockchain',
        txHash: hash
      }
      response.send({ success: successResponse })
    })
    .catch((err) => {
      console.log(err)
      return responseHelper.sendError(response, {message: 'Error sending transaction'})
    })
  })

  function validateCaptcha (request, response) {
    var recaptureResponse = request.body['captcha']
    if (!recaptureResponse || request.session.captcha !== recaptureResponse) {
      return responseHelper.sendError(response, {code: 500, title: 'Error', message: 'Invalid captcha'})
    }
  }
}
