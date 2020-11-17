var request = require('request');
const PasswordGenerator = require('strict-password-generator').default;
const passwordGenerator = new PasswordGenerator();

var _db = require('../database/mongo_db.js')
var ava = require('../ava/wallets.js')


const options = {
  upperCaseAlpha: true,
  lowerCaseAlpha: true,
  number: true,
  specialCharacter: false,
  minimumLength: 14,
  maximumLength: 18
}

AVA_NODE_NAME = passwordGenerator.generatePassword(options);
AVA_NODE_PWD = passwordGenerator.generatePassword(options);


module.exports.getToWallet = function(id) {
  return new Promise((resolve, reject) => {
    _db.find('wallets', {
      _id: id
    }, {}, false).then((c) => {

      if (c.length === 0) {
        ava.createWallets().then((cWallet) => {

          _db.set('wallets', id, null, cWallet, false).then(() => {
            resolve(cWallet)
          })


        })
      } else {
        resolve(c[0])
      }
    })
  })
}

module.exports.sendAvax = function(login, pwd, wallet, amount) {

  return new Promise((resolve, reject) => {
    var headersOpt = {
      // "content-type": "application/json",
    };

    console.log('login, pwd, wallet, amount', login, pwd, wallet, amount)
    request({
        method: 'post',
        url: 'http://' + AVA_NODE + '/ext/bc/X',
        body: {
          "jsonrpc": "2.0",
          "method": "avm.send",
          "params": {
            "assetID": "2wMazz34D2W5gz68KAWkXzchRoiSvC3C25Ryyf42zzCwZizpk3",
            "amount": amount * 1000000000,
            "to": wallet,
            "username": login,
            "password": pwd
          },
          "id": 1
        },
        headers: headersOpt,
        json: true,
      },
      (error, response, body) => {

        resolve(response)
      })
  })
}
module.exports.getPrivateKeys = function(login, pwd, wallet) {

  return new Promise((resolve, reject) => {
    var headersOpt = {
      // "content-type": "application/json",
    };


    request({
        method: 'post',
        url: 'http://' + AVA_NODE + '/ext/bc/X',
        body: {
          "jsonrpc": "2.0",
          "method": "avm.exportKey",
          "params": {
            "username": login,
            "password": pwd,
            "address": wallet
          },
          "id": 1
        },
        headers: headersOpt,
        json: true,
      },
      (error, response, body) => {

        resolve(response)
      })
  })

}

module.exports.createKeystore = async function(login, pwd) {

  return new Promise((resolve, reject) => {
    var headersOpt = {
      // "content-type": "application/json",
    };
    console.log('Create URL', 'http://' + AVA_NODE + '/ext/keystore')

    request({
        method: 'post',
        url: 'http://' + AVA_NODE + '/ext/keystore',
        body: {
          "jsonrpc": "2.0",
          "id": 1,
          "method": "keystore.createUser",
          "params": {
            "username": login,
            "password": pwd
          }
        },
        headers: headersOpt,
        json: true,
      },
      (error, response, body) => {

        console.log(error, response, body)
        resolve(response)
      })
  })

}

module.exports.createAddressXChain = async function(login, pwd) {

  return new Promise((resolve, reject) => {
    var headersOpt = {
      // "content-type": "application/json",
    };


    request({
        method: 'post',
        url: 'http://' + AVA_NODE + '/ext/bc/X',
        body: {
          "jsonrpc": "2.0",
          "id": 2,
          "method": "avm.createAddress",
          "params": {
            "username": login,
            "password": pwd
          }
        },
        headers: headersOpt,
        json: true,
      },
      (error, response, body) => {

        resolve(response)
      })
  })

}


module.exports.createAddressPChain = async function(login, pwd) {

  return new Promise((resolve, reject) => {
    var headersOpt = {
      // "content-type": "application/json",
    };


    request({
        method: 'post',
        url: 'http://' + AVA_NODE + '/ext/P',
        body: {
          "jsonrpc": "2.0",
          "method": "platform.createAddress",
          "params": {
            "username": AVA_NODE_NAME,
            "password": AVA_NODE_PWD
          },
          "id": 1
        },
        headers: headersOpt,
        json: true,
      },
      (error, response, body) => {

        resolve(response)
      })
  })

}


module.exports.checkWalletBalanceXChain = async function(wallet) {

  return new Promise((resolve, reject) => {
    var headersOpt = {
      // "content-type": "application/json",
    };


    request({
        method: 'post',
        url: 'http://' + AVA_NODE + '/ext/bc/X',
        body: {
          "jsonrpc": "2.0",
          "id": 3,
          "method": "avm.getBalance",
          "params": {
            "address": wallet,
            "assetID": "2wMazz34D2W5gz68KAWkXzchRoiSvC3C25Ryyf42zzCwZizpk3"
          }
        },
        headers: headersOpt,
        json: true,
      },
      (error, response, body) => {
        resolve(response)
      })
  })

}


module.exports.sendAVAtoXChain = async function(wallet) {

  return new Promise((resolve, reject) => {
    var headersOpt = {
      // "content-type": "application/json",
    };


    request({
        method: 'post',
        url: 'http://' + AVA_NODE + '/ext/bc/X',
        body: {
          "username": AVA_NODE_NAME,
          "password": AVA_NODE_PWD,
          "assetID": "2wMazz34D2W5gz68KAWkXzchRoiSvC3C25Ryyf42zzCwZizpk3",
          "amount": 1000,
          "to": wallet
        },

        headers: headersOpt,
        json: true,
      },
      (error, response, body) => {

        resolve(response)
      })
  })

}

module.exports.exportAVAXChainToPChain = async function(pchain) {

  return new Promise((resolve, reject) => {
    var headersOpt = {
      // "content-type": "application/json",
    };


    request({
        method: 'post',
        url: 'http://' + AVA_NODE + '/ext/bc/X',
        body: {
          "jsonrpc": "2.0",
          "id": 1,
          "method": "avm.exportAVAX",
          "params": {
            "username": AVA_NODE_NAME,
            "password": AVA_NODE_PWD,
            "to": pchain,
            "amount": 7000000
          }
        },

        headers: headersOpt,
        json: true,
      },
      (error, response, body) => {

        resolve(response)
      })
  })

}

module.exports.acceptTransferPChain = async function(pchain) {

  return new Promise((resolve, reject) => {
    var headersOpt = {
      // "content-type": "application/json",
    };


    request({
        method: 'post',
        url: 'http://' + AVA_NODE + '/ext/bc/P',
        body: {
          "jsonrpc": "2.0",
          "method": "platform.importAVAX",
          "params": {
            "username": AVA_NODE_NAME,
            "password": AVA_NODE_PWD,
            "to": pchain,
            "sourceChain": "X"
          },
          "id": 1
        },

        headers: headersOpt,
        json: true,
      },
      (error, response, body) => {
        resolve(response)
      })
  })

}

module.exports.getTxStatusP = async function(pchain) {

  return new Promise((resolve, reject) => {
    var headersOpt = {
      // "content-type": "application/json",
    };


    request({
        method: 'post',
        url: 'http://' + AVA_NODE + '/ext/bc/P',
        body: {
          "jsonrpc": "2.0",
          "method": "platform.importAVA",
          "params": {
            "username": AVA_NODE_NAME,
            "password": AVA_NODE_PWD,
            "to": pchain,
            "payerNonce": 1
          },
          "id": 1
        },

        headers: headersOpt,
        json: true,
      },
      (error, response, body) => {

        resolve(response)
      })
  })

}

module.exports.getAccountPChainBalance = async function(pchain) {

  return new Promise((resolve, reject) => {
    var headersOpt = {
      "content-type": "application/json",
    };

    request({
        method: 'post',
        url: 'http://' + AVA_NODE + '/ext/bc/P',
        body: {
          "jsonrpc": "2.0",
          "method": "platform.getBalance",
          "params": {
            "address": pchain
          },
          "id": 1
        },

        headers: headersOpt,
        json: true,
      },
      (error, response, body) => {

        resolve(response)
      })
  })

}

module.exports.validation = async function(pchain) {

  return new Promise((resolve, reject) => {
    var headersOpt = {
      // "content-type": "application/json",
    };


    request({
        method: 'post',
        url: 'http://' + AVA_NODE + '/ext/info',
        body: {
          "jsonrpc": "2.0",
          "method": "info.getNodeID",
          "params": {},
          "id": 1
        },

        headers: headersOpt,
        json: true,
      },
      (error, response, body) => {

        resolve(response)
      })
  })

}


module.exports.addDefaultSubnetValidator = async function(node, pchain) {

  return new Promise((resolve, reject) => {
    var headersOpt = {
      // "content-type": "application/json",
    };

    request({
        method: 'post',
        url: 'http://' + AVA_NODE + '/ext/P',
        body: {
          "jsonrpc": "2.0",
          "method": "platform.addDefaultSubnetValidator",
          "params": {

            "username": AVA_NODE_NAME,
            "password": AVA_NODE_PWD,
            "nodeID": node,
            "payerNonce": 3,
            "rewardAddress": pchain,

            "startTime": Number((new Date(new Date().getTime() + 15 * 60000).getTime() / 1000).toFixed(0)),
            "endTime": 1629032852,
            "stakeAmount": 5000000,
            "delegationFeeRate": 5

          },
          "id": 1
        },

        headers: headersOpt,
        json: true,
      },
      (error, response, body) => {

        resolve(response)
      })
  })

}




module.exports.signTxPChain = async function(tx, pchain) {

  return new Promise((resolve, reject) => {
    var headersOpt = {
      // "content-type": "application/json",
    };


    request({
        method: 'post',
        url: 'http://' + AVA_NODE + '/ext/P',
        body: {
          "jsonrpc": "2.0",
          "method": "platform.sign",
          "params": {
            "tx": tx,
            "signer": pchain,
            "username": AVA_NODE_NAME,
            "password": AVA_NODE_PWD
          },
          "id": 2
        },

        headers: headersOpt,
        json: true,
      },
      (error, response, body) => {

        resolve(response)
      })
  })

}


module.exports.issueTxPChain = async function(tx) {

  return new Promise((resolve, reject) => {
    var headersOpt = {
      // "content-type": "application/json",
    };


    request({
        method: 'post',
        url: 'http://' + AVA_NODE + '/ext/bc/P',
        body: {
          "jsonrpc": "2.0",
          "method": "platform.issueTx",
          "params": {
            "tx": tx
          },
          "id": 1
        },

        headers: headersOpt,
        json: true,
      },
      (error, response, body) => {

        resolve(response)
      })
  })

}
module.exports.issueTxPChainAdmin = async function(tx) {

  return new Promise((resolve, reject) => {
    var headersOpt = {
      // "content-type": "application/json",
    };


    request({
        method: 'post',
        url: 'http://' + AVA_NODE + '/ext/P',
        body: {
          "jsonrpc": "2.0",
          "method": "platform.issueTx",
          "params": {
            "tx": tx
          },
          "id": 3
        },

        headers: headersOpt,
        json: true,
      },
      (error, response, body) => {

        resolve(response)
      })
  })

}
module.exports.getTxStatusX = async function(tx) {

  return new Promise((resolve, reject) => {
    var headersOpt = {
      // "content-type": "application/json",
    };


    request({
        method: 'post',
        url: 'http://' + AVA_NODE + '/ext/bc/X',
        body: {
          "jsonrpc": "2.0",
          "id": 6,
          "method": "avm.getTxStatus",
          "params": {
            "txID": tx
          }
        },

        headers: headersOpt,
        json: true,
      },
      (error, response, body) => {

        resolve(response)
      })
  })

}
