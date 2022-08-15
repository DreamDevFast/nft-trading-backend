const Transaction = require('./models/transaction.model')
const Web3 = require('web3')
const env = require('./env')
const web3 = new Web3(new Web3.providers.HttpProvider(env.API_KEY))

function run() {
  setInterval(sendValidableTransaction, 10 * 1000)
}

function sendValidableTransaction() {
  let currentTime = new Date()
  Transaction.find({
    time: {
      $gte: new Date(currentTime - 10 * 1000),
      $lte: new Date(currentTime + 10 * 1000),
    },
    status: 'pending',
    monitorMethod: 'time',
  }).then(async (trans) => {
    for (let i = 0; i < trans.length; i++) {
      let {
        account,
        to,
        gasLimit,
        maxPriorityFeePerGas,
        value,
        data,
        privateKey,
      } = trans[i]

      const nonce = await web3.eth.getTransactionCount(account, 'latest')
      const tx = {
        from: account,
        to,
        nonce: nonce,
        gasLimit,
        maxPriorityFeePerGas,
        value,
        data,
      }
      const signPromise = web3.eth.accounts.signTransaction(tx, privateKey)
      signPromise
        .then(async (signedTx) => {
          try {
            let hash
            await web3.eth
              .sendSignedTransaction(signedTx.rawTransaction)
              .on('error', async function (err) {
                console.log(
                  'Something went wrong when submitting your transaction.\n' +
                    err,
                )
                trans[i].time = new Date()
                trans[i].status = 'send error'
                trans[i].transactionHash = hash
                await trans[i].save()
              })
              .on('receipt', async function (receipt) {
                console.log(
                  'The hash of your transaction is: \n' +
                    hash +
                    "\nCheck etherscan's Mempool to view the status of your transaction!",
                )
                trans[i].time = new Date()
                trans[i].status = 'send complete'
                trans[i].transactionHash = hash
                await trans[i].save()
              })
              .on('transactionHash', function (txHash) {
                hash = txHash.toString()
              })
          } catch (e) {}
        })
        .catch(console.log)
    }
  })
}
/*

*/
module.exports = {
  run,
  sendValidableTransaction,
}
