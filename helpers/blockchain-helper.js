const config = require('config')
const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx')
const log = require('winston')

var web3

module.exports = {
  configureWeb3: function configureWeb3 () {
    return new P((resolve, reject) => {
      if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider)
      } else {
        web3 = new Web3(new Web3.providers.HttpProvider(config.get('ethereum.rpc')))
      }
      if (!web3.isConnected()) return reject({code: 500, title: 'Error', message: 'unable to connect to ethereum rpc'})
      return resolve(web3)
    })
  },
  getTxCallBack: function getTxCallBack (txHash) {
    return this.configureWeb3().then((web3) => {
      return new P((resolve, reject) => {
        web3.eth.getTransaction(txHash, (err, txDetails) => {
          if (err) {
            return reject(err)
          }
          log.debug('getTransaction done', txDetails)
          if (!txDetails.blockNumber) {
            log.log('transaction is not mined yet', txDetails)
            return resolve(false)
          }
          return resolve(true)
        })
      })
    })
  },
  sendEthTo: function sendEthTo ({to, amountInEther}) {
    return this.configureWeb3().then((web3) => {
      return new P((resolve, reject) => {
        if (!web3.isAddress(to)) {
          return reject({code: 500, title: 'Error', message: 'invalid address'})
        }

        const senderPrivateKey = config.get('ethereum.privateKey')
        const privateKeyHex = Buffer.from(senderPrivateKey, 'hex')

        const fromAccount = config.get('ethereum.account')
        const gasPrice = parseInt(web3.eth.gasPrice);
        const gasPriceHex = web3.toHex(gasPrice);
        const amount = parseInt(web3.toWei(amountInEther, 'ether'))
        const nonce = web3.eth.getTransactionCount(fromAccount);
        const nonceHex = web3.toHex(nonce);
        const rawTx = {
          nonce: nonceHex,
          gasPrice: gasPriceHex,
          gasLimit: config.get('ethereum.gasLimit'),
          to: to,
          value: web3.toHex(amount),
          data: '0x00',
          chainId: web3.toHex(web3.version.network)
        };

        var tx = new EthereumTx(rawTx);
        tx.sign(privateKeyHex);

        var serializedTx = tx.serialize();

        log.verbose(`sending ${rawTx.value} wei from ${fromAccount} to ${rawTx.to} on chain ${rawTx.chainId}`)

        web3.eth.sendRawTransaction("0x" + serializedTx.toString('hex'), function(err, hash) {
          if (err) {
            return reject(err)
          }
          return resolve(hash)
        })
      })
    })
  }
}
