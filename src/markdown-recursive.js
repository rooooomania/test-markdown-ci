'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _s3sync = require('./s3sync');

var _s3sync2 = _interopRequireDefault(_s3sync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * processFiles
 * @param {array} files
 * @param {string} outoput
 */
var processFiles = function processFiles(files, output) {
  var returnChain = Promise.resolve();

  files.forEach(function (file) {
    var curPath = _path2.default.resolve(file);

    // `path.resolve` method resolves a sequence of path into an **absolute** path
    var newPath = _path2.default.resolve(_path2.default.join('./', output, file));
    newPath = newPath.slice(0, -2) + 'html';

    var newDirPath = _path2.default.dirname(newPath);

    returnChain = returnChain.then(function () {
      return new Promise(function (resolve, reject) {
        return (
          //read in target file contents
          _fs2.default.readFile(curPath, 'utf8', function (err, contents) {
            return err ? reject(err) : resolve(contents);
          })
        );
      });
    }).then(function (contents) {
      return new Promise(function (res, rej) {
        return (0, _mkdirp2.default)(newDirPath, function (err) {
          return err ? rej(err) : res(contents);
        });
      });
    }).then(function (contents) {
      return new Promise(function (res, rej) {
        return _fs2.default.writeFile(newPath, (0, _marked2.default)(contents), function (err) {
          return err ? rej(err) : res();
        });
      });
    });
  });
  return returnChain;
};

/*
 * markedDirectroy
 * @param {array} info
 * @param {object} option
 */
var markedDirectory = function markedDirectory(_ref, _ref2) {
  var _ref3 = _slicedToArray(_ref, 2),
      _ref3$ = _ref3[0],
      input = _ref3$ === undefined ? '{./docs/**/*.md, ./*.md}' : _ref3$,
      _ref3$2 = _ref3[1],
      output = _ref3$2 === undefined ? './build' : _ref3$2;

  var _ref2$logger = _ref2.logger,
      logger = _ref2$logger === undefined ? console.log : _ref2$logger;
  return new Promise(function (resolve, reject) {
    return (0, _glob2.default)(input, function (err, files) {
      return err ? reject(err) : resolve(files);
    });
  }).then(function (files) {
    return new Promise(function (res, rej) {
      return (0, _mkdirp2.default)(output, function (err) {
        return err ? rej(err) : res(files);
      });
    });
  }).then(function (files) {
    return processFiles(files, output);
  }).then(function () {
    return (0, _s3sync2.default)();
  }).catch(function (err) {
    return logger(err);
  });
};

exports.default = function () {
  return markedDirectory.apply(undefined, [(arguments.length <= 0 ? undefined : arguments[0]) || [], (arguments.length <= 1 ? undefined : arguments[1]) || {}]);
};

//# sourceMappingURL=markdown-recursive.js.map