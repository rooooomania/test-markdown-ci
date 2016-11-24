import marked from 'marked';
import fs from 'fs';
import path from 'path';
import glob from 'glob';
import mkdirp from 'mkdirp';
import s3sync from './s3sync';

/*
 * processFiles
 * @param {array} files
 * @param {string} outoput
 */
const processFiles = (files, output) => {
  let returnChain = Promise.resolve();

  files.forEach(file => {
    const curPath = path.resolve(file);

    // `path.resolve` method resolves a sequence of path into an **absolute** path
    let newPath = path.resolve(path.join('./', output, file));
    newPath = `${newPath.slice(0, -2)}html`;

    const newDirPath = path.dirname(newPath);

    returnChain = returnChain.then(() => new Promise((resolve, reject) =>
      //read in target file contents
      fs.readFile(curPath, 'utf8', (err, contents) =>
        (err ? reject(err) : resolve(contents))
      )
    )).then(contents => new Promise((res, rej) =>
      mkdirp(newDirPath, err =>
        (err ? rej(err) : res(contents))
      )
    )).then(contents => new Promise((res, rej) =>
      fs.writeFile(
        newPath,
        marked(contents),
        err => (err ? rej(err) : res())
      )
    ));
  });
  return returnChain;
};

/*
 * markedDirectroy
 * @param {array} info
 * @param {object} option
 */
const markedDirectory = (
  [
    input = '{./docs/**/*.md, ./*.md}',
    output = './build',
  ],
  {
    logger = console.log,
  }
) => new Promise((resolve, reject) => {
  return glob(input, (err, files) =>
    (err ? reject(err) : resolve(files))
  );
}).then(files => new Promise((res, rej) =>
    mkdirp(output, err =>
      (err ? rej(err) : res(files))
    )
)).then(files => processFiles(files, output)
).then(() => s3sync()
).catch(err => logger(err));

export default (...args) => markedDirectory.apply(this, [args[0] || [], args[1] || {}]);

