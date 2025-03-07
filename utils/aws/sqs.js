/* eslint-disable import/no-extraneous-dependencies */
const { SQSClient, SendMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');
const {
  aws: {
    AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, SQS_MAIN_QUEUE_URL, SQS_DLQ_URL,
  },
} = require('../../config');
const logger = require('../../logger/logger');

const client = new SQSClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});
const deleteMessage = async (receiptHandle) => {
  const params = {
    QueueUrl: SQS_MAIN_QUEUE_URL,
    ReceiptHandle: receiptHandle,
  };

  try {
    const command = new DeleteMessageCommand(params);

    await client.send(command);
    logger.info('Message deleted successfully from queue.');
  } catch (error) {
    logger.error(`Error deleting message from queue: ${error}`);
  }
};

const sendToDLQ = async (messageBody, messageGroupId) => {
  const params = {
    MessageBody: JSON.stringify(messageBody),
    QueueUrl: SQS_DLQ_URL,
    MessageGroupId: messageGroupId,
    MessageDeduplicationId: Date.now().toString(),
  };

  try {
    const command = new SendMessageCommand(params);
    const result = await client.send(command);

    logger.info(`Message sent to DLQ successfully: ${result.MessageId}`);

    return result;
  } catch (error) {
    logger.error(`Error sending message to DLQ: ${error}`);
    throw error;
  }
};

const sendMessage = async (messageBody, messageGroupId) => {
  const params = {
    MessageBody: JSON.stringify(messageBody),
    QueueUrl: SQS_MAIN_QUEUE_URL,
    MessageGroupId: messageGroupId,
    MessageDeduplicationId: Date.now().toString(),
  };

  try {
    const command = new SendMessageCommand(params);
    const result = await client.send(command);

    logger.info(`Message sent successfully: ${result.MessageId}`);

    return result;
  } catch (error) {
    logger.error(`Error sending message to main queue: ${error}`);

    return sendToDLQ(messageBody, messageGroupId);
  }
};

module.exports = {
  sendMessage,
  deleteMessage,
};
