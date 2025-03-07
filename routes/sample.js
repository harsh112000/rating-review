const { save } = require('../controllers/sample');

module.exports = (router) => {
  router.get('/save', save);
};
