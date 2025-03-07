// const apiLimit = require('express-rate-limit');
const {
  getAll, getOne, update, create,
} = require('../../controllers/questions/questions');

module.exports = (router) => {
  router.get('/questions', getAll);
  router.get('/questions/:id', getOne);
  router.patch('/questions/:id', update);
  router.post('/questions', create);
};
