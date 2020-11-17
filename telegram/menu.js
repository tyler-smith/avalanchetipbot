"use strict";

var async = require('async');
var dico = require("../custo/dico.js")
var _db = require('../database/mongo_db.js')
var helper = require('../admin/helper.js')
var menu = this
var helper_msg = require('../admin/helper_msg.js')
var exporting_v2 = require('../admin/data_exports_v2.js')

var ava = require('../ava/avax.js')
var adStatus = true

module.exports.setInfo = function(msg, type, lang) {
  var _txt = ""

  var _lang = {
    lang: lang
  }

  if (!adStatus)
    return menu.setSubmissionByDatas(msg, null, _lang, false)


  var _ad = dico.getWordLang(lang, "ad", menu.getLangMenu)
  // console.log("enter",type)

  _db.set('users_participating_' + _AD_ROUND, msg.chat.id, null, {
    // edit: false,
    type: type
  }, false).then(function() {

    console.log("_AD_REQUIREMENTS", _AD_REQUIREMENTS, type)

    var _markup = []
    if (_AD_REQUIREMENTS[type] !== undefined) {
      var _require = helper.getRequirementText(msg, _AD_REQUIREMENTS[type], lang)

      _txt = _require.text_question



      if (_require.type_data === "survey") {
        var _responses = []
        for (var i = 0; i < _require.survey_responses.length; i++) {

          _responses.push({
            text: _ad[_require.survey_responses[i]],
            callback_data: 'SURVEY_' + _require.type + "_" + _require.survey_responses[i]
          })
        }
        _markup.push(_responses)
      } else {
        _markup.push([{
          text: _ad.btn_cancel,
          callback_data: 'SET AD INFO'
        }])

      }
      var options = {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: JSON.stringify({
          inline_keyboard: _markup
        })

      };

      if (!_require.has_image) {

        bot.sendMessage(msg.chat.id, _txt, options);
      } else {
        var uri = __dirname + "/../img/" + _require.has_image


        bot.sendChatAction(msg.chat.id, "upload_photo")

        bot.sendMessage(msg.chat.id, _txt).then(function() {
          bot.sendPhoto(msg.chat.id, uri, options);
        })
      }
    }



  })


}
module.exports.getLangMenu = function(msg, match) {

  console.log("_LANGS", _LANGS)
  var options = {
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: JSON.stringify({

      keyboard: _LANGS,
      resize_keyboard: true,
      one_time_keyboard: true
    })
  };

  bot.sendMessage(msg.chat.id, multilang.welcome_lang, options);

}

module.exports.getMoreTasks = function(msg, myUser) {
  var _submission = dico.getWordLang(myUser.lang, "submission", menu.getLangMenu)
  var _keyboard = helper_msg.getKeyboardButtons(msg, myUser.lang)
  var options_init = helper_msg.getKeyboardButtonsOptions(_keyboard)
  var _txt = _submission.msg_get_more_tasks

  bot.sendMessage(msg.chat.id, _txt, options_init)
}
module.exports.setSubmissionByDatas = function(msg, welcomingTxt, myUser, hideMessage) {

  if (helper.isPrivate(msg)) {

    try {
      var _rounds = dico.getWordLang(myUser.lang, "rounds", menu.getLangMenu)
      var _ico = dico.getWordLang(myUser.lang, "ico", menu.getLangMenu)
      var _ad = dico.getWordLang(myUser.lang, "ad", menu.getLangMenu)
      var _submission = dico.getWordLang(myUser.lang, "submission", menu.getLangMenu)
      var _others = dico.getWordLang(myUser.lang, "others", menu.getLangMenu)

      var _uround = _rounds[_AD_ROUND_SELECTED]

      // var _txt_1 = "<b>" + _submission.msg_welcome + "\n\n</b>"

      var _txt_1 = "<b>" + _others.hello;
      if (msg.chat.username !== undefined)
        _txt_1 += " " + msg.chat.username + "</b>,\n\n"
      else {
        _txt_1 += "</b>,\n\n"
      }


      if (welcomingTxt !== undefined && welcomingTxt !== null && welcomingTxt !== "")
        _txt_1 = "👋" + welcomingTxt


      var _txt = ""



      if (adStatus) {


        var _tokens = 0

        for (i in _AD_REQUIREMENTS) {
          if (_AD_REQUIREMENTS[i].bounty) {
            _tokens += _AD_REQUIREMENTS[i].bounty_token_value
          }
        }

        var _coin = _AMOUNT_SUBSCRIBE + _tokens + _AMOUNT_ALL_TASKS_TOKENS
        var _dol = _coin * _CRYPTO_TOKEN_UNIT_VALUE_DOL


        _txt += _dico.avax.welcome.greetings + "\n";


        _txt += "\n🚀 " + _dico.avax.welcome.your_wallet_is + " <a href='https://explorer.avax.network/address/" + myUser.tip + "'>" + myUser.tip + "</a>\n" +
          "<i>" + _dico.avax.welcome.you_can_deposit + "</i>"

        _txt += "\n\n" +
          _dico.avax.welcome.one_click + "\n" +
          "  |- /start : " + _dico.avax.welcome.start + "\n" +
          "  |- /balance : " + _dico.avax.welcome.balance + "\n" +
          "  |- /twitter : " + _dico.avax.welcome.twitter + "\n" +
          "  |- /deposit : " + _dico.avax.welcome.deposit + "\n" +
          "  |- /withdraw : " + _dico.avax.welcome.withdraw + "\n" +
          "  |- /tipinfo :" + _dico.avax.welcome.tipinfo + "\n" +
          "  |- /info : " + _dico.avax.welcome.info + "\n"

        if (_others.msg_earn !== "")
          _txt += _others.msg_earn + _AMOUNT_SUBSCRIBE + " " + _CRYPTO_TICKER + " (~" + _AMOUNT_SUBSCRIBE_DOLLAR + " " + _ICO_TOKEN_MONEY_SYMBOL + " )\n\n"


      } else if (!adStatus) {
        _txt += _others.greetings + "\n<b>" + _CRYPTO_NAME + _ico.end_ad_msg + "</b>\n"
      }

      var _info = ""


      var _markup = []
      var _hasFullfilledAllRequirements = true

      var _checkRequirementsMandatory = helper.checkRequirements(myUser, _AD_REQUIREMENTS)
      var _checkHasBounty = helper.checkHasBounty(myUser, _AD_REQUIREMENTS)

      var _isRequirementsDone = true;



      if (!((myUser['invalid'] !== undefined && myUser['invalid'] === true) || myUser.smileyCount > 2)) {

        _txt += "\n" + _submission.msg_helper + "\n"
      }



      if (helper.isAdmin(msg)) {

        for (var i in _AD_ROUNDS) {

          var _row = _AD_ROUNDS[i]

          if (_row.status === true) {
            _markup.push([{
                text: '👨‍✈️Dashboard',
                callback_data: 'GET DASHBOARD_' + i
              }

            ])


            _markup.push([{
              text: '👨‍✈️Bulk messages',
              callback_data: 'GET ADMIN DASHBOARD'
            }])
          }

        }
      }

      var options = {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: JSON.stringify({
          inline_keyboard: _markup
        })

      };
      var _keyboard = helper_msg.getKeyboardButtons(msg, myUser.lang)
      var options_init = helper_msg.getKeyboardButtonsOptions(_keyboard)

      if ((myUser['invalid'] !== undefined && myUser['invalid'] === true) || myUser.smileyCount > 2) {
        _txt = _ad.thank_you_disqualified
        bot.sendMessage(msg.chat.id, _txt, options)
      } else {

        bot.sendMessage(msg.chat.id, _txt_1, options_init).then(function() {

          if (welcomingTxt !== undefined && welcomingTxt !== null && welcomingTxt.indexOf('Your Twitter profile handler') === 0) {


            function getRandomInt(max) {
              return Math.floor(Math.random() * Math.floor(max));
            }
            var _rdm = getRandomInt(200000);
            _db.set('users_participating_1', msg.chat.id, null, {
              twitter_verified: false
            }, false)
            _db.set('users_participating_' + _AD_ROUND, msg.chat.id, null, {
              // edit: false,
              twitter_verification: _rdm
            }, false).then(() => {


              _txt = dico.avax.twitter.ownership + "\n" +
                dico.avax.twitter.tweet + _rdm + "'\n\n" +
                dico.avax.twitter.process

              bot.sendMessage(msg.chat.id, _txt, options).then(function() {

              });

            })


          } else {
            bot.sendMessage(msg.chat.id, _txt, options).then(function() {

            });
          }


        })
      }
    } catch (e) {
      console.log("dico.avax", _dico, dico)
      console.log('err', _dico.avax.twitter.already_linked)
    }
  }
}

module.exports.setAdInfo = function(msg, _txt, myUser) {

  _db.set('users_participating_' + _AD_ROUND, msg.chat.id, null, {
    // edit: false,
    type: null
  }, false).then(() => {
    menu.setSubmissionByDatas(msg, _txt, myUser, false)
  })
}
module.exports.getWithdrawMenu = function(msg, other, myUser) {
  if (myUser.AVAX === undefined) {

    var _markup = []
    _markup.push([{
      text: "🅰️dd your wallet",
      callback_data: 'SET DATAS-AVAXTMP'
    }])

    var options = {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: JSON.stringify({
        inline_keyboard: _markup
      })

    };
    bot.sendMessage(msg.chat.id, 'To withdraw your AvalancheTipBot balance, link your AVAX wallet first!', options).then(() => {
      menu.setInfo(msg, "Wonton", myUser.lang)
    })
  } else {
    _db.set('users_participating_' + _AD_ROUND, msg.chat.id, null, {
      // edit: false,
      type: 'withdraw'
    }, false).then(function() {
      _db.find("wallets", {
        _id: msg.chat.id
      }, {}, false).then((rWallet) => {
        console.log('rWallet', rWallet)
        if (rWallet[0] !== undefined && rWallet[0].xchain !== undefined) {
          ava.getBalanceDatas(rWallet[0].xchain).then((rWalletBalance) => {

            var _txt = "<b>" + _dico.avax.balance.tip + "</b>\n" +
              "👉<a href='https://explorer.avax.network/address/" + rWallet[0].xchain + "'>" + rWallet[0].xchain + "</a>\n" +
              "<i>You can already deposit AVAX and start tipping your friends and community members!</i>\n" +
              "Balance: \n"

            var _ad = dico.getWordLang('EN', "ad", menu.getLangMenu)
            var _markup = []
            _markup.push([{
              text: "🅰️dd your wallet",
              callback_data: 'SET DATAS-AVAXTMP'
            }])
            _markup.push([{
              text: _ad.btn_cancel,
              callback_data: 'SET AD INFO'
            }])

            var options = {
              parse_mode: "HTML",
              disable_web_page_preview: true,
              reply_markup: JSON.stringify({
                inline_keyboard: _markup
              })
            }

            bot.sendMessage(msg.chat.id,
              _dico.avax.balance.tip + ':  <b>' + helper.numberWithCommas(rWalletBalance.balance / 1000) + '</b> AVAX\n' +
              'From <a href=\'https://explorer.avax.network/address/' + myUser.tip + '\'>' + myUser.tip + '</a>\n' +
              'To <a href=\'https://explorer.avax.network/address/' + myUser.AVAX + '\'>' + myUser.AVAX + '</a>\n' +
              '\n' +
              _dico.avax.withdraw.type, options)
          })
        }
      })
    })
  }


}

var _getBalancesDatas = function(_row, msg, myUser, id) {

  return new Promise(function(resolve, reject) {

    var userid = msg.chat.id
    if (id !== undefined && id !== null)
      userid = id

    if (_row._ROUND === _AD_ROUND_SELECTED && userid === myUser.id) {
      resolve(myUser)
    } else {
      resolve(_db.get('users_participating_' + _row._ROUND, userid))
    }
  })
}

var _getBalanceByRound = function(msg, _row, count, id, myUser) {
  var _lang = myUser.lang
  var _balance = dico.getWordLang(_lang, "balance", menu.getLangMenu)

  return new Promise(function(resolve, reject) {

    _getBalancesDatas(_row, msg, myUser, id).then((snapshot) => {

      _db.find("wallets", {
        _id: myUser._id
      }, {}, false).then((rWallet) => {
        console.log('rWallet', rWallet)
        if (rWallet[0] !== undefined && rWallet[0].xchain !== undefined) {
          ava.getBalanceDatas(rWallet[0].xchain).then((rWalletBalance) => {

            var _txt = "<b>" + _dico.avax.balance.tip + "</b> <b>" + helper.numberWithCommas(rWalletBalance.balance / 1000) + "</b> AVAX\n" +
              "<a href='https://explorer.avax.network/address/" + rWallet[0].xchain + "'>" + rWallet[0].xchain + "</a>\n" +
              "<i>" + _dico.avax.balance.tip_footer + "</i>\n"

            // console.log(_txt)

            if (myUser.AVAX !== undefined && myUser.AVAX !== null) {
              ava.getBalanceDatas(myUser.AVAX).then((r) => {
                _txt += "\n ▫️ ▫️ ▫️\n"
                _txt += "\n<b>" + _dico.avax.balance.avax + "</b> <b>" + helper.numberWithCommas(r.balance / 1000) + "</b> AVAX\n👉<a href='https://explorer.avax.network/address/" + myUser.AVAX + "'>" +
                  myUser.AVAX + "</a>\n" +
                  "<i>" + _dico.avax.balance.avax_footer + "</i>\n"


                resolve(_txt)
              })
            } else {
              resolve(_txt += "\n ▫️ ▫️ ▫️\n")
            }
          })
        } else {
          console.log('lenght = 0')
        }

      })
    })

  });


}
module.exports.getAdBalance = function(msg, id, myUser) {
  var count = 0;
  var promises = []
  var returns_array = []
  for (var i in _AD_ROUNDS) {
    var _row = _AD_ROUNDS[i]

    if (_row.status === true) {
      promises.push(_getBalanceByRound(msg, _row, count, id, myUser))
      count++
    }

  }

  Promise.all(promises)
    .then(function(r) {
      var options = {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: JSON.stringify({
          inline_keyboard: [
            // _menu
          ]
        })

      };

      for (var i in r) {
        returns_array.push(r[i])
      }
      var _keyboard = helper_msg.getKeyboardButtons(msg, myUser.lang)
      var options_keyboard = helper_msg.getKeyboardButtonsOptions(_keyboard)

      console.log("options_keyboard", options_keyboard)
      bot.sendMessage(msg.chat.id, returns_array.join("\n"), options_keyboard);

      // }, count * 500)
    })
    .catch(console.error);


}
module.exports.addSon = function(father, son) {

  _db.get('users_participating_' + _AD_ROUND, father).then(function(snapshot) {

    var _row = snapshot;

    if (_row !== null) {
      if (_row.referrals === undefined) {
        _row.referrals = []
        _row.referrals.push(son)
        _db.set('users_participating_' + _AD_ROUND, father, 'referrals', _row.referrals, false)
      } else {
        var _exists = false;

        if (!_row.referrals.includes(son)) {

          _row.referrals.push(son)
          _db.set('users_participating_' + _AD_ROUND, father, 'referrals', _row.referrals, false)
        }


      }
    }
  })

}

module.exports.getAdRules = function(msg, lang) {}




module.exports.getIcoInfo = function(msg, lang) {

  var _ico = dico.getWordLang(lang, "ico", menu.getLangMenu)
  var _txt = _ico.msg_info_short + "\n\n"

  var _keyboard = helper_msg.getKeyboardButtons(msg, lang)

  var options_keyboard = helper_msg.getKeyboardButtonsOptions(_keyboard)

  // _txt +=     "▶️ Join "+ _CRYPTO_NAME +" investment : "+_CRYPTO_LINKS.ico+"\n\n"+

  _txt += "<b>" + _ico.msg_docs + "</b>\n"
  for (var i = 0; i < _ico.infos.docs.length; i++) {


    if (_CRYPTO_LINKS[_ico.infos.docs[i]] !== undefined && _CRYPTO_LINKS[_ico.infos.docs[i]] !== null) {
      _txt += _ico["msg_" + _ico.infos.docs[i]] + " " + _CRYPTO_LINKS[_ico.infos.docs[i]] + "\n";
    }


  }
  _txt += "\n<b>" + _ico.msg_social + "</b>\n"
  for (var i = 0; i < _ico.infos.social.length; i++) {


    if (_CRYPTO_LINKS[_ico.infos.social[i]] !== undefined && _CRYPTO_LINKS[_ico.infos.social[i]] !== null) {
      _txt += _ico["msg_" + _ico.infos.social[i]] + " " + _CRYPTO_LINKS[_ico.infos.social[i]] + "\n";
    }


  }
  if (_CRYPTO_PARTNERS.length > 0) {
    _txt += "\n<b>" + _ico.msg_partners + "</b>\n"

    for (var i in _CRYPTO_PARTNERS) {

      _txt += "▶️ " + _CRYPTO_PARTNERS[i].name + ": " + _CRYPTO_PARTNERS[i].link + "\n"

    }
  }
  if (_CRYPTO_LINKS.reviews.length > 0) {
    _txt += "\n<b>" + _ico.msg_reviews + "</b>\n"



    for (var i in _CRYPTO_LINKS.reviews) {
      if (_CRYPTO_LINKS.reviews[i].score !== undefined && _CRYPTO_LINKS.reviews[i].score !== "")
        _txt += "▶️ " + _CRYPTO_LINKS.reviews[i].name + " ( " + _CRYPTO_LINKS.reviews[i].score + " ): " + _CRYPTO_LINKS.reviews[i].link + "\n"
      else {
        _txt += "▶️ " + _CRYPTO_LINKS.reviews[i].name + ": " + _CRYPTO_LINKS.reviews[i].link + "\n"
      }
    }

  }
  if (_GET_WHITELISTED_LINK !== "" && _GET_WHITELISTED.length > 0) {
    _txt += "\n<b>" + _ico.msg_get_whitelisted + "</b>" + _GET_WHITELISTED_LINK + "\n"



    for (var i in _GET_WHITELISTED) {
      _txt += "▶️ " + _GET_WHITELISTED[i].name + ": " + _GET_WHITELISTED[i].link + "\n"

    }

  }

  var options = {
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: JSON.stringify({
      inline_keyboard: [
        //  _menu
      ]
    })

  };

  bot.sendMessage(msg.chat.id, _txt, options_keyboard)

}
