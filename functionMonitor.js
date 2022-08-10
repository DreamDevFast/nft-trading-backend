const Web3 = require('web3')
const ethers = require('ethers')
const env = require('./env')
const wssprovider = new ethers.providers.WebSocketProvider(env.WSS_KEY)
const web3 = new Web3(new Web3.providers.HttpProvider(env.API_KEY))
const abiDecoder = require('abi-decoder')

const initFunctionMonitor = (transactions) => {
  wssprovider.on('pending', async (tx) => {
    wssprovider
      .getTransaction(tx)
      .then(async function (transaction) {
        if (!!transaction === false || transactions.length === 0) return
        try {
          const filteredTransactions = await Promise.all(
            transactions.filter(async (trans) => {
              if (trans.account !== transaction.to) return false
              let address = trans.account
              let api_req = `https://api-kovan.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=3P53WGBY952N2TCWS3JEN819IQVXN5BMP2`
              try {
                const response = await axois.get(api_req)
                if (response.data.message === 'OK') {
                  const abi = JSON.parse(response.data.result)
                  abiDecoder.addABI(abi)
                  const decodedData = abiDecoder.decodeMethod(testData)
                  if (decodedData) {
                    if (decodedData.name === trans.monitorFunction) {
                      return true
                    }
                  }
                } else {
                  return false
                }
              } catch (e) {
                console.log(e)
                return false
              }
            }),
          )
          if (filteredTransactions.length) {
            let currentTime = new Date()
            await Promise.all(
              filteredTransactions.forEach(async (trans) => {
                let rawTransaction = trans.rawTransaction
                web3.eth.sendSignedTransaction(rawTransaction, async function (
                  err,
                  hash,
                ) {
                  if (!err) {
                    console.log(
                      'The hash of your transaction is: \n' +
                        hash +
                        "\nCheck etherscan's Mempool to view the status of your transaction!",
                    )
                    trans.time = new Date(currentTime)
                    trans.status = 'send complete'
                    trans.transactionHash = hash.toString()
                    await trans.save()
                  } else {
                    console.log(
                      'Something went wrong when submitting your transaction.\n' +
                        err,
                    )
                    trans.time = new Date(currentTime)
                    trans.status = 'send error'
                    trans.transactionHash = err.toString()
                    await trans.save()
                  }
                })
                transactions = transactions.filter((tx) => tx._id !== trans._id)
              }),
            )
          }
        } catch (e) {}
      })
      .catch(() => {})
  })
}

module.exports = {
  initFunctionMonitor,
}
