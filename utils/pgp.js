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
  await privateKey.decrypt('quangnguyen');
  const { data: cleartext } = await openpgp.sign({
    message: openpgp.cleartext.fromText('Ngân hàng QuangNguyen'),
    privateKeys: [privateKey],
  });
  return cleartext;
};

const testPriKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

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
=R8WG
-----END PGP PRIVATE KEY BLOCK-----
`;

signPartner(testPriKey).then(res => {
  console.log('Result: ', res);
});

module.exports = {
  encrypt,
  decrypt,
  signPartner,
};
