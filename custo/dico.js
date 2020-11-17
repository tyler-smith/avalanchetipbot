"use strict";

var dico_en = require('./dico_en.js')
var menu = require('../telegram/menu.js')
var helper = require('../admin/helper.js')

global.myAdminsAd = []

global._LANGS = [
  [{
    text: '🇫🇰 English',
    lang: "EN"
  }],
  // [{
  //   text: '🇫🇷 Français',
  //   lang: "FR"
  // }]
]
global._LANG_DEFAULT = "EN"
global._CRYPTO_NAME = "Avalanche"
global._CRYPTO_TICKER = "WNTN"
global._CRYPTO_CURRENCY = "Wonton"
global._CRYPTO_WALLET_TYPE = "Wonton"
global._AD_BOT_USERNAME = "AvalancheTipBot"
global._AD_BOT_DIR = ""

global._ICO_TOKEN_UNIT_VALUE_DOL = "0.5"

global._ICO_END_DATE = ""

global._CRYPTO_PARTNERS = [

]
global._CRYPTO_LINKS = {
  website: "https://www.avalabs.org/",
  grant: "https://www.avalabs.org/avalanche-x",
  publicsale: "https://info.avax.network/",
  community: "https://community.avax.network/",
  telegram: "https://t.me/avalancheavax",
  telegram_ann: "https://t.me/avalanche_announcements",
  twitter: "https://twitter.com/https://twitter.com/avalabsofficial",
  discord: "https://chat.avalabs.org",
  retweet: "",
  facebook: "https://www.facebook.com/AvaLabsOfficial",
  medium: "https://medium.com/avalabs",
  instagram: "http://www.instagram.com/avalabsofficial/",
  bitcointalk: "",
  github: "https://github.com/ava-labs",
  youtube: "https://www.youtube.com/c/AVALabsofficial",
  linkedin: "https://www.linkedin.com/company/avalabsofficial/",
  download_app: "",
  reddit: "https://reddit.com/r/avax",
  playstore: " ",
  appstore: "",
  whitepaper: "https://www.avalabs.org/whitepapers",
  onepager: " ",
  lightpaper: "",
  support: "https://support.avalabs.org",
  wallet: "https://wallet.avax.network",
  explorer: "https://explorer.avax.network",
  presentation: ".",
  ico: "",
  private_sale: "",
  doc: "https://docs.avax.network/",
  newsletter: "http://eepurl.com/gOQaWj",
  reviews: [

  ]
}

global._ICO_TOKEN_MONEY_SYMBOL = "$"


global._GET_WHITELISTED_LINK = ""
global._GET_WHITELISTED = [{
    name: "",
    link: "",
  },

]

global.multilang = {
  "welcome_lang": "<b>Welcome,</b>\n\n" +
    "First, choose your language.\nYou can edit your language again later.",
}

var dico = {
  EN: dico_en.get()
}


module.exports.getWordLang = function(lang, word, callback) {

  return dico[lang][word]
}
module.exports.getLocalDico = function() {

  return dico
}

module.exports.getDico = function() {
  return dico;
}
