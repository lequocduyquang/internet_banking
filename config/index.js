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
  pgp: {
    PRIVATE_KEY: `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

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
=Pdto
-----END PGP PRIVATE KEY BLOCK-----
`,

    PUBLIC_KEY: `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

xo0EXsjIiAEEAMfr2dIz89gZQUM4DqhAN2wX7ouVsVK7V+Rnlma84YX5atzyS+Pa
kCOIW6lFpNfoEtV1fKL24V9SPfVcYWfgi3n/dVsLA/MzkqUqM8zim1sOb7fB6qi3
3UAJccD5FqHGhgj8RVf/em68aXVd8bNq/UiMCjvLxXL8+6po9SY1Vw15ABEBAAHN
J3F1YW5nbGUgKGRhc2RhKSA8ZHV5cXVhbmdidHhAZ21haWwuY29tPsKtBBMBCgAX
BQJeyMiIAhsvAwsJBwMVCggCHgECF4AACgkQf36zzTXzQKJvmQP/c8SkGOztA8t4
HGKi2+qZUtFyRBd5/yTVcyFoLrGUN4Nm5is9wWdunvb5LwWgKUmQ87SidNvQNx5I
t4jbghNc735/1EGOE69pdoApxMlzSi+tVONHtcYLnqquLDNkMD5UUbYXCgu1ipNN
gSWkUYkcsuSqOiC1KT5rpZS2JOnkGZrOjQReyMiIAQQAzowEFAjYZ8To/OD3DIb6
VeH89Da9kc+IdkPJ6HxS7O5XcdHRJtUI5XBqq2kQ7kqM5lWbHU7BmU4s1kcM8QmF
+jhrt8rQXfUc5dkCoXKxVd4O2UrracMqPNbkvUqd9kNf+wS6C/693KfT9Iku9JAd
o0NrABh/A8wcJ0o4NuJh7IkAEQEAAcLAgwQYAQoADwUCXsjIiAUJDwmcAAIbLgCo
CRB/frPNNfNAop0gBBkBCgAGBQJeyMiIAAoJEITDNA9RXYtO/GAD/i2MWLE2L+CP
SmLarSD6A6Kg0B4qpRsTZ7Nw0r+IXVQ3K7ltjT3b7EmXaOmbsBaRtUlAEE3c84J7
10mZ5X/9BtbhvC9t+04KJpA2BcDG+93DFO4JkzsWCZl8nwNJVTZn8HLqGFN3LLhA
lzq0FWWlYXc7QCbFYM8/ahXQ4Crbz3t0Y6UEAJSVbRIewmZ2UYBGDKa8jhjePvm1
FNpzicaTDsBdDn8WUJFLSMQpyR5vVZ6NrcoIhX/pefkdn7+6CwTMdtY8XILJDNwl
tSqAzUVhfupK1BZV/EAlSbVjHIsoTvhh2hKA1TWcWEvFGj2QxLvqfbJA5gVnT6lx
US5psV/D4EOYtGGPzo0EXsjIiAEEAL1EBEkgiMY/ohK5jwxoTpU7r0dm70rAcUUx
+NEpeieSVD8Ykal3QmJds7k8xJswnHZ+3+SCW4KDhpjXwTxPbC8GQ4sgB73Tb32Z
GPrahfuwCCVP95ss7y04+54bq6AWDxbyB5KNpWjChQeQ9PAjPjpkrOmsr38Ubksa
jUsuz7zDABEBAAHCwIMEGAEKAA8FAl7IyIgFCQ8JnAACGy4AqAkQf36zzTXzQKKd
IAQZAQoABgUCXsjIiAAKCRAwNXIEc2t+9gQWA/9vw1LYyKZtXuh9FI4BGgJ/YOAG
fdUQuiPlukEWW3N6IvYMmGUAe51SmR+ZRPv0+aDTN+CGh7wb69FKChDEXzT6vUgc
Xtshi0oGNLTSzkS2dUk6dA7EoDwecOWv16VpUzy4jNsYoL/+K0iLmWN+wwC6ozYB
h2UzyZzUbuwhHjHTBhrkA/9pHf8lwyCOLqoo+5Vvbt7hJZoqBpdP6bQyNYIMvn2n
qYISSA5VLydSF0Cf9waR7PMRVX9l0aUNV7UkTT7mO8qKzvihiQQ8GD9Z94viyC1i
EFZRONAyZmmzJeTNkHjJfeVBvqGgUL6i/hYCsMaoxZK55QZB2vrxY0BnOhgo3326
ow==
=Mr8m
-----END PGP PUBLIC KEY BLOCK-----
`,
  },
  transaction: {
    fee: 1000,
  },
};

const getConfig = env => {
  const envConfig = require(`./${env}`);
  return Object.assign(defaultConfig, envConfig);
};

module.exports = getConfig(process.env.NODE_ENV);
