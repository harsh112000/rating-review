/* eslint-disable import/no-extraneous-dependencies */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createTemplate = async (payload) => {
  try {
    const {
      name, customerId, isCommon, questions,
    } = payload;

    const newTemplate = await prisma.template.create({
      data: {
        name,
        customerId,
        isCommon,
        questions: {
          create: questions.map((q) => ({
            text: q.text,
            type: q.type.toUpperCase(),
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return { doc: newTemplate };
  } catch (error) {
    throw new Error('Failed to create template');
  }
};

const getOne = async (payload) => {
  try {
    const { templateId } = payload;

    const template = await prisma.question.findMany({
      where: { templateId },
    });

    if (!template) {
      throw new Error('Template not found');
    }

    return { doc: template };
  } catch (error) {
    throw new Error('Failed to fetch template');
  }
};

const updateTemplate = async (payload) => {
  try {
    const { templateId, body } = payload;

    if (!templateId) {
      throw new Error('templateId is required');
    }

    // 1️⃣ Update the `Template`
    const updatedTemplate = await prisma.template.update({
      where: { id: templateId },
      data: {
        name: body.name,
        isCommon: body.isCommon,
        updatedAt: new Date(),
      },
    });

    // 2️⃣ Fetch existing questions for the template
    const existingQuestions = await prisma.question.findMany({
      where: { templateId },
      select: { id: true, text: true, type: true },
    });

    const questionMap = new Map(existingQuestions.map((q) => [ q.text, q ]));

    await Promise.all(
      body.questions.map(async (q) => {
        const existingQuestion = questionMap.get(q.text);

        if (!existingQuestion) {
          await prisma.question.create({
            data: { text: q.text, type: q.type, templateId },
          });
        } else if (existingQuestion.type !== q.type) {
          await prisma.question.update({
            where: { id: existingQuestion.id },
            data: { type: q.type },
          });
        }
      }),
    );

    return { doc: updatedTemplate };
  } catch (error) {
    console.error('Update Template Error:', error.message);
    throw new Error('Failed to update template and questions');
  }
};

const update = async (payload) => {
  try {
    const { questionId, body } = payload;

    const updatedTemplate = await prisma.question.update({
      where: { id: questionId },
      data: body,

    });

    if (!updatedTemplate) {
      throw new Error('Template not found');
    }

    return { doc: updatedTemplate };
  } catch (error) {
    throw new Error('Failed to update template');
  }
};

module.exports = {
  createTemplate,
  getOne,
  updateTemplate,
  update,
};
