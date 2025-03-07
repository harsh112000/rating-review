const { Templates: TemplateService } = require('../../services/templates');

const createTemplate = async (req, res) => {
  try {
    const { body } = req;

    const { doc } = await TemplateService.createTemplate(body);

    if (doc) {
      return res.postRequest(doc);
    }

    return res.notFound();
  } catch (error) {
    return res.serverError(error, [
      {
        name: error.name,
        status: error.status,
        message: error.message,
      },
    ]);
  }
};

module.exports = {
  createTemplate,
};
