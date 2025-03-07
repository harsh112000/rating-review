const { Questions: QuestionService } = require('../../services');

const getAll = async (req, res) => {
  try {
    const { query: { page, offset } } = req;
    const data = {
      page: Number(page) || 1,
      offset: Number(offset) || 25,
    };

    const { doc, totalCount } = await QuestionService.getAll(data);

    if (doc) {
      const lastPage = Math.ceil(totalCount / data.offset);
      const responseData = {
        data: doc,
        page: data.page,
        offset: data.offset,
        totalCount,
        lastPage,
      };

      return res.getRequest(responseData);
    }

    return res.notFound();
  } catch (error) {
    return res.serverError(error, [
      {
        name: error.name,
        message: error.message,
      },
    ]);
  }
};

const getOne = async (req, res) => {
  try {
    const { params: { id } } = req;
    const { doc } = await QuestionService.getOne(id);

    if (doc) {
      return res.getRequest(doc);
    }

    return res.notFound();
  } catch (error) {
    return res.serverError(error, [
      {
        name: error.name,
        message: error.message,
      },
    ]);
  }
};

const update = async (req, res) => {
  try {
    const { params: { id } } = req;
    const { body } = req;
    const data = { id, body };

    if (!id || Number.isNaN(Number(id))) {
      return res.badRequest('Invalid question ID');
    }

    const { doc } = await QuestionService.update(data);

    if (doc) {
      return res.updated(doc);
    }

    return res.notFound();
  } catch (error) {
    return res.serverError(error, [
      {
        name: error.name,
        message: error.message,
      },
    ]);
  }
};

const create = async (req, res) => {
  try {
    const { body } = req;
    const data = { body };

    const { doc } = await QuestionService.create(data);

    if (doc) {
      return res.postRequest(doc);
    }

    return res.badRequest('Failed to create question');
  } catch (error) {
    return res.serverError(error, [
      {
        name: error.name,
        message: error.message,
      },
    ]);
  }
};

module.exports = {
  getAll,
  getOne,
  update,
  create,
};
