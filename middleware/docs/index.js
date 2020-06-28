const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const swaggerDefinition = {
  host: 'localhost:5000',
  basePath: '/',
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
};

const listFile = [
  'admin/register.js',
  'admin/login.js',
  'admin/getAllEmployee.js',
  'admin/getEmployeeById.js',
  'admin/createEmployee.js',
  'admin/deleteEmployee.js',
  'admin/getTransactions.js',
  'employee/register.js',
  'employee/login.js',
  'employee/createCustomer.js',
  'employee/verifyCustomer.js',
];

module.exports = function (app) {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(
      swaggerJSDoc({
        swaggerDefinition,
        apis: listFile.map(fileName => path.join(`${__dirname}/path/${fileName}`)),
      })
    )
  );
};
