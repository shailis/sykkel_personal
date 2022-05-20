// finds locale language and uses appropriate json file for messages
let path = require("path");
module.exports.getMessages = function (key, lang) {
  let localeFile = path.join(__dirname, "locales", `${lang}.json`);
  let msgs = require(localeFile);
  return msgs[key];
};