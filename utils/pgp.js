const openpgp = require('openpgp');
const { pgp } = require('../config');

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

const signPartner = async priKey => {
  const {
    keys: [privateKey],
  } = await openpgp.key.readArmored(priKey);
  await privateKey.decrypt('sangle');
  const { data: cleartext } = await openpgp.sign({
    message: openpgp.cleartext.fromText('Hello, World!'),
    privateKeys: [privateKey],
  });
  return cleartext;
};

const testPriKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

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
VzJytjFtrespz+1MxDBFh9E=
=jsOW
-----END PGP PRIVATE KEY BLOCK-----`;

// signPartner(testPriKey).then(res => {
//   console.log('Result: ', res);
// });

module.exports = {
  encrypt,
  decrypt,
  signPartner,
};
