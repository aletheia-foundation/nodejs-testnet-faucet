const blockchainHelper = require('../helpers/blockchain-helper')
const responseHelper = require('../helpers/response-helper')
const log = require('winston')

module.exports = function (app) {
  var getTxCallBack = app.getTxCallBack

  app.post('/getTxCallBack', function (request, response) {
    var txHash = request.body.txHash
    return blockchainHelper.getTxCallBack(txHash)
    .then((isMined) => {
      if (isMined) {
        response.send({
          code: 200,
          title: 'Success',
          message: '0.5 ETH successfully sent'
        })
      } else {
        response.status(302).send({
          code: 302,
          message: 'Transaction is not mined yet'
        })
      }
    })
    .catch((err) => {
      log.error(err)
      responseHelper.sendError(response, {
        message: 'Error reading transaction status please reload the page and try again'
      })
    })
  })
}
