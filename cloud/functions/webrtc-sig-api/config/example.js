const fs = require("fs");
const path = require("path");

module.exports = {
  sdkAppID: '',
  accountType: '',
  privateKey: fs.readFileSync(path.resolve(__dirname, './private_key'))
};