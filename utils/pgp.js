const openpgp = require('openpgp');
const { pgp } = require('../config/config');

const generateNewPrivateKey = async () => {
  const {
    keys: [privateKey],
  } = await openpgp.key.readArmored(pgp.PRIVATE_KEY);
  await privateKey.decrypt('abc12345');
  return privateKey;
};

const encrypt = async message => {
  const newPrivateKey = await generateNewPrivateKey();
  const { data: encrypted } = await openpgp.encrypt({
    message: openpgp.message.fromText(JSON.stringify(message)),
    publicKeys: (await openpgp.key.readArmored(pgp.PUBLIC_KEY)).keys,
    privateKeys: [newPrivateKey],
  });
  return {
    newPrivateKey,
    encrypted,
  };
};

const decrypt = async ({ newPrivateKey, encrypted }) => {
  const { data: decrypted } = await openpgp.decrypt({
    message: await openpgp.message.readArmored(encrypted),
    publicKeys: (await openpgp.key.readArmored(pgp.PUBLIC_KEY)).keys,
    privateKeys: [newPrivateKey],
  });
  return decrypted;
};

// encrypt({ msg: 'hello' }).then(async res => {
//   const { newPrivateKey, encrypted } = res;
//   const a = await decrypt({ newPrivateKey, encrypted });
//   console.log('Ket thuc: ', a);
// });

module.exports = {
  encrypt,
  decrypt,
};
