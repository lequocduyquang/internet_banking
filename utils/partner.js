const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const openpgp = require('openpgp');

const generatePartnerCode = ({ id, code, name, password }) => {
  return jwt.sign(
    {
      id: id,
      code: code,
      name: name,
      password: password,
    },
    process.env.JWT_PARTNER_SECRET || 'supersecretpartner',
    {
      expiresIn: '1h',
    }
  );
};

const getCustomerInfoPartner = async accountId => {
  const secretKey = 'day la secret key';
  const partnerPublicKey = '';
  const ourPrivateKey = '';
  const passphrase = '123456';

  const accountIdHashed = crypto.createHmac('SHA1', secretKey).update(accountId).digest('hex');

  let { data: accountIdEncrypted } = await openpgp.encrypt({
    message: openpgp.message.fromText(accountId),
    publicKeys: (await openpgp.key.readArmored(partnerPublicKey)).keys,
  });

  accountIdEncrypted = accountIdEncrypted.replace(/\r/g, '\\n').replace(/\n/g, '');
  const {
    keys: [privateKey],
  } = await openpgp.key.readArmored(ourPrivateKey);
  await privateKey.decrypt(passphrase);

  let { data: digitalSignature } = await openpgp.sign({
    message: openpgp.cleartext.fromText(accountId),
    privateKeys: [privateKey],
  });

  digitalSignature = digitalSignature.replace(/\r/g, '\\n').replace(/\n/g, '');
  const currentTime = Math.round(new Date().getTime());
  const entryTimeHashed = crypto
    .createHmac('SHA1', secretKey)
    .update(currentTime.toString())
    .digest('hex');

  let { data: entryTimeEncrypted } = await openpgp.encrypt({
    message: openpgp.message.fromText(currentTime.toString()),
    publicKeys: (await openpgp.key.readArmored(partnerPublicKey)).keys,
  });

  entryTimeEncrypted = entryTimeEncrypted.replace(/\r/g, '\\n').replace(/\n/g, '');

  return {
    digitalSignature,
    accountIdHashed,
    accountIdEncrypted,
    entryTimeHashed,
    entryTimeEncrypted,
  };
};

module.exports = {
  generatePartnerCode,
  getCustomerInfoPartner,
};
