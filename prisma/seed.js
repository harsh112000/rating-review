const { PrismaClient } = require('@prisma/client');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
const logger = require('../logger/logger');

const prisma = new PrismaClient();

const seedAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash('Harsh@123', 10);

    const superAdmin = await prisma.admin.upsert({
      where: { email: 'harsh.srivastava@agileworldtechnologies.com' },
      update: {},
      create: {
        fullName: 'Harsh Srivastava',
        email: 'harsh.srivastava@agileworldtechnologies.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      },
    });

    logger.info('Super Admin seeded:', superAdmin);
  } catch (error) {
    logger.error('Error seeding Super Admin:', error);
  } finally {
    await prisma.$disconnect();
  }
};

seedAdmin();
