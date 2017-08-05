const config = require('config')

module.exports = function (app) {
  var EthereumTx = app.EthereumTx
  var generateErrorResponse = app.generateErrorResponse
  var configureWeb3 = app.configureWeb3

  app.post('/', function (request, response) {
    if (config.get('validateCaptcha')) {
      return validateCaptcha(request, response)
    }
    var receiver = request.body.receiver

    configureWeb3(function (err, web3) {
      configureWeb3Response(err, web3, receiver, response)
    })
  })

  function validateCaptcha (request, response) {
    var recaptureResponse = request.body['captcha']
    if (!recaptureResponse) return generateErrorResponse(response, {code: 500, title: 'Error', message: 'Invalid captcha'})

    if (request.session.captcha !== recaptureResponse) {
      return generateErrorResponse(response, {code: 500, title: 'Error', message: 'Invalid captcha'})
    }
  }

  function configureWeb3Response (err, web3, receiver, response) {
    if (err) return generateErrorResponse(response, err)

    var senderPrivateKey = config.get('ethereum.privateKey')
    const privateKeyHex = Buffer.from(senderPrivateKey, 'hex')
    if (!web3.isAddress(receiver)) return generateErrorResponse(response, {code: 500, title: 'Error', message: 'invalid address'})

    var gasPrice = parseInt(web3.eth.gasPrice)
    var gasPriceHex = web3.toHex(gasPrice)
    var amount = parseInt(web3.toWei(config.get('ethereum.etherToTransfer'), 'ether'))
    var nonce = web3.eth.getTransactionCount(config.get('ethereum.account'))
    var nonceHex = web3.toHex(nonce)
    const rawTx = {
		  nonce: nonceHex,
		  gasPrice: gasPriceHex,
		  gasLimit: config.get('ethereum.gasLimit'),
		  to: receiver,
		  value: web3.toHex(amount),
		  data: '0x00',
		  chainId: web3.toHex(web3.version.network)
    }

    var tx = new EthereumTx(rawTx)
    tx.sign(privateKeyHex)

    var serializedTx = tx.serialize()

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
      sendRawTransactionResponse(err, hash, response)
    })
  }

  function sendRawTransactionResponse (err, hash, response) {
    if (err) {
      return generateErrorResponse(response, {message: 'Error sending transaction'})
    }

    var successResponse = {
      code: 200,
      title: 'Success',
      message: 'Tx is posted to blockchain',
      txHash: hash
    }

	  	response.send({ success: successResponse })
  }
}
