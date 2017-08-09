const config = require('config')
const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx')

module.exports = {
  configureWeb3: function configureWeb3 () {
    return new P((resolve, reject) => {
      var web3
      if (typeof web3 !== 'undefined') web3 = new Web3(web3.currentProvider)
      else web3 = new Web3(new Web3.providers.HttpProvider(config.get('ethereum.rpc')))

      if (!web3.isConnected()) return reject({code: 500, title: 'Error', message: 'check RPC'}, web3)

      return resolve(web3)
    })
  },
  getTxCallBack: function getTxCallBack (txHash) {
    return this.configureWeb3().then((web3) => {
      return new P((resolve, reject) => {
        web3.eth.getTransaction(txHash, function (err, txDetails) {
          if (err) {
            return reject(err)
          }
          if (!txDetails.blockNumber) {
            return reject({code: 500, title: 'Warning', message: 'Tx is not signed yet'})
          }
          return resolve()
        })
      })
    })
  },
  sendEthTo: function sendEthTo ({from, to, amountInEther}) {
    return this.configureWeb3().then((web3) => {
      return new P((resolve, reject) => {
        var senderPrivateKey = config.get('ethereum.privateKey')
        const privateKeyHex = Buffer.from(senderPrivateKey, 'hex')
        if (!web3.isAddress(to)) {
          return reject({code: 500, title: 'Error', message: 'invalid address'})
        }

        var gasPrice = parseInt(web3.eth.gasPrice)
        var gasPriceHex = web3.toHex(gasPrice)
        var amountInWei = parseInt(web3.toWei(amountInEther, 'ether'))
        var nonce = web3.eth.getTransactionCount(config.get('ethereum.account'))
        var nonceHex = web3.toHex(nonce)
        const rawTx = {
          nonce: nonceHex,
          gasPrice: gasPriceHex,
          gasLimit: config.get('ethereum.gasLimit'),
          to: to,
          value: web3.toHex(amountInWei),
          data: '0x00',
          chainId: web3.toHex(web3.version.network)
        }

        var tx = new EthereumTx(rawTx)
        tx.sign(privateKeyHex)

        var serializedTx = tx.serialize()

        web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
          if (err) {
            return reject(err)
          }
          return resolve(hash)
        })
      })
    })
  }
}
