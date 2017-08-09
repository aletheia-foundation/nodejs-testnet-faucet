const blockchainHelper = require('../helpers/blockchain-helper')
const responseHelper = require('../helpers/response-helper')
module.exports = function (app) {
  var getTxCallBack = app.getTxCallBack

  app.post('/getTxCallBack', function (request, response) {
    var txHash = request.body.txHash
    return blockchainHelper.getTxCallBack(txHash)
    .then(() => {
      console.log('sending success')
      response.send({
        code: 200,
        title: 'Success',
        message: '0.5 ETH successfully sent'
      })
    })
    .catch((err) => {
      responseHelper.sendError(err)
    })
  })
}
