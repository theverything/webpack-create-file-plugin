const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const CreateFilePlugin = require('./');

const entryFile = path.resolve(__dirname, './entry.js');
const outputDir = path.resolve(__dirname, './dist');

function run(config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err || stats.hasErrors()) return reject([err, stats]);
      return resolve([null, stats]);
    });
  });
}

function clean(p) {
  return new Promise((resolve, reject) => {
    rimraf(p, err => {
      if (err) return reject(err);
      return resolve();
    });
  });
}

function existsAndIsFile(p) {
  return new Promise(resolve => {
    fs.stat(p, (err, stats) => {
      if (err || !stats.isFile()) return resolve(false);
      return resolve(true);
    });
  });
}

describe('webpack-create-file-plugin', () => {
  afterEach(() => {
    return clean(outputDir);
  });

  test('creates files', () => {
    const config = {
      entry: entryFile,
      output: { path: outputDir },
      plugins: [
        new CreateFilePlugin({
          files: ['styles.css', 'scripts.js'],
        }),
      ],
    };

    return run(config).then(() => {
      return Promise.all([
        expect(existsAndIsFile(path.join(outputDir, 'styles.css'))).resolves.toBe(true),
        expect(existsAndIsFile(path.join(outputDir, 'scripts.js'))).resolves.toBe(true),
      ]);
    });
  });
});
