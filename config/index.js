const { version, name } = require('../package.json');

module.exports = {
  VERSION: process.env.VERSION || version,
  NAME: process.env.NAME || name,
  DOMAIN: process.env.DOMAIN || 'http://localhost:2103',
  HOST: process.env.HOST || '0.0.0.0',
  PORT: process.env.PORT || 3000,
  DATABASE: {
    name: process.env.DB_NAME,
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    options: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      freezeTableName: true,
      define: {
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30 * 1000,
        idle: 10000,
      },
      dialectOptions: {
        decimalNumbers: true,
        charset: 'utf8mb4',
      },
      logging: false,
    },
  },
  aws: {
    ACCESS_KEY: process.env.S3_ACCESS_KEY,
    SECRET_KEY: process.env.S3_SECRET_KEY,
    BUCKET_NAME: process.env.S3_BUCKET_NAME,
    REGION: process.env.S3_REGION,
    SQS_DLQ_URL: process.env.SQS_DLQ_URL,
    SQS_MAIN_QUEUE_URL: process.env.SQS_MAIN_QUEUE_URL,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    FILE_TYPES: [
      'json', 'image/png', 'image/jpg', 'image/jpeg', 'image/tiff',
      'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ],
  },
};
