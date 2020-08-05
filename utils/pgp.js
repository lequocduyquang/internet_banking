const openpgp = require('openpgp');
const { pgp } = require('../config');

const PUBLIC_KEY = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

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
13QpzkR2QjKhYCBMiFdxZHzskQ==
=FypC
-----END PGP PUBLIC KEY BLOCK-----
`;

const encrypt = async message => {
  const { data: encrypted } = await openpgp.encrypt({
    message: openpgp.message.fromText(JSON.stringify(message)),
    publicKeys: (await openpgp.key.readArmored(PUBLIC_KEY)).keys,
  });
  return {
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

const signPartner = async (priKey, pass) => {
  const {
    keys: [privateKey],
  } = await openpgp.key.readArmored(priKey);
  await privateKey.decrypt(pass);
  const { data: cleartext } = await openpgp.sign({
    message: openpgp.cleartext.fromText('Ngân hàng QuangNguyen'),
    privateKeys: [privateKey],
  });
  return cleartext;
};

module.exports = {
  encrypt,
  decrypt,
  signPartner,
};
