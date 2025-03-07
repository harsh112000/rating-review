const jwt = require('jsonwebtoken');
const { Admin: AdminService } = require('../../../services');

const signUp = async (req, res) => {
  try {
    const {
      body: {
        fullName, email, password, role,
      },
    } = req;
    const data = {
      fullName,
      email,
      password,
      role,
    };
    const existingAdmin = await AdminService.findAdminByEmail(email);

    if (existingAdmin) {
      return res.badRequest('field-validation', 'Email already exists');
    }

    const { doc } = await AdminService.signUp(data);

    if (doc) {
      return res.postResponse(doc);
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

const login = async (req, res) => {
  try {
    const {
      body: { email, password },
    } = req;
    const admin = await AdminService.findAdminByEmail(email);

    if (!admin) {
      return res.badRequest('field-validation', 'Invalid email or password');
    }
    const isValidPassword = await AdminService.validatePassword(password, admin.password);

    if (!isValidPassword) {
      return res.badRequest('field-validation', 'Invalid email or password');
    }
    const token = AdminService.generateToken(admin);

    res.setHeader('token', token);

    return res.postRequest({ token });
  } catch (error) {
    return res.serverError(error, [
      {
        name: error.name,
        message: error.message,
      },
    ]);
  }
};

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.unauthorized('No token provided');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded;
  next();
};

const isAdmin = async (req, res, next) => {
  const { user } = req;

  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return res.unauthorized('You are not authorized to access this resource');
  }
  next();
};

const isSuperAdmin = async (req, res, next) => {
  const { user } = req;

  if (user.role !== 'SUPER_ADMIN') {
    return res.unauthorized('You are not authorized to access this resource');
  }
  next();
};

module.exports = {
  signUp, login, verifyToken, isAdmin, isSuperAdmin,
};
