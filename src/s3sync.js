'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _s = require('s3');

var _s2 = _interopRequireDefault(_s);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initParams = {
  maxAsyncS3: 20, // this is the default
  s3RetryCount: 3, // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    // any other options are passed to new AWS.S3()
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
    region: 'ap-northeast-1'
  }
};

var client = _s2.default.createClient(initParams);

var s3sync = function s3sync() {
  var from = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : './build';

  var params = {
    localDir: from,
    deletedRemoved: true,

    s3Params: {
      Bucket: 'markdown-converter',
      Prefix: 'artifacts'
    }
  };

  var uploader = client.uploadDir(params);
  uploader.on('error', function (err) {
    console.log('unable to sync:', err.stack);
  });
  uploader.on('progress', function () {
    return console.log('progress: ' + uploader.progressAmount + ' / ' + uploader.progressTotal + ')');
  });
  uploader.on('end', function () {
    return console.log('done uploading');
  });

  console.log('client is ' + JSON.stringify(client));
  return Promise.resolve();
};

exports.default = s3sync;

//# sourceMappingURL=s3sync.js.map