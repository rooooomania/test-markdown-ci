import s3 from 's3';

const initParams = {
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    // any other options are passed to new AWS.S3()
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
    accessKeyId: 'AKIAIUT66NDNL2INRDZQ',
    secretAccessKey: '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',
    region: 'ap-northeast-1',
  },
};

const client = s3.createClient(initParams);

const params = {
  localDir: './build',
  deletedRemoved: true,

  s3Params: {
    Bucket: 'markdown-converter',
    Prefix: 'artifacts',
  },
};

const s3sync = () => {
  const uploader = client.uploadDir(params);
  uploader.on('error', err => {
    console.log('unable to sync:', err.stack);
  });
  uploader.on('progress', () =>
    console.log(`progress: ${uploader.progressAmount} / ${uploader.progressTotal})`)
  );
  uploader.on('end', () =>
    console.log('done uploading')
  );

  console.log(`client is ${JSON.stringify(client)}`);
  return Promise.resolve();
};

export default s3sync;


