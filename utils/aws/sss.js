/* eslint-disable import/no-extraneous-dependencies */
const crypto = require('crypto');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { S3, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const {
  aws: {
    ACCESS_KEY, SECRET_KEY, BUCKET_NAME, AWS_REGION,
  },
} = require('../../config/index');
const logger = require('../../logger/logger');

const streamToBuffer = (stream) => new Promise((resolve, reject) => {
  const chunks = [];

  stream.on('data', (chunk) => chunks.push(chunk));
  stream.on('end', () => resolve(Buffer.concat(chunks)));
  stream.on('error', reject);
});

const md5 = (buffer) => crypto.createHash('md5').update(buffer).digest('hex');

const s3Client = new S3({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
  region: AWS_REGION,
});

const getFile = async (uri) => {
  if (!uri || !uri.trim().length) throw new Error('No path provided');

  logger.info(`[s3] downloading /${uri}`);
  try {
    const data = await s3Client.getObject({
      Bucket: BUCKET_NAME,
      Key: uri,
    });
    const str = (await streamToBuffer(data.Body)).toString('utf8');
    const digest = md5(str);

    return {
      data: str,
      md5: digest,
    };
  } catch (err) {
    logger.error('[s3] download error: ', err.message || err, uri);
    throw err;
  }
};

const putFile = async (uri, data) => {
  if (!uri || !uri.trim().length) throw new Error('No path provided');

  const components = path.parse(uri);
  const filename = components.name + components.ext;
  const tmpPath = path.join(os.tmpdir(), filename);

  logger.info('[s3] upload: storing temp file at', tmpPath);

  await fs.promises.writeFile(tmpPath, data);

  const params = {
    Bucket: BUCKET_NAME,
    Key: uri,
    Body: fs.createReadStream(tmpPath),
    StorageClass: 'REDUCED_REDUNDANCY',
  };

  logger.info('[s3] upload: uploading file to', uri);

  try {
    await s3Client.putObject(params);

    return tmpPath;
  } catch (err) {
    logger.error('[s3] upload error: ', err.message || err);
    throw err;
  }
};

// const uploadToS3 = async (url, uploadedFileName) => {
//   const params = {
//     Bucket: BUCKET_NAME,
//     Key: url,
//     Body: fs.createReadStream(uploadedFileName),
//     StorageClass: 'REDUCED_REDUNDANCY',
//   };

//   try {
//     await s3Client.putObject(params);
//     logger.info('done uploading');

//     return 'Done uploading.';
//   } catch (err) {
//     logger.error('uploadToS3 error:', err);
//     throw new Error('unable to upload');
//   }
// };

const uploadToS3 = async (url, data) => {
  const getContentType = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.bmp': 'image/bmp',
    };

    return contentTypes[ext] || 'application/octet-stream';
  };

  const params = {
    Bucket: BUCKET_NAME,
    Key: url,
    Body: Buffer.isBuffer(data) ? data : fs.createReadStream(data),
    StorageClass: 'REDUCED_REDUNDANCY',
    ContentType: getContentType(url),
    ContentDisposition: 'inline',
    CacheControl: 'no-cache, no-store, must-revalidate',

  };

  try {
    await s3Client.putObject(params);
    logger.info('done uploading');

    return 'Done uploading.';
  } catch (err) {
    logger.error('uploadToS3 error:', err);
    throw err;
  }
};

const downloadToS3 = async (url, downloadedFileName) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: url,
  };

  try {
    const data = await s3Client.getObject(params);

    await fs.promises.writeFile(downloadedFileName, await streamToBuffer(data.Body));

    return 'done downloading';
  } catch (err) {
    throw new Error(`unable to download: ${err.stack}`);
  }
};

const hasFile = async (url) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: url,
  };

  try {
    await s3Client.headObject(params);
    logger.info('has file true');
    return true;
  } catch (err) {
    logger.info('do not has file');
    throw err;
  }
};

const getFilePath = async (filePath, signedUrlExpireSeconds = 30000) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filePath,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: signedUrlExpireSeconds });

    logger.info('file is accessible');

    return url;
  } catch (err) {
    logger.error('getFilePath error:', err);
    throw err;
  }
};

const saveFile = async (uri, data) => {
  if (!uri || !uri.trim().length) throw new Error('No path provided');

  const components = path.parse(uri);
  const filename = components.name + components.ext;
  const tmpPath = path.join(os.tmpdir(), filename);

  logger.info('[s3] upload: storing temp file at', tmpPath);

  await fs.promises.writeFile(tmpPath, data);

  return tmpPath;
};

const uploadPartnerImageToS3 = async (imageUrl, itemId) => {
  if (!imageUrl || !itemId) throw new Error('Image URL and itemId are required');

  const fileExtension = path.extname(new URL(imageUrl).pathname);
  const s3Key = `MPR${itemId}_image${fileExtension}`;

  try {
    const fileExists = await hasFile(s3Key);

    if (fileExists) {
      const existingUrl = await getFilePath(s3Key);

      return { message: 'Asset already in the bucket', url: existingUrl };
    }
  } catch (err) {
    logger.info('File does not exist, proceeding with upload...');
  }

  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);

    await uploadToS3(s3Key, imageBuffer);
    const uploadedUrl = await getFilePath(s3Key);

    return { message: 'Image uploaded successfully', url: uploadedUrl };
  } catch (err) {
    logger.error('uploadImageToS3 error:', err);
    throw new Error('Failed to upload image');
  }
};

module.exports = {
  uploadToS3,
  downloadToS3,
  hasFile,
  getFile,
  putFile,
  md5,
  getFilePath,
  saveFile,
  uploadPartnerImageToS3,
};
