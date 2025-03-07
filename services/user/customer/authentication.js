const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../../../middleware/auth-middleware');

const prisma = new PrismaClient();

const signUp = async (payload) => {
  const {
    fullName, email, phone, password,
  } = payload;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.customer.create({
    data: {
      fullName,
      email,
      phone,
      password: hashedPassword,
    },
  });

  return { doc: user };
};

const login = async (payload) => {
  const { email, password } = payload;

  const user = await prisma.customer.findUnique({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
  });

  return { doc: user, token };
};

module.exports = {
  signUp,
  login,
};
