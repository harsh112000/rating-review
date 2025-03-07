const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAll = async (payload) => {
  try {
    const { page, offset } = payload;
    const calculatedOffset = (page - 1) * offset;
    const limit = offset;
    const questions = await prisma.question.findMany(
      {
        skip: calculatedOffset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      },
    );
    const totalCount = await prisma.question.count();

    return {
      doc: questions,
      totalCount,
    };
  } catch (error) {
    throw new Error('Failed to fetch questions');
  }
};

const getOne = async (id) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new Error('Question not found');
    }

    return { doc: question };
  } catch (error) {
    throw new Error('Failed to fetch question');
  }
};

const update = async (payload) => {
  try {
    const { id, body } = payload;
    const question = await prisma.question.update({
      where: { id },
      data: body,
    });

    return { doc: question };
  } catch (error) {
    throw new Error('Failed to update question');
  }
};

const create = async (payload) => {
  try {
    const { body } = payload;
    const question = await prisma.question.create({
      data: body,
    });

    return { doc: question };
  } catch (error) {
    throw new Error('Failed to create question');
  }
};

module.exports = {
  getAll,
  getOne,
  update,
  create,
};
