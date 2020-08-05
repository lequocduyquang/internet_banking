/* eslint-disable import/no-dynamic-require */
/* eslint global-require: 0 */

const envFound = require('dotenv').config();

if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const defaultConfig = {
  port: process.env.PORT || 5000,
  postgresSQL: {
    host: process.env.PSQL_HOST || 'internet-banking.cgz7dwdib785.us-east-2.rds.amazonaws.com',
    port: process.env.PSQL_PORT || 5432,
    database: process.env.PSQL_DATABASE || 'postgres',
    username: process.env.PSQL_USERNAME || 'postgres',
    password: process.env.PSQL_PASSWORD || 'Duyquang!2006',
    dialect: 'postgres',
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis-12222.c10.us-east-1-3.ec2.cloud.redislabs.com',
    port: process.env.REDIS_PORT || 12222,
    password: process.env.REDIS_PASSWORD || 'jobfit2020',
  },
  transaction: {
    fee: 1000,
  },
  quangnguyen_public_pgp_key: `-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: Keybase OpenPGP v1.0.0\nComment: https://keybase.io/crypto\n\nxo0EXsSoRgEEAMY1xjujGbJflS/dzCjPw1CcZVPr5vMxOXcS7IXA4Qp4Ndsa/pPa\n26r1NNafBxfJ/lkSBj/KWGFPqsjd6U25LY2VsNeWgh9bct7tTQN0m9pOBU9Iu6tu\nm+gBbNell5XmT58dL3HAowB+7/oIFRkd5oQzv5WS4gSuZLn5mk+EP+/VABEBAAHN\nInMycSA8YXF1YXJpdXMuc3VwZXJzdGFyQGdtYWlsLmNvYT7CrQQTAQoAFwUCXsSo\nRgIbLwMLCQcDFQoIAh4BAheAAAoJEDu4fPTvbOqwjR8D/ixHYS2mFBiRbu3Ug40l\nCLXOE2yj9yeDG46HCk2dPVfLzECKA65GqHafVWLK/UaN9jXSkGZS5Sqb6LXCX0IZ\ng1QG6TWhLqX0ZkXmln7HV5hoaDpwgSz4cInYYcvvqN7AR3HmYl0A6AFwlsc3jc11\ndjIJMZK7dAaLE+QjG2i0DWWZzo0EXsSoRgEEANstPC8XvKdPT9iRUPlYYp+UhSI8\nBS08InoxXgzZSajjnMhg7RcJKIqRkTebjYfmzPnWfeuypQ5vOakU4HqyCReRhTtG\ngH/ifWEueJxK3IbQieXmooH4G/Z0461Hu8IRVAJ23RqRxzQ9M/Nse+1Wu3q80//F\npm55Yiy9DWzT+63VABEBAAHCwIMEGAEKAA8FAl7EqEYFCQ8JnAACGy4AqAkQO7h8\n9O9s6rCdIAQZAQoABgUCXsSoRgAKCRCFvqQSd53migEXA/98RpHKCbHHpLuKcjBi\nn8D9WlZunKvj8mWsE2Ftkt7H4RcyR2hDgcr+oFgu9ADe/Ll8s7L2cQYet+BbKycg\ne00z9evwiNExPrlZww3BRLsy3q3Uy7Anv7mCCdArVpOKoL7XGj9tCNs89v5C8GWE\nLxiUFmCQzWM3Os6wR9SNjgJkBy1NA/9xE3m0Y7x2L9F5R/GSJA1vVr1Ac0FuJ9Ly\nqJSzdE1y+r96PtpBfjhOFpk66EIey7EzZVmbAQ/Kd6mvbMWb6wDZe/RDWUMRa3XY\n5m1bHRdbHdKgkW207FtdLC7sJbjK6xOdYMKbjionYTd9Lm/O9I1qn838Xn1wVfxd\nWE4u6pMGOc6NBF7EqEYBBADFKe9ofAyxC3xuZXmPDpB4fVZvNbJC9kD7jpSGF3hQ\nWVbZs919ayEa8TN4Gfc55o7/EdOhwOIFE2Z4jeKqCg4pHB2ke72f+yIKpNc9EtT4\nj9i3ca7U68lMhKiyYIg/UymxfUIm94FI8FF37gmRwX3T9l/XVa52RNtgBxhlhtIH\nOQARAQABwsCDBBgBCgAPBQJexKhGBQkPCZwAAhsuAKgJEDu4fPTvbOqwnSAEGQEK\nAAYFAl7EqEYACgkQD5yWPgOTuIJa1gP/SbAIEmA9oN4cv76IbKggQbwAnS6hwEcn\nzTNa1jfmma3dty5mQ3GjK3ENc4GKqyfy9Pyi2BPLLcsu78mAcqwEtnuhd8mnZuSm\nXSG7E2T/LhIP5EbGecKpk9eF9fNKrxVTd8D2qNvxefGJcifby81bGMMRYuu9Zl9Y\nLd8LdseGd1AZVwP+JS8IgIWEIfAG/Q+nuEAoC98ze5tbyJUqgxBn56tbwU1+txzr\n43+aoUDKL00HUaM5N3IaTUpMayh3ooy+lWoQipPmHal3UkMHmpyDDi7QJcDUQlh6\nbh3tyULIj1Bwr6W1wq6HqV4eUSuSPBfljHTvTq2VEmD1gTddJ8Tiq2F9A3Y=\n=3bra\n-----END PGP PUBLIC KEY BLOCK-----`,
  sangle2: `-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: Keybase OpenPGP v1.0.0\nComment: https://keybase.io/crypto\n\n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\naWsFa5FTZM6nd8ohBThLdSvOoFxip5w=\n=zEGz\n-----END PGP PUBLIC KEY BLOCK-----`,
  my_pgp_public_key: `-----BEGIN PGP PUBLIC KEY BLOCK-----
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
  `,
  my_pgp_private_key: `-----BEGIN PGP PRIVATE KEY BLOCK-----
  Version: Keybase OpenPGP v1.0.0
  Comment: https://keybase.io/crypto
  
  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
  35mGld5lq65+xwbsIks/Q3JeNw==
  =VePf
  -----END PGP PRIVATE KEY BLOCK-----
  `,
};

const getConfig = env => {
  const envConfig = require(`./${env}`);
  return Object.assign(defaultConfig, envConfig);
};

module.exports = getConfig(process.env.NODE_ENV);
