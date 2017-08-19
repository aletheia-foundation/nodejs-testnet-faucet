const config = require('config')
const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx')
const log = require('winston')

module.exports = {
  configureWeb3: function configureWeb3 () {
    return new P((resolve, reject) => {
      const web3
      if (typeof web3 !== 'undefined') web3 = new Web3(web3.currentProvider)
      else web3 = new Web3(new Web3.providers.HttpProvider(config.get('ethereum.rpc')))
      if (!web3.isConnected()) return reject({code: 500, title: 'Error', message: 'unable to connect to ethereum rpc'})
      return resolve(web3)
    })
  },
  getTxCallBack: function getTxCallBack (txHash) {
    return this.configureWeb3().then((web3) => {
      return new P((resolve, reject) => {
        web3.eth.getTransaction(txHash, (err, txDetails) => {
          log.debug('getTransaction done', txDetails)
          if (err) {
            return reject(err)
          }
          if (!txDetails.blockNumber) {
            return reject({code: 500, title: 'Warning', message: 'Tx is not signed yet', txDetails})
          }
          return resolve()
        })
      })
    })
  },
  sendEthTo: function sendEthTo ({from, to, amountInEther}) {
    return this.configureWeb3().then((web3) => {
      return new P((resolve, reject) => {
        if (!web3.isAddress(to)) {
          return reject({code: 500, title: 'Error', message: 'invalid address'})
        }
        const gasPrice = parseInt(web3.eth.gasPrice)
        const txArgs = {
          from: config.get('ethereum.account'),
          to: to,
          value: parseInt(web3.toWei(amountInEther, 'ether')),
          gasLimit: config.get('ethereum.gasLimit'),
          gasPrice: gasPrice
        }
        log.verbose(`sending ${txArgs.value} wei from ${txArgs.from} to ${txArgs.to}`)
        web3.eth.sendTransaction(txArgs, (err, hash) => {
          if (err) {
            return reject(err)
          }
          return resolve(hash)
        })
      })
    })
  }
}
