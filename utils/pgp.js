const openpgp = require('openpgp');
const { pgp } = require('../config/config');

const generateNewPrivateKey = async () => {
  const {
    keys: [privateKey],
  } = await openpgp.key.readArmored(pgp.PRIVATE_KEY);
  return privateKey;
};

generateNewPrivateKey().then(res => {
  console.log(res);
});

// const encrypt = async message => {
//   const encryptMess = await openpgp.encrypt({
//     message: openpgp.message.fromText(JSON.stringify({ msg: 'Hello world' })), // input as Message object
//     publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys, // for encryption
//     privateKeys: [privateKey], // for signing (optional)
//   });
// };

const decrypt = message => {
  return message;
};

module.exports = {
  decrypt,
};
