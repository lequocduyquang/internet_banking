/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
const jwt = require('jsonwebtoken');
const axios = require('axios');
const crypto = require('crypto');
const openpgp = require('openpgp');
const moment = require('moment');
const CONFIG = require('../config');

const myPGPPrivateKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

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
35mGld5lq65+xwbsIks/Q3JeNw==
=VePf
-----END PGP PRIVATE KEY BLOCK-----
`;

const myPGPPublicKet = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

xo0EXyo+2AEEALZPofLOiJetqjHaLylg6hqlSNLw0FYs/zNsKN9YuYi45iiNgBk4
uhVWqIUBgZocObzwNImfMB1SG8OkXeZTI9PbdzPHkA4que0W9iUeogpl+rRcbmW4
1hQmCAN7brF9g/HOSqTf4/IJmy2KgJMjw36fWqXeXTUnHtviKQ5PtrNzABEBAAHN
G3F1YW5nbGUgPHF1YW5nbGVAZ21haWwuY29tPsKtBBMBCgAXBQJfKj7YAhsvAwsJ
BwMVCggCHgECF4AACgkQ9JJMDDgb8kOfdgQAtDqLK/xCn8e4xYuIZISUg1of2+k5
LV204QBJo44WhF0bNSmjqMxiUxgktr/pFHihzT3JOjpHPNGZY0M7mfkBBGj0xkjc
OYvA033BuPyB4vb2Ir2TqU2R9s67KBxVvUQgDtuzzcE5i4Or3PFUi1atD9IR8AHe
DASZ++ZJEn7lagzOjQRfKj7YAQQArzZuuGpjnwjUXncowi8JpsdY/5gvDE6C8SqA
NulO7AMydVs/dCY7oyp20oTEsA5+5ip6Woyf9hmC/iqdC+JSu4Ck4RHKulvALsTP
GbYvBC4oGWvsoe5uRvBUpjpxCJPeYqxsHyBI52LlipuXfkjRSlcnfezKHpA5i4mc
k+nMv5MAEQEAAcLAgwQYAQoADwUCXyo+2AUJDwmcAAIbLgCoCRD0kkwMOBvyQ50g
BBkBCgAGBQJfKj7YAAoJEDEGANNYX5S4ZqoD/2FNI6oCgEgl7jA2ToKDzKrSc0JT
kYkX7kKU8eSJN1aCEwCOLozkbUVLlk3W79Sb6T+y2UoN0UniF4mRbb6ySHh+2n7f
h71KpWrRBSQU516pr6Z6HaxZrVO7nTtsKim49qdEkupmJ/PSF0LIkRiwNDt/kB7f
n89bPiW4IRgCjINp7rwD+gKM3Ys7iqE3vRaG8oAW4wamjiz/BQ2kb7aucAAon+g6
rP3oLvR9Rk+GGydFPA+IMtekLGVoyXnC3Fh2UGurP2x5J5aE43jvmjGDL73wn9sm
dfqgoXDJng2BusxATcVSenQ5gTFhlqUuTOmNLVCMK+VMbup5BR1y5kt1mGE+wtDq
zo0EXyo+2AEEAMv1TtB6sjY/pazeE1IxsTTWJ/4rBa59MCFnMxTSMCIKFuTH8R7C
LkuSg+to9TMQvOzz5sZAGksWqOy2JEcvNs3RwKinmt5AvuywFYlbYf9rVPFMIVCu
8wb44T4PAGwH74UWs9Dhv/KACcmignzoQgk56EX3nyiiZU8IO/4AjfZbABEBAAHC
wIMEGAEKAA8FAl8qPtgFCQ8JnAACGy4AqAkQ9JJMDDgb8kOdIAQZAQoABgUCXyo+
2AAKCRBKG359zEzW3u/UA/9zZCZkOuiAmA9E81NpiYMFk1fukI1D7eqsUbT+7PCu
ToXm0anrAzOuMVx3wADklfzb3x9wG253t8bRDLbk+tL6RlxWqq1d72OIUHlE9XIu
lsE8etsGZ3Iosg6QjYy0to1Cbh1SpPUp2NUUnC2swocFKkBuiHz1aqWm1c4K4r3P
m+jfA/wJbqgoXx0y1AmSid+GaiwDeW8MEpovJkjLpAFpgOH1QlBiuVs87fqkAvTh
HTUwn/KOzKx0m+N8yNPtEvTVnD6hhiPMX18FsAwaFX8l/n4Z7CZg4t0VYX551ix9
AKNw9Qdy4xJaz/CVWiHzD/9b35mGld5lq65+xwbsIks/Q3JeNw==
=jaBt
-----END PGP PUBLIC KEY BLOCK-----
`;

const myPGPPrivateKey2 = `-----BEGIN PGP PRIVATE KEY BLOCK-----\nVersion: Keybase OpenPGP v1.0.0\nComment: https://keybase.io/crypto\n\n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\nUSuSPBfljHTvTq2VEmD1gTddJ8Tiq2F9A3Y=\n=h7eh\n-----END PGP PRIVATE KEY BLOCK-----`;

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
  const myPassPhrase = 's2qbanking';
  //  const partnerCode = 'qBanking';
  const fakePartnerCode = 'S2Q Bank';
  ourPrivateKey = myPGPPrivateKey2;

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
      x_partner_code: fakePartnerCode,
      x_signature: digitalSignature,
      x_account_id_hashed: accountIdHashed,
      x_account_id_encrypted: accountIdEncrypted,
      x_entry_time_encrypted: entryTimeEncrypted,
      x_entry_time_hashed: entryTimeHashed,
    },
  });

  instance.interceptors.request.use(
    config => {
      config.headers.x_access_token = fakePartnerCode;
      config.headers.x_signature = digitalSignature;
      config.headers.x_account_id_hashed = accountIdHashed;
      config.headers.x_account_id_encrypted = accountIdEncrypted;
      config.headers.x_entry_time_encrypted = entryTimeEncrypted;
      config.headers.x_entry_time_hashed = entryTimeHashed;
      return config;
    },
    error => {
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
    console.error('ERROR: ', response.error);
    return {
      error: new Error(response.error),
    };
  }
};

// getCustomerInfoPartner('09437776833040', CONFIG.sangle2, myPGPPrivateKey2).then(data => {
//   console.log('Data: ', data.result.data);
// });

const transferMoneyPartnerV2 = async (transactionData, partnerPublicKey, ourPrivateKey) => {
  const secretKey = 'day la secret key';
  const myPassPhrase = 's2qbanking';
  const partnerCode = 'S2Q Bank';

  const dataSend = {
    // Điền thông tin traction data
    toAccountId: transactionData.des_acc,
    toFullName: transactionData.toFullName,
    fromAccountId: transactionData.src_acc,
    fromFullName: transactionData.username,
    fromBankId: 'S2Q Bank',
    transactionAmount: transactionData.amount,
    isFeePayBySender: transactionData.isFeePayBySender,
    fee: transactionData.fee,
    transactioionMessage: transactionData.message,
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
  console.log('1: ', digital_sign);

  digital_sign = digital_sign.substring(
    digital_sign.indexOf('-----BEGIN PGP SIGNATURE-----'),
    digital_sign.length
  );
  digital_sign = digital_sign.replace(/\r/g, '\\n').replace(/\n/g, '');

  const { data: bodyData } = await openpgp.encrypt({
    message: openpgp.message.fromText(JSON.stringify(dataSend)),
    publicKeys: (await openpgp.key.readArmored(partnerPublicKey)).keys,
  });
  console.log('2: ', bodyData);

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
  console.log('Response: ', response);
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

const transferMoneyPartner = async (transaction, ourPrivateKey, partnerPublicKey) => {
  const secretKey = 'day la secret key';
  const myPassPhrase = 's2qbanking';
  const partnerCode = 'S2Q Bank';
  ourPrivateKey = myPGPPrivateKey2;

  const dataSend = {
    toAccountId: transaction.des_acc,
    toFullName: transaction.toFullName,
    fromAccountId: transaction.src_acc,
    fromFullName: 'Quang',
    fromBankId: 'S2Q Bank',
    transactionAmount: transaction.amount,
    isFeePayBySender: transaction.isFeePayBySender,
    fee: transaction.fee,
    transactioionMessage: transaction.transactioionMessage,
  };

  const entryTime = Math.round(new Date().getTime());
  dataSend.entryTime = entryTime;
  const data_hashed = crypto
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
    data_hashed,
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
  console.log(response);
  if (response && !response.error) {
    const ret_req = {
      partner_name: 'Eight',
      request_uri: 'http://34.87.97.142/transactions/receiving-interbank',
      request_header: null,
      request_body: data,
      request_time: Date.now(),
      signature: digital_sign,
      request_amount: transaction.amount,
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
      data: response.data,
    };
  }
  if (response && response.error && response.error.response && response.error.response.status) {
    console.error('Error: ', response.error);
  }
};

// const testTransactionData = {
//   des_acc: '09437776833040',
//   toFullName: 'Nguyen Hoang Sang',
//   src_acc: '123456789',
//   username: 'Test',
//   fromBankId: 'S2Q Bank',
//   amount: 100000,
//   isFeePayBySender: true,
//   fee: 1000,
//   message: 'Chuyển tiền liên ngân hàng',
// };
// // transferMoneyPartner(testTransactionData, CONFIG.sangle2, myPGPPrivateKey2).then(data => {
// //   console.log('Data: ', data);
// // });

// sendMoney(testTransactionData, myPGPPrivateKey2, CONFIG.sangle2);

const getCustomerInfoS2QBank = async account_number => {
  const timestamp = moment().unix();
  const security_key = 'qbanking';
  const baseURL = 'https://s2q-ibanking.herokuapp.com';
  const data = JSON.stringify(account_number);
  try {
    const response = await axios({
      method: 'get',
      url: `public/${account_number}`,
      baseURL: baseURL,
      headers: {
        timestamp,
        security_key,
        hash: crypto
          .createHash('sha256')
          .update(timestamp + data + security_key)
          .digest('hex'),
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// getCustomerInfoS2QBank('1596891106').then(data => {
//   console.log('Data: ', data);
// });

const transferMoneyS2QBank = async (account_number, amount, message) => {
  const timestamp = moment().unix();
  const security_key = 'qbanking';
  const private_key = CONFIG.myRSAPrivateKey;
  const baseURL = 'https://s2q-ibanking.herokuapp.com';
  const data = {
    source_account: '12345',
    destination_account: account_number,
    source_bank: 'qbanking',
    description: message,
    feePayBySender: true,
    fee: 1000,
    amount,
  };
  const _data = JSON.stringify(data);
  try {
    // create signature
    const privateKey = private_key.replace(/\\n/g, '\n');
    const signer = crypto.createSign('sha256');
    signer.update(_data);
    const signature = signer.sign(privateKey, 'hex');

    // send request
    const result = await axios({
      method: 'post',
      url: 'public/transfer',
      baseURL: baseURL,
      headers: {
        timestamp,
        security_key,
        hash: crypto
          .createHash('sha256')
          .update(timestamp + _data + security_key)
          .digest('hex'),
      },
      data: {
        data,
        signature,
      },
    });
    return result.data;
  } catch (error) {
    console.log(error.message);
  }
};

// transferMoneyS2QBank('1596891106', 10000).then(data => {
//   console.log('Data: ', data);
// });

module.exports = {
  generatePartnerCode,
  getCustomerInfoPartner,
  transferMoneyPartner,
  getCustomerInfoS2QBank,
  transferMoneyS2QBank,
};
