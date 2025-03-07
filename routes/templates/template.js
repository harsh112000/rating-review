// const apiLimit = require('express-rate-limit');
const {
  createTemplate,
} = require('../../controllers/templates/template');

module.exports = (router) => {
  router.post('/template', createTemplate);
  // router.get('/template/questions/:templateId', getOne);
  // router.patch('/template/:templateId', updateTemplate);
  // router.patch('/template/questions/:questionId', update);
};
