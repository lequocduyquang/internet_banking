/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
const jwt = require('jsonwebtoken');
const axios = require('axios');
const crypto = require('crypto');
const openpgp = require('openpgp');
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
  //  const partnerCode = 'qBanking';
  const fakePartnerCode = 'S2Q Bank';

  const accountIdHashed = crypto.createHmac('SHA1', secretKey).update(accountId).digest('hex');
  console.log('1: ', accountIdHashed);

  let { data: accountIdEncrypted } = await openpgp.encrypt({
    message: openpgp.message.fromText(accountId),
    publicKeys: (await openpgp.key.readArmored(partnerPublicKey)).keys,
  });

  accountIdEncrypted = accountIdEncrypted.replace(/\r/g, '\\n').replace(/\n/g, '');
  console.log('2: ', accountIdEncrypted);

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
  console.log('3: ', entryTimeEncrypted);

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
    console.error('ERROR: ', response.error);
    return {
      error: new Error(response.error),
    };
  }
};

getCustomerInfoPartner('09437776833040', CONFIG.sangle2, myPGPPrivateKey).then(data => {
  console.log('Data: ', data);
});

// const transferMoneyPartner = async (transactionData, partnerPublicKey, ourPrivateKey) => {
//   const secretKey = 'day la secret key';
//   const myPassPhrase = 'quangle';
//   const partnerCode = 'qBanking';

//   const dataSend = {
//     // Điền thông tin traction data
//   };
//   const entryTime = Math.round(new Date().getTime());
//   dataSend.entry_time = entryTime;
//   const dataHashed = crypto
//     .createHmac('SHA1', secretKey)
//     .update(JSON.stringify(dataSend))
//     .digest('hex');

//   const {
//     keys: [privateKey],
//   } = await openpgp.key.readArmored(ourPrivateKey);

//   await privateKey.decrypt(myPassPhrase);

//   let { data: digital_sign } = await openpgp.sign({
//     message: openpgp.cleartext.fromText(JSON.stringify(dataSend)),
//     privateKeys: [privateKey],
//   });

//   digital_sign = digital_sign.substring(
//     digital_sign.indexOf('-----BEGIN PGP SIGNATURE-----'),
//     digital_sign.length
//   );
//   digital_sign = digital_sign.replace(/\r/g, '\\n').replace(/\n/g, '');

//   const { data: bodyData } = await openpgp.encrypt({
//     message: openpgp.message.fromText(JSON.stringify(dataSend)),
//     publicKeys: (await openpgp.key.readArmored(partnerPublicKey)).keys,
//   });

//   const data = {
//     data: bodyData,
//     digital_sign,
//     dataHashed,
//   };

//   const instance = axios.create({
//     baseURL: 'http://34.87.97.142/transactions/receiving-interbank',
//     timeout: 5000,
//   });

//   const request = instance.interceptors.request.use(
//     config => {
//       config.headers.x_partner_code = partnerCode;
//       return config;
//     },
//     error => {
//       console.log('error ne', error);
//       return Promise.reject(error);
//     }
//   );

//   instance.interceptors.response.use(
//     response => {
//       return response;
//     },
//     error => {
//       return Promise.resolve({ error });
//     }
//   );

//   const response = await instance({
//     method: 'post',
//     url: '',
//     data,
//   });
//   if (response && !response.error) {
//     const ret_req = {
//       partner_name: 'Eight',
//       request_uri: 'http://34.87.97.142/transactions/receiving-interbank',
//       request_header: null,
//       request_body: data,
//       request_time: Date.now(),
//       signature: digital_sign,
//       request_amount: transactionData.amount,
//     };
//     const ret_res = {
//       partner_name: 'Eight',
//       response_time: Date.now(),
//       response_data: response.data.data,
//       response_header: response.config.headers,
//       signature: response.data.data.digital_sign,
//     };

//     return {
//       request: ret_req,
//       response: ret_res,
//       result: response.data,
//     };
//   }
//   if (response && response.error && response.error.response && response.error.response.status) {
//     return {
//       error: new Error(response.error),
//     };
//   }
// };

module.exports = {
  generatePartnerCode,
  getCustomerInfoPartner,
  // transferMoneyPartner,
};
