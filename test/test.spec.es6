import expect from 'expect';
import md from '../src/markdown-recursive';
import glob from 'glob';
import rimraf from 'rimraf';


describe('test', () => {
  it('should fail', () => {
    let lastMsg = null;
    const logger = (msg) => { lastMsg = msg;};

    return md(['./test/docs/**/*.md' -1], {logger})
      .then(() => {
        console.log(`lasgMsg: ${lastMsg}`);
        expect(lastMsg).toEqual(new TypeError('TypeError: Path must be a string. Received -1'));
      });
  });
});

describe('Given ./docs/sample.md', () => {
  afterEach(done =>
    rimraf('./test/testBuild', err => {
      if (err) {
        throw err;
      }
      done();
    })
  );

  it('should make a directry for .hmtl files and sample.html', () => {
    return md(['./test/docs/**/*.md', './test/testBuild'])
      .then(() => new Promise((resolve, reject) => {
        // check if html files and directories exist
        glob('./test/testBuild/**/*.html', (err, files) =>
          (err ? reject(err) : resolve(files))
        )
      }))
      .then(files => {
      //  files include thefile(./test/testBuild/test/docs/sample.html)
        expect(files).toInclude('./test/testBuild/test/docs/sample.html');
      })
      .catch(err => console.log(`error is occured: ${err}!`))
  });
});

