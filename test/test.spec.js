'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _markdownRecursive = require('../src/markdown-recursive');

var _markdownRecursive2 = _interopRequireDefault(_markdownRecursive);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('test', function () {
  it('should fail', function () {
    var lastMsg = null;
    var logger = function logger(msg) {
      lastMsg = msg;
    };

    return (0, _markdownRecursive2.default)(['./test/docs/**/*.md' - 1], { logger: logger }).then(function () {
      console.log('lasgMsg: ' + lastMsg);
      (0, _expect2.default)(lastMsg).toEqual(new TypeError('TypeError: Path must be a string. Received -1'));
    });
  });
});

describe('Given ./docs/sample.md', function () {
  afterEach(function (done) {
    return (0, _rimraf2.default)('./test/testBuild', function (err) {
      if (err) {
        throw err;
      }
      done();
    });
  });

  it('should make a directry for .hmtl files and sample.html', function () {
    return (0, _markdownRecursive2.default)(['./test/docs/**/*.md', './test/testBuild']).then(function () {
      return new Promise(function (resolve, reject) {
        // check if html files and directories exist
        (0, _glob2.default)('./test/testBuild/**/*.html', function (err, files) {
          return err ? reject(err) : resolve(files);
        });
      });
    }).then(function (files) {
      //  files include thefile(./test/testBuild/test/docs/sample.html)
      (0, _expect2.default)(files).toInclude('./test/testBuild/test/docs/sample.html');
    }).catch(function (err) {
      return console.log('error is occured: ' + err + '!');
    });
  });
});

//# sourceMappingURL=test.spec.js.map