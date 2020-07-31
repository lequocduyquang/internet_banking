const jwt = require('jsonwebtoken');

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
      expiresIn: '1m',
    }
  );
};

const partner1 = {
  id: 2,
  code: 'ABC123',
  name: 'PARTNER_1',
  password: 'partner1',
};

console.log('Partner 1 token: ', generatePartnerCode({ ...partner1 }));

module.exports = {
  generatePartnerCode,
};
