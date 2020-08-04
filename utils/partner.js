/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
const jwt = require('jsonwebtoken');
const axios = require('axios');
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

const getCustomerInfoPartner = async (accountId, partnerPublicKey, ourPrivateKey) => {
  const secretKey = 'day la secret key';
  const myPassPhrase = 'quangle';
  const partnerCode = 'qBanking';

  const accountIdHashed = crypto.createHmac('SHA1', secretKey).update(accountId).digest('hex');

  let { data: accountIdEncrypted } = await openpgp.encrypt({
    message: openpgp.message.fromText(accountId),
    publicKeys: (await openpgp.key.readArmored(partnerPublicKey)).keys,
  });

  accountIdEncrypted = accountIdEncrypted.replace(/\r/g, '\\n').replace(/\n/g, '');
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

  const {
    keys: [privateKey],
  } = await openpgp.key.readArmored(ourPrivateKey);
  await privateKey.decrypt(myPassPhrase);

  let { data: digitalSignature } = await openpgp.sign({
    message: openpgp.cleartext.fromText(accountId),
    privateKeys: [privateKey],
  });

  digitalSignature = digitalSignature.replace(/\r/g, '\\n').replace(/\n/g, '');
  const instance = axios.create({
    baseURL: 'http://34.87.97.142/transactions/receiver-interbank',
    timeout: 5000,
    headers: {
      x_partner_code: partnerCode,
      x_signature: digitalSignature,
      x_account_id_hashed: accountIdHashed,
      x_account_id_encrypted: accountIdEncrypted,
      x_entry_time_encrypted: entryTimeEncrypted,
      x_entry_time_hashed: entryTimeHashed,
    },
  });

  instance.interceptors.request.use(
    config => {
      config.headers.x_access_token = partnerCode;
      config.headers.x_signature = digitalSignature;
      config.headers.x_account_id_hashed = accountIdHashed;
      config.headers.x_account_id_encrypted = accountIdEncrypted;
      config.headers.x_entry_time_encrypted = entryTimeEncrypted;
      config.headers.x_entry_time_hashed = entryTimeHashed;
      return config;
    },
    error => {
      console.log('error ne', error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      return Promise.resolve({ error });
    }
  );
  const response = await instance({
    method: 'get',
    url: '',
  });

  if (response && !response.error) {
    return {
      result: response.data,
    };
  }
  if (response && response.error && response.error.response && response.error.response.status) {
    return {
      error: new Error(response.error),
    };
  }
};

const transferMoneyPartner = async (transactionData, partnerPublicKey, ourPrivateKey) => {
  const secretKey = 'day la secret key';
  const myPassPhrase = 'quangle';
  const partnerCode = 'qBanking';

  const dataSend = {
    // Điền thông tin traction data
  };
  const entryTime = Math.round(new Date().getTime());
  dataSend.entry_time = entryTime;
  const dataHashed = crypto
    .createHmac('SHA1', secretKey)
    .update(JSON.stringify(dataSend))
    .digest('hex');

  const {
    keys: [privateKey],
  } = await openpgp.key.readArmored(ourPrivateKey);

  await privateKey.decrypt(myPassPhrase);

  let { data: digital_sign } = await openpgp.sign({
    message: openpgp.cleartext.fromText(JSON.stringify(dataSend)),
    privateKeys: [privateKey],
  });

  digital_sign = digital_sign.substring(
    digital_sign.indexOf('-----BEGIN PGP SIGNATURE-----'),
    digital_sign.length
  );
  digital_sign = digital_sign.replace(/\r/g, '\\n').replace(/\n/g, '');

  const { data: bodyData } = await openpgp.encrypt({
    message: openpgp.message.fromText(JSON.stringify(dataSend)),
    publicKeys: (await openpgp.key.readArmored(partnerPublicKey)).keys,
  });

  const data = {
    data: bodyData,
    digital_sign,
    dataHashed,
  };

  const instance = axios.create({
    baseURL: 'http://34.87.97.142/transactions/receiving-interbank',
    timeout: 5000,
  });

  const request = instance.interceptors.request.use(
    config => {
      config.headers.x_partner_code = partnerCode;
      return config;
    },
    error => {
      console.log('error ne', error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      return Promise.resolve({ error });
    }
  );

  const response = await instance({
    method: 'post',
    url: '',
    data,
  });
  if (response && !response.error) {
    const ret_req = {
      partner_name: 'Eight',
      request_uri: 'http://34.87.97.142/transactions/receiving-interbank',
      request_header: null,
      request_body: data,
      request_time: Date.now(),
      signature: digital_sign,
      request_amount: transactionData.amount,
    };
    const ret_res = {
      partner_name: 'Eight',
      response_time: Date.now(),
      response_data: response.data.data,
      response_header: response.config.headers,
      signature: response.data.data.digital_sign,
    };

    return {
      request: ret_req,
      response: ret_res,
      result: response.data,
    };
  }
  if (response && response.error && response.error.response && response.error.response.status) {
    return {
      error: new Error(response.error),
    };
  }
};

module.exports = {
  generatePartnerCode,
  getCustomerInfoPartner,
  transferMoneyPartner,
};
