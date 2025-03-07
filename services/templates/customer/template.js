const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAll = async (customerId) => {
  const templates = await prisma.template.findMany({
    where: { customerId },
    include: {
      questions: true,
    },
  });

  return { doc: templates };
};

module.exports = {
  getAll,
};
