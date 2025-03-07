const AWS = require('aws-sdk');

class SESService {
  constructor() {
    this.ses = new AWS.SES({
      accessKeyId: 'YOUR_ACCESS_KEY_ID',
      secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
      region: 'YOUR_REGION',
    });
  }

  async sendTextEmail(to, subject, body) {
    const params = {
      Destination: { ToAddresses: [to] },
      Message: {
        Body: { Text: { Data: body } },
        Subject: { Data: subject },
      },
      Source: 'SENDER_EMAIL_ADDRESS',
    };

    await this.ses.sendEmail(params).promise();
  }

  sendHtmlEmail = async (to, subject, body) => {
    const params = {
      Destination: { ToAddresses: [to] },
      Message: {
        Body: { Html: { Data: body } },
        Subject: { Data: subject },
      },
      Source: 'SENDER_EMAIL_ADDRESS',
    };

    await this.ses.sendEmail(params).promise();
  }
  sendTextEmailWithAttachment = async (to, subject, body, attachmentData) => {
    const params = {
      Destination: { ToAddresses: [to] },
      Message: {
        Body: { Text: { Data: body } },
        Subject: { Data: subject },
        Attachments: [{
          Filename: attachmentData.filename,
          Content: attachmentData.content,
          ContentType: attachmentData.contentType,
        }],
      },
      Source: 'SENDER_EMAIL_ADDRESS',
    };

    await this.ses.sendEmail(params).promise();
  }

  sendHtmlEmailWithAttachment = async (to, subject, body, attachmentData) => {
    const params = {
      Destination: { ToAddresses: [to] },
      Message: {
        Body: { Html: { Data: body } },
        Subject: { Data: subject },
        Attachments: [{
          Filename: attachmentData.filename,
          Content: attachmentData.content,
          ContentType: attachmentData.contentType,
        }],
      },
      Source: 'SENDER_EMAIL_ADDRESS',
    };

    await this.ses.sendEmail(params).promise();
  }
}

module.exports = SESService;
