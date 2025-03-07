const express = require('express');
const { PrismaClient } = require('@prisma/client');
const User = require('../../database');
const { sequelize } = require('../../database');

const prisma = new PrismaClient();
const router = express.Router();

router.post('/api/templates/:id/questions', async (req, res) => {
  try {
    const { id } = req.params;
    const { questionText, questionType } = req.body;

    const template = await prisma.template.findUnique({
      where: { id: parseInt(id) },
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const newQuestion = await prisma.question.create({
      data: {
        questionText,
        questionType,
        templateId: parseInt(id),
      },
    });

    return res.status(201).json({
      message: 'Question added successfully',
      question: newQuestion,
    });
  } catch (error) {
    console.error('Error adding question:', error);

    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
