const Web3 = require('web3')
const ethers = require('ethers')
const env = require('./env')
const web3 = new Web3(new Web3.providers.HttpProvider(env.API_KEY))
const abiDecoder = require('abi-decoder')
const axios = require('axios')

const initFunctionMonitor = async (transactions) => {
  // wssprovider.on('pending', (tx) => {
  //   wssprovider.getTransaction(tx).then(function (transaction) {
  //     if (transaction) {
  //       console.log(transaction.to)
  //       console.log('///////////////////////////////')
  //     }
  //   })
  // })
  let nonces = Array(transactions.length)
  for (let i = 0; i < transactions.length; i++) {
    nonces[i] = 0
  }
  for (; transactions.length; ) {
    console.log('Hello')
    let catchedTransNumbers = []

    await new Promise(async (resolve, reject) => {
      let agreeToResolve = 0
      let target = transactions.length
      console.log('target', target)

      for (let i = 0; i < target; i++) {
        const trans = transactions[i]
        let {
          account,
          to,
          gasLimit,
          maxPriorityFeePerGas,
          value,
          data,
          privateKey,
        } = trans
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
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey)

        let address = trans.to
        let api_req = `https://api-kovan.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=3P53WGBY952N2TCWS3JEN819IQVXN5BMP2`
        console.log('api')
        try {
          const response = await axios.get(api_req)
          if (response.data.message === 'OK') {
            try {
              let result = response.data.result
              console.log('ok')
              // console.log(result)
              if (nonces[i] === 0) {
                let endTx = result.pop()
                nonces[i] = endTx.nonce
                agreeToResolve++
                if (agreeToResolve === target) resolve()
              } else {
                let endTx = result.pop()
                if (nonces[i] !== endTx.nonce) {
                  nonces[i] = endTx.nonce
                  console.log(endTx)
                  console.log(trans.monitorFunction)
                  if (endTx.functionName.includes(trans.monitorFunction)) {
                    try {
                      web3.eth.sendSignedTransaction(
                        signedTx.rawTransaction,
                        async function (err, hash) {
                          if (!err) {
                            console.log(
                              'The hash of your transaction is: \n' +
                                hash +
                                "\nCheck etherscan's Mempool to view the status of your transaction!",
                            )
                            trans.time = new Date()
                            trans.status = 'send complete'
                            trans.transactionHash = hash.toString()
                            await trans.save()
                            transactions = transactions.filter(
                              (tx) => tx._id !== trans._id,
                            )
                            nonces = nonces.filter(
                              (nonce, index) => index !== i,
                            )
                            agreeToResolve++
                            if (agreeToResolve === target) resolve()
                          } else {
                            console.log(
                              'Something went wrong when submitting your transaction.\n' +
                                err,
                            )
                            trans.time = new Date()
                            trans.status = 'send error'
                            trans.transactionHash = err.toString()
                            await trans.save()
                            transactions = transactions.filter(
                              (tx) => tx._id !== trans._id,
                            )
                            nonces = nonces.filter(
                              (nonce, index) => index !== i,
                            )
                            agreeToResolve++
                            if (agreeToResolve === target) resolve()
                          }
                          catchedTransNumbers.push(i)
                        },
                      )
                    } catch (e) {
                      console.log(e)
                    }
                  } else {
                    agreeToResolve++
                    if (agreeToResolve === target) resolve()
                  }
                } else {
                  agreeToResolve++
                  console.log(agreeToResolve)
                  if (agreeToResolve === target) resolve()
                }
              }
            } catch (e) {
              console.log(e)
              agreeToResolve++
              if (agreeToResolve === target) reject()
            }
          } else {
            agreeToResolve++
            if (agreeToResolve === target) resolve()
          }
        } catch (e) {
          console.log(e)
          agreeToResolve++
          if (agreeToResolve === target) reject()
        }
      }
    })
    transactions = transactions.filter(
      (tx, index) => !catchedTransNumbers.includes(index),
    )
    nonces = nonces.filter(
      (nonce, index) => !catchedTransNumbers.includes(index),
    )
  }
  // wssprovider.on('pending', async (tx) => {
  //   wssprovider
  //     .getTransaction(tx)
  //     .then(async function (transaction) {
  //       if (transaction === null || transactions.length === 0) return
  //       try {
  //         const filteredTransactions = []
  //         for (let i = 0; i < transactions.length; i++) {
  //           const trans = transactions[i]
  //           console.log(trans.to)
  //           console.log(transaction.to)
  //           if (trans.to !== transaction.to) continue
  //           let address = trans.to
  //           let api_req = `https://api-kovan.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=3P53WGBY952N2TCWS3JEN819IQVXN5BMP2`
  //           try {
  //             const response = await axois.get(api_req)
  //             if (response.data.message === 'OK') {
  //               const abi = JSON.parse(response.data.result)
  //               abiDecoder.addABI(abi)
  //               const decodedData = abiDecoder.decodeMethod(testData)
  //               if (decodedData) {
  //                 if (decodedData.name === trans.monitorFunction) {
  //                   filteredTransactions.push(trans)
  //                 }
  //               }
  //             } else {
  //               continue
  //             }
  //           } catch (e) {
  //             console.log(e)
  //             continue
  //           }
  //         }
  //         console.log(filteredTransactions)
  //         if (filteredTransactions.length) {
  //           let currentTime = new Date()
  //           await Promise.all(
  //             filteredTransactions.forEach(async (trans) => {
  //               let rawTransaction = trans.rawTransaction
  //               web3.eth.sendSignedTransaction(rawTransaction, async function (
  //                 err,
  //                 hash,
  //               ) {
  //                 if (!err) {
  //                   console.log(
  //                     'The hash of your transaction is: \n' +
  //                       hash +
  //                       "\nCheck etherscan's Mempool to view the status of your transaction!",
  //                   )
  //                   trans.time = new Date(currentTime)
  //                   trans.status = 'send complete'
  //                   trans.transactionHash = hash.toString()
  //                   await trans.save()
  //                 } else {
  //                   console.log(
  //                     'Something went wrong when submitting your transaction.\n' +
  //                       err,
  //                   )
  //                   trans.time = new Date(currentTime)
  //                   trans.status = 'send error'
  //                   trans.transactionHash = err.toString()
  //                   await trans.save()
  //                 }
  //               })
  //               transactions = transactions.filter((tx) => tx._id !== trans._id)
  //             }),
  //           )
  //         }
  //       } catch (e) {
  //         console.log(e)
  //       }
  //     })
  //     .catch(() => {})
  // })
}

module.exports = {
  initFunctionMonitor,
}
