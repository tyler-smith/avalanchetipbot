"use strict";

process.env["NTBA_FIX_319"] = 1;

var global_config = require('./global_config.js')
var async = require('async');
var fs = require('fs');
var dico = require('./custo/dico.js')
var _db = require('./database/mongo_db.js')
var init = require('./custo/init.js')
var cron = require('./admin/cron.js')


global.bot = init.setTelegram();
var config = require('./custo/config.js')
_db.init();

var admin = require('./admin/admin.js')
var helper = require('./admin/helper.js')
var helper_msg = require('./admin/helper_msg.js')
var exporting_v2 = require('./admin/data_exports_v2.js')

var menu = require('./telegram/menu.js')
var massMessages = require('./admin/massMessages.js')
var bulkMessagesAdmin = require('./admin/bulkMessagesAdmin.js')

var twitter = require('./admin/twitter.js')
var ava = require('./ava/helper.js')
var discord = require('./discord/connect.js')

config.init()

bot.onText(/^\/[vV]erifyTwitter (.+|\b)/, (msg, match) => {
  if (helper.isAdmin(msg) && helper.isPrivate(msg)) {
    console.log('msg', msg.text)
    var username = msg.text.split('erifyTwitter ')[1]
    if (username.indexOf("@") === 0) {
      username = username.substring(1, username.length)
    }
    console.log('username', username)
    _db.find("users_participating_1", {
      twitter: {
        $exists: true
      },
      username: username,


    }, {}, false).then((r) => {
      console.log("final", r)
      if (r.length === 1) {
        _db.set('users_participating_1', r[0]._id, null, {
          twitter_verified: true
        }, false).then(() => {
          bot.sendMessage(msg.chat.id, "User " + username + " twitter account has been verified")
        })
      }
    })
  }
})
bot.onText(/^\/[sS]tart(.+|\b)/, (msg, match) => {

  helper.getUser(msg, match).then(function(myUser) {

    if (_LANG_LENGTH > 1 &&
      (myUser !== undefined && myUser.lang === undefined)) {
      menu.getLangMenu(msg)
    } else if (myUser.human_smiley === undefined || myUser.human_smiley !== "Passed!") {
      helper.setHumanControlSmiley(msg, myUser.lang)
    } else {

      menu.setAdInfo(msg, null, myUser)
    }
  })

});
bot.onText(/^\/[bB]alance(.+|\b)/, (msg, match) => {

  helper.getUser(msg, match).then(function(myUser) {

    if (_LANG_LENGTH > 1 &&
      (myUser !== undefined && myUser.lang === undefined)) {
      menu.getLangMenu(msg)
    } else if (myUser.human_smiley === undefined || myUser.human_smiley !== "Passed!") {
      helper.setHumanControlSmiley(msg, myUser.lang)
    } else {

      menu.getAdBalance(msg, null, myUser);
    }
  })

});

bot.onText(/^\/[tT]witter(.+|\b)/, (msg, match) => {

  helper.getUser(msg, match).then(function(myUser) {

    if (_LANG_LENGTH > 1 &&
      (myUser !== undefined && myUser.lang === undefined)) {
      menu.getLangMenu(msg)
    } else if (myUser.human_smiley === undefined || myUser.human_smiley !== "Passed!") {
      helper.setHumanControlSmiley(msg, myUser.lang)
    } else {

      menu.setInfo(msg, "twitter", myUser.lang)
    }
  })

});

bot.onText(/^\/[dD]eposit(.+|\b)/, (msg, match) => {

  helper.getUser(msg, match).then(function(myUser) {

    if (_LANG_LENGTH > 1 &&
      (myUser !== undefined && myUser.lang === undefined)) {
      menu.getLangMenu(msg)
    } else if (myUser.human_smiley === undefined || myUser.human_smiley !== "Passed!") {
      helper.setHumanControlSmiley(msg, myUser.lang)
    } else {

      var options = {
        parse_mode: "HTML",
        disable_web_page_preview: true,


      };
      var _txt = _dico.avax.deposit.start + "\n" +
        " 👉 " + myUser.tip + "\n" +
        "<i>" + _dico.avax.deposit.end + "</i>"
      bot.sendMessage(msg.chat.id, _txt, options)
    }
  })

});
bot.onText(/^\/[wW]ithdraw(.+|\b)/, (msg, match) => {

  helper.getUser(msg, match).then(function(myUser) {

    if (_LANG_LENGTH > 1 &&
      (myUser !== undefined && myUser.lang === undefined)) {
      menu.getLangMenu(msg)
    } else if (myUser.human_smiley === undefined || myUser.human_smiley !== "Passed!") {
      helper.setHumanControlSmiley(msg, myUser.lang)
    } else {

      menu.getWithdrawMenu(msg, null, myUser);
    }
  })

});
bot.onText(/^\/[iI]nfo(.+|\b)/, (msg, match) => {

  helper.getUser(msg, match).then(function(myUser) {

    if (_LANG_LENGTH > 1 &&
      (myUser !== undefined && myUser.lang === undefined)) {
      menu.getLangMenu(msg)
    } else if (myUser.human_smiley === undefined || myUser.human_smiley !== "Passed!") {
      helper.setHumanControlSmiley(msg, myUser.lang)
    } else {

      menu.getIcoInfo(msg, myUser.lang);
    }
  })

});
bot.onText(/^\/[tT]ipinfo(.+|\b)/, (msg, match) => {

  helper.getUser(msg, match).then(function(myUser) {

    if (_LANG_LENGTH > 1 &&
      (myUser !== undefined && myUser.lang === undefined)) {
      menu.getLangMenu(msg)
    } else if (myUser.human_smiley === undefined || myUser.human_smiley !== "Passed!") {
      helper.setHumanControlSmiley(msg, myUser.lang)
    } else {

      var options = {
        parse_mode: "HTML",
        disable_web_page_preview: true,


      };
      var _txt = _dico.avax.tipinfo.start + "\n" +
        "  <b>Telegram</b>\n" +
        "  |--- " + _dico.avax.tipinfo.tg + "\n\n" +
        "  <b>Discord</b>\n" +
        "  |--- " + _dico.avax.tipinfo.discord_1 + "\n" +
        "  |--- " + _dico.avax.tipinfo.discord_2 + "\n\n" +
        "  <b>Twitter</b>\n" +
        "  |--- " + _dico.avax.tipinfo.twitter
      bot.sendMessage(msg.chat.id, _txt, options)
    }
  })

});

bot.onText(/\/tip@AvalancheTipBot/, (msg, match) => {
  var options = {
    parse_mode: "HTML",
    disable_web_page_preview: true,


  };
  bot.deleteMessage(msg.chat.id, msg.message_id)
  bot.sendMessage(msg.chat.id, "Reply to a post in a group where <b>@AvalancheTipBot</b> belongs with /tip [AMOUNT]", options).then((r) => {
    setTimeout(() => {
      bot.deleteMessage(msg.chat.id, r.message_id)
    }, 3000)
  })
})
bot.onText(/\/tip (.+)/, (msg, match) => {

  var split = msg.text.split(' ')
  console.log(msg)
  if (split.length > 2 || msg.reply_to_message === undefined || isNaN(split[1])) {
    bot.sendMessage(msg.chat.id, _dico.avax.tip.error).then((r) => {

      bot.deleteMessage(msg.chat.id, msg.message_id)
      setTimeout(() => {
        bot.deleteMessage(msg.chat.id, r.message_id)
      }, 5000)
    })
  } else {
    // console.log("start tipping")
    ava.getToWallet(msg.from.id).then((f) => {
      ava.getToWallet(msg.reply_to_message.from.id).then((r) => {
        // console.log('To wallet is ', r)
        ava.sendAvax(f.login, f.pwd, r.xchain, split[1]).then((t) => {
          console.log(t.body)
          // console.log('Sender Wallet ', f)
          // console.log('Receiver Wallet ', r)

          var sender = msg.from.first_name
          if (msg.from.username !== undefined) {
            sender = "@" + msg.from.username
          }
          var receiver = msg.reply_to_message.from.first_name
          if (msg.reply_to_message.from.username !== undefined) {
            receiver = "@" + msg.reply_to_message.from.username
          }
          msg.timestamp = Date.now()
          msg.amount = split[1]
          if (t.body.error !== undefined) {
            msg.status_error = t.body.error;

            _db.set('tip_tg', msg.chat.id + '_' + msg.message_id + '_' + Date.now(), null, msg, false)

            var options = {
              parse_mode: "HTML",
              disable_web_page_preview: true,


            };
            bot.deleteMessage(msg.chat.id, msg.message_id)
            bot.sendMessage(msg.chat.id, sender + ', we didn\'t tipped ' + receiver + "\nCause: " + t.body.error.message, options)
              .then((v) => {
                setTimeout(() => {
                  bot.deleteMessage(msg.chat.id, v.message_id)
                }, 5000)
              })
          } else
          if (t.body !== undefined && t.body.result !== undefined && t.body.result.txID !== undefined) {

            msg.status_result = t.body.result;
            msg.txID = t.body.result.txID;
            _db.set('tip_tg', msg.chat.id + '_' + msg.message_id + '_' + Date.now(), null, msg, false)
            var options = {
              parse_mode: "HTML",
              disable_web_page_preview: true,


            };
            // bot.deleteMessage(msg.chat.id, msg.message_id)
            bot.sendMessage(msg.chat.id,
              // "Sender Wallet " + f.xchain + "\n" +
              // "Receiver Wallet " + r.xchain + "\n" +
              // "Tx hash " + t.body.result.txID + "\n" +

              sender + " just tipped " + receiver + " " + split[1] + " AVAX\n" +
              "<a href='https://explorer.avax.network/tx/" + t.body.result.txID + "'>" + _dico.avax.tx.check + "</a>", options)

            bot.sendMessage(msg.reply_to_message.from.id,


              sender + " just tipped " + receiver + " " + split[1] + " AVAX\n" +
              "<a href='https://explorer.avax.network/tx/" + t.body.result.txID + "'>" + _dico.avax.tx.check + "</a>", options)
          }
        })
      })
    })
  }

});

bot.on("callback_query", function(callbackQuery) {

  var msg = callbackQuery.message


  if (helper.isPrivate(msg) && helper.checkSpam(msg.chat.id)) {


    var control = callbackQuery.data

    // if (control !== "SET AD INFO") {
    //
    //   bot.editMessageReplyMarkup("", {
    //     chat_id: msg.chat.id,
    //     message_id: msg.message_id
    //   })
    // }


    helper.getUser(msg, null).then(function(myUser) {

      var match = []
      match.push('0')
      match.push('')

      // console.log("CONTROL",control)

      if (control.indexOf("GET DASHBOARD") !== -1) {
        control = "GET DASHBOARD"
      } else if (control.indexOf("SET DATAS-") !== -1) {
        control = "SET DATAS"
        // } else if (control.indexOf("REFRESH DASHBOARD") !== -1) {
        //   control = "REFRESH DASHBOARD"
      } else if (control.indexOf("DOWNLOAD DATABASE") !== -1) {

        control = "DOWNLOAD DATABASE"

      } else if (control.indexOf("UPDATE DATABASE") !== -1) {
        control = "UPDATE DATABASE"


      } else if (control.indexOf("CHECK HUMAN CONTROL SMILEY") !== -1) {
        control = "CHECK HUMAN CONTROL SMILEY"

      } else if (control.indexOf("DELETE BULK MESSAGE TEXT") !== -1) {
        control = "DELETE BULK MESSAGE TEXT"
      } else if (control.indexOf("SEND BULK MESSAGE TEXT") !== -1) {
        control = "SEND BULK MESSAGE TEXT"
      } else if (control.indexOf("CONFIRM BULK MESSAGE TEXT") !== -1) {
        control = "CONFIRM BULK MESSAGE TEXT"
      }




      switch (control) {
        //
        // case "SET ENGLISH":
        //   console.log("EN LANG")
        //   helper.setUserLang(msg,'EN')
        //   break;
        // case "SET FRENCH":
        //   helper.setUserLang(msg,'FR')
        //   break;
        case "GO HOME":
          menu.setAdInfo(msg, null, myUser)
          break;
        case "GET ICO INFO":
          menu.getIcoInfo(msg, myUser.lang);
          break;
        case "GET AD RULES":
          menu.getAdRules(msg, myUser.lang);
          break;
        case "GET AD BALANCE":
          // console.log()
          menu.getAdBalance(msg, null, myUser);
          break;
        case "SET AD INFO":
          menu.setAdInfo(msg, null, myUser);
          break;
        case "GET ADMIN PANEL":
          admin.getAdminPanelV2(msg, myUser.lang);
          break;
        case "CLOSE AD":
          var _round = callbackQuery.data.split("_")[1]
          admin.setAdStatus(false, _round).then(function() {
            if (_round === _AD_ROUND_SELECTED) {
              adStatus = false
            }
            menu.setAdInfo(msg, null, myUser)
          });
          break;
        case "OPEN AD":
          var _round = callbackQuery.data.split("_")[1]
          admin.setAdStatus(true, _round).then(function() {
            if (_round === _AD_ROUND_SELECTED) {
              adStatus = true
            }
            menu.setAdInfo(msg, null, myUser)
          });
          break;
        case "GET MORE TASKS":
          menu.getMoreTasks(msg, myUser)
          break;
        case "SET AVAX WALLET":
          _db.set('users_participating_1', msg.chat.id, "Wonton", myUser.AVAXTMP, false)
          bot.sendMessage(msg.chat.id, "✅ Your Avalanche X-Chain wallet is linked!").then(() => {
            setTimeout(() => {
              menu.setAdInfo(msg, null, myUser)
            }, 1000)
          })
          break;
        case "SET DATAS": {
          var _type = callbackQuery.data.split("-")[1]

          if (_type === 'twitter' && myUser.twitter_verified === true) {
            var options = {
              parse_mode: "HTML",
              disable_web_page_preview: true,


            };
            bot.sendMessage(msg.chat.id, "Your twitter account https://www.twitter.com/" + myUser.twitter + " is already verified! 🎉\n" +
              "You can't change it!", options)
          } else
          if (_type === "human_smiley") {
            helper.setHumanControlSmiley(msg, myUser.lang)
          } else {

            menu.setInfo(msg, _type, myUser.lang)
          }

          break;
        }



        case "CHECK HUMAN CONTROL SMILEY":
          var _smiley = callbackQuery.data.split("_")[1]
          helper.checkHumanControlSmiley(msg, _smiley, myUser.human_response, myUser.lang, myUser)
          break;
          // case "SET WEBSITE EMAIL ADDRESS":
          //   menu.setInfo(msg, "website_email", myUser.lang)
          //   break;

        case "DOWNLOAD DATABASE":

          var _round = callbackQuery.data.split("_")[1]
          console.log("DOWNLOAD", _round)
          exporting_v2.init(msg, _round, true)
          break;
        case "UPDATE DATABASE":
          var _round = callbackQuery.data.split("_")[1]
          exporting_v2.getDashBoard(msg, _round, false)
          break;
        case "GET ADMIN DASHBOARD":
          admin.getDashBoard(msg)
          break;
        case "CREATE A NEW BULK MSG":
          bulkMessagesAdmin.createNewMessage(msg, "text")
          break;
        case "GET BULK MESSAGES LIST":
          bulkMessagesAdmin.getList(msg)
          break;
        case "DELETE BULK MESSAGE TEXT":
          var _id = callbackQuery.data.split("_")[1]
          bulkMessagesAdmin.deleteMessageText(msg, _id)
          break;
        case "SEND BULK MESSAGE TEXT":
          var _id = callbackQuery.data.split("_")[1]
          bulkMessagesAdmin.sendBulkMessageText(msg, _id)
          break;
        case "CONFIRM BULK MESSAGE TEXT":
          var _id = callbackQuery.data.split("_")[1]
          bulkMessagesAdmin.confirmBulkMessage(msg, _id)
          break;
        case "GET DASHBOARD":
          var _round = callbackQuery.data.split("_")[1]
          exporting_v2.getDashBoard(msg, _round, false)
          break;
          // case "REFRESH DASHBOARD":
          //   var _round = callbackQuery.data.split("_")[1]
          //   exporting_v2.refresh( _round)
          //   break;
        case "GET SOMEONE STATUS":
          var _round = callbackQuery.data.split("_")[1]
          admin.getIdToInvestigate(msg, _round, myUser.lang)
          break;
        case "SURVEY":
          var _type = callbackQuery.data.split("_")[1]
          var _response = callbackQuery.data.split("_")[2]
          var _require = helper.getRequirementText(msg, _AD_REQUIREMENTS[_type], myUser.lang)
          var _tmpUser = JSON.parse(JSON.stringify(myUser));

          if (_require.format !== undefined)
            msg.text = _require.format(msg)

          _tmpUser[_type] = _response

          if (_require.type === "claimallcompleted" && _require.claimaftercompleted !== undefined &&
            _require.claimaftercompleted && helper.isAllRequirementsDone(_tmpUser, _AD_ROUNDS[_AD_ROUND], _AD_ROUNDS[_AD_ROUND]._AD_REQUIREMENTS[_type].bounty_token_value) === 0) {
            var _txtText = _require.check_invalid

            helper.sendMessageAfterSubmit(msg, _txtText, _type, _txtText, false, myUser)
          } else if (_require.disclaimer !== undefined && _require.disclaimer && myUser['disclaimer'] == undefined) {

            helper.isDisclaimer(msg, _response).then(function(returnDisclaimer) {
              if (!returnDisclaimer) {
                var _txtText = _require.check_invalid

                helper.sendMessageAfterSubmit(msg, _txtText, _type, _txtText, false, myUser)
              } else {
                helper.sendMessageAfterSubmit(msg, _require.text_valid_long, _type, _require.check_valid, true, myUser)
              }

            })


          } else {

            if (_require.check_valid_image !== undefined && _require.check_valid_image.indexOf(".gif") !== -1) {
              var image = __dirname + "/img/" + _require.check_valid_image
              bot.sendDocument(msg.chat.id, image).then(function() {
                helper.sendMessageAfterSubmit(msg, null, _type, _response, true, myUser)
              })
            } else if (_require.check_valid_image !== undefined && _require.check_valid_image.indexOf(".gif") === -1) {
              var image = __dirname + "/img/" + _require.check_valid_image
              bot.sendPhoto(msg.chat.id, image).then(function() {
                helper.sendMessageAfterSubmit(msg, null, _type, _response, true, myUser)
              })
            } else {
              helper.sendMessageAfterSubmit(msg, _require.text_valid_long + "<b> 👉 " + _response + " 👈</b> ", _type, _response, true, myUser)
            }
          }
          break;
        default:
          break;
      }

    })

  }
})

bot.on('text', function(msg, match) {

  if (helper.isPrivate(msg) && helper.checkSpam(msg.chat.id) && msg.text.toLowerCase().indexOf("/start") === -1) {


    helper.getUser(msg, null).then(function(myUser) {

      if (myUser.lang === undefined)
        myUser.lang = "EN"
      var _ad = dico.getWordLang(myUser.lang, "ad", menu.getLangMenu)
      var _submission = dico.getWordLang(myUser.lang, "submission", menu.getLangMenu)

      if (helper.isAdmin(msg) && _underInvestigation) {
        _underInvestigation = false;
        admin.getInfoFromId(msg, myUser.lang)




      } else if (msg.text.indexOf(_ad.btn_home) !== -1) {
        menu.setAdInfo(msg, null, myUser)
      } else if (msg.text.indexOf(_ad.btn_twitter) !== -1) {

        menu.setInfo(msg, "twitter", myUser.lang)
      } else if (msg.text.indexOf('/wallet') !== -1) {

        menu.setInfo(msg, "Wonton", myUser.lang)

      } else if (msg.text.indexOf(_ad.btn_deposit) !== -1) {
        var _keyboard = helper_msg.getKeyboardButtons(msg, myUser.lang)

        var options_keyboard = helper_msg.getKeyboardButtonsOptions(_keyboard)

        var _txt = _dico.avax.deposit.start + "\n" +
          " 👉 <a href='https://explorer.avax.network/address/" + myUser.tip + "'>" + myUser.tip + "</a>\n " +
          "<i>" + _dico.avax.deposit.end + "</i>"
        bot.sendMessage(msg.chat.id, _txt, options_keyboard)
      } else if (msg.text.indexOf(_ad.btn_balance) !== -1) {
        console.log("BALANCE")
        menu.getAdBalance(msg, null, myUser);
      } else if (msg.text.indexOf(_ad.btn_withdraw) !== -1) {

        menu.getWithdrawMenu(msg, null, myUser);
      } else if (msg.text.indexOf(_ad.btn_info) !== -1) {
        menu.getIcoInfo(msg, myUser.lang);
      } else if (msg.text.indexOf(_ad.btn_rules) !== -1) {
        menu.getAdRules(msg, myUser.lang);
      } else if (msg.text.indexOf(_ad.btn_lang) !== -1) {
        menu.getLangMenu(msg)
      } else if (msg.text.toLowerCase().indexOf("/start") === -1 &&
        myUser.type === "admin_create_message_bulk_text") {
        bulkMessagesAdmin.createNewMessageEntry(msg)

      } else if (msg.text.toLowerCase().indexOf("/start") === -1 &&
        myUser.type === "withdraw") {
        if (myUser.AVAX === undefined || myUser.AVAX === null) {
          bot.sendMessage(msg.chat.id, "In order to withdraw, you need to set your Avalanche X-Chain wallet")
        } else {


          var split = msg.text.split(' ')

          if (split.length > 1 || isNaN(split[0])) {
            bot.sendMessage(msg.chat.id, _dico.avax.withdraw.error).then((r) => {
              bot.sendMessage(msg.chat.id, _dico.avax.withdraw.error_2).then((r) => {

              })
            })
          } else {
            // console.log("start tipping")
            ava.getToWallet(msg.from.id).then((f) => {

              ava.sendAvax(f.login, f.pwd, myUser.AVAX, split[0]).then((t) => {
                // console.log(t.body)
                // console.log('Sender Wallet ', f)
                // console.log('Receiver Wallet ', r)
                var options = {
                  parse_mode: "HTML",
                  disable_web_page_preview: true,


                };

                if (t.body.error !== undefined) {
                  var obg = {}
                  obg.status_error = t.body.error;
                  obg.network = 'telegram'
                  obg.chat = msg.chat
                  obg.message_id = msg.message_id
                  _db.set('tip_withdraw', msg.chat.id + '_' + msg.message_id + "_" + Date.now(), null, obg, false)
                  console.log("t", t, f.login, f.pwd, myUser.AVAX, split[0])
                  bot.sendMessage(msg.chat.id, _dico.avax.withdraw.error + '\nCause: ' + t.body.error.message, options)

                } else if (t.body.result.txID !== undefined) {

                  var obg = {}
                  obg.status_result = t.body.result;
                  obg.txID = t.body.result.txID;
                  obg.network = 'telegram'
                  obg.chat = msg.chat
                  obg.message_id = msg.message_id
                  obg.amount = split[0]
                  _db.set('tip_withdraw', msg.chat.id + '_' + msg.message_id + "_" + Date.now(), null, obg, false)


                  var options = {
                    parse_mode: "HTML",
                    disable_web_page_preview: true,


                  };

                  bot.sendMessage(msg.chat.id,
                    // "Sender Wallet " + f.xchain + "\n" +
                    // "Receiver Wallet " + r.xchain + "\n" +
                    // "Tx hash " + t.body.result.txID + "\n" +

                    "You just withdraw " + split[0] + " AVAX\n" +
                    "<a href='https://explorer.avax.network/tx/" + t.body.result.txID + "'>Your transaction will appear here shortly</a>", options)

                  menu.setAdInfo(msg, null, myUser);
                }

              })
            })
          }
        }



      } else if (helper.isLang(msg) !== false) {
        myUser.lang = helper.isLang(msg)
        helper.setUserLang(msg, myUser)
      } else if (msg.text.indexOf(_ad.btn_edit_info) !== -1 && adStatus) {
        menu.setAdInfo(msg, null, myUser);
      } else if (msg.text.indexOf(_ad.btn_edit_info) !== -1 && !adStatus) {
        menu.setAdInfo(msg, null, myUser)
      } else if (
        msg.text.toLowerCase().indexOf("/start") === -1 &&
        _AD_REQUIREMENTS[myUser.type] !== undefined &&
        _AD_REQUIREMENTS[myUser.type].type_data === "text") {

        var _myType = myUser.type
        var _txtText
        var _require = helper.getRequirementText(msg, _AD_REQUIREMENTS[_myType], myUser.lang)


        _require.check(msg, _AD_REQUIREMENTS[myUser.type]).then(function(result) {
          // Format for Twitter
          if (_require.format !== undefined)
            msg.text = _require.format(msg)

          helper.checkDuplicateEntry(msg, myUser.type, _AD_ROUND).then(function(dup) {

            if (!dup) {


              if (_require.check !== undefined &&
                !result) {

                _txtText = _require.check_invalid

                bot.sendMessage(msg.chat.id, _txtText)
                // helper.sendMessageAfterSubmit(msg, _txtText, _myType, _txtText, false, myUser)
                // })
              } else {

                var _val = ""
                if (_require.check_valid !== undefined &&
                  _require.check_valid !== "") {
                  _txtText = _require.text_valid_long
                  _val = _require.check_valid


                } else {

                  if (_require.type === 'AVAXTMP') {
                    var _markup = []
                    _markup.push([{
                      text: "Confirm",
                      callback_data: 'SET AVAX WALLET'
                    }])


                    var options = {
                      parse_mode: "HTML",
                      disable_web_page_preview: true,
                      reply_markup: JSON.stringify({
                        inline_keyboard: _markup
                      })
                    }
                    _db.set('users_participating_' + _AD_ROUND, msg.chat.id, "AVAXTMP", msg.text, false)
                    bot.sendMessage(msg.chat.id, _dico.avax.wallet.link_confirm + "\n<b>" + msg.text + " </b>\n\n" +
                      _dico.avax.wallet.link_confirmed, options)
                  } else {
                    _txtText = _require.text_valid_long + "<b> 👉 " + msg.text + " 👈</b> " + _submission.msg_saved
                    _val = msg.text
                  }

                  //            _db.set('users_participating_' + _AD_ROUND, msg.chat.id, _myType, msg.text, false)

                }
                if (_require.check_valid_image !== undefined && _require.check_valid_image.indexOf(".gif") === -1) {
                  var image = __dirname + "/img/" + _require.check_valid_image
                  console.log("image", image)
                  bot.sendPhoto(msg.chat.id, image).then(function() {
                    helper.sendMessageAfterSubmit(msg, null, _myType, _val, true, myUser)
                  })
                } else if (_require.check_valid_image !== undefined && _require.check_valid_image.indexOf(".gif") !== -1) {
                  var image = __dirname + "/img/" + _require.check_valid_image
                  console.log("image", image)
                  bot.sendDocument(msg.chat.id, image).then(function() {
                    helper.sendMessageAfterSubmit(msg, null, _myType, _val, true, myUser)
                  })
                } else if (!(_require.type === 'AVAXTMP')) {

                  helper.sendMessageAfterSubmit(msg, _txtText, _myType, _val, true, myUser)
                }






              }
            } else {
              if (myUser.type === 'twitter') {
                bot.sendMessage(msg.chat.id, "You have already linked the Twitter account to AvalancheTipBot. This action is not permitted.")
              } else {
                bot.sendMessage(msg.chat.id, _ad.duplicate_entry)
              }

            }
          })
        })


      } else if (myUser.type !== undefined && myUser.type !== null && myUser.type !== false &&
        _AD_REQUIREMENTS[myUser.type] !== undefined &&
        _AD_REQUIREMENTS[myUser.type].type_data !== "text") {
        bot.sendMessage(msg.chat.id, _submission.msg_data_incorrect + _AD_REQUIREMENTS[myUser.type].type)

      }

    })
  }
})
