const { Customer: CustomerAuthService } = require('../../../services');

const signUp = async (req, res) => {
  try {
    const {
      fullName, email, phone, password,
    } = req.body;
    const data = {
      fullName,
      email,
      phone,
      password,
    };

    const { doc } = await CustomerAuthService.signUp(data);

    if (doc) {
      return res.postRequest(doc);
    }

    return res.notFound();
  } catch (error) {
    res.serverError(error, [
      {
        name: error.name,
        message: error.message,
      },
    ]);
  }
};

const login = async (req, res) => {
  try {
    const { body: { email, password } } = req;
    const { doc, token } = await CustomerAuthService.login({ email, password });

    if (doc) {
      res.setHeader('token', token);

      return res.postRequest(doc);
    }

    return res.notFound();
  } catch (error) {
    res.serverError(error, [
      {
        name: error.name,
        message: error.message,
      },
    ]);
  }
};

module.exports = {
  signUp,
  login,
};
