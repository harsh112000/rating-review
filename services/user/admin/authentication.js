const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'abcdexasdf';

const prisma = new PrismaClient();

const findAdminByEmail = async (email) => {
  const response = await prisma.admin.findUnique({
    where: { email },
  });

  return response;
};

const signUp = async (payload) => {
  const {
    fullName, email, password, role,
  } = payload;

  if (role === 'SUPER_ADMIN') {
    throw new Error('SUPER_ADMIN cannot be created via API');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const response = await prisma.admin.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      role,
    },
  });

  return { doc: response };
};

const validatePassword = async (password, hashedPassword) => bcrypt.compare(password, hashedPassword);

const generateToken = (admin) => jwt.sign(
  { id: admin.id, email: admin.email, role: admin.role },
  JWT_SECRET,
);

module.exports = {
  signUp, findAdminByEmail, validatePassword, generateToken,
};
