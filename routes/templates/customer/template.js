const {
  getAll,
} = require('../../../controllers/templates/customer/template');

module.exports = (router) => {
  router.get('/customer/template/:customerId', getAll);
};
