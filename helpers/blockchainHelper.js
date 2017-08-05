const config = require('config')

module.exports = function (app) {
  var Web3 = app.Web3
  var generateErrorResponse = app.generateErrorResponse

  app.configureWeb3 = configureWeb3
  app.getTxCallBack = getTxCallBack

  function configureWeb3 (cb) {
    var web3
    if (typeof web3 !== 'undefined') web3 = new Web3(web3.currentProvider)
    else web3 = new Web3(new Web3.providers.HttpProvider(config.get('ethereum.rpc')))

    if (!web3.isConnected()) return cb({code: 500, title: 'Error', message: 'check RPC'}, web3)

    cb(null, web3)
  }

  function getTxCallBack (txHash, response) {
    configureWeb3(function (err, web3) {
      configureWeb3Response(err, web3, txHash, response)
    })
  };

  function configureWeb3Response (err, web3, txHash, response) {
    if (err) return generateErrorResponse(response, err)

    web3.eth.getTransaction(txHash, function (err, txDetails) {
      getTransactionResponse(err, txDetails, response)
    })
  }

  function getTransactionResponse (err, txDetails, response) {
	    if (err) {
      console.log('error response')
      return generateErrorResponse(response, err)
    }
	    if (!txDetails.blockNumber) return generateErrorResponse(response, {code: 500, title: 'Warning', message: 'Tx is not signed yet'})

	    response.send({
    		code: 200,
    		title: 'Success',
    		message: '0.5 ETH successfully sent'
    	})
  }
}
