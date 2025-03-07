const { CustomerTemplates: TemplateService } = require('../../../services/templates');

const getAll = async (req, res) => {
  const {
    params: { customerId },
  } = req;

  try {
    const { doc } = await TemplateService.getAll(customerId);

    if (doc) {
      return res.getRequest(doc);
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
  getAll,
};
