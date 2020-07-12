'use strict';

const Promise = require('bluebird');
const fs = require('graceful-fs');
const fsPromises = fs.promises;
const {join} = require("path")

function trueFn() {
    return true;
}

function ignoreHiddenFiles(ignore) {
    if (!ignore) return trueFn;
  
    return ({ name }) => !name.startsWith('.');
  }
  
function ignoreFilesRegex(regex) {
    if (!regex) return trueFn;

    return ({ name }) => !regex.test(name);
}

async function _readAndFilterDir(path, options) {
    const { ignoreHidden = true, ignorePattern } = options;
    return (await fsPromises.readdir(path, { ...options, withFileTypes: true }))
      .filter(ignoreHiddenFiles(ignoreHidden))
      .filter(ignoreFilesRegex(ignorePattern));

}

function _readAndFilterDirSync(path, options) {
    const { ignoreHidden = true, ignorePattern } = options;
    return fs.readdirSync(path, { ...options, withFileTypes: true })
      .filter(ignoreHiddenFiles(ignoreHidden))
      .filter(ignoreFilesRegex(ignorePattern));
}

async function _listDirWalker(path, results, parent, options) {
    const promises = [];
  
    for (const item of await _readAndFilterDir(path, options)) {
      const currentPath = join(path, item.name);
  
      if (item.isDirectory()) {
        promises.push(_listDirWalker(join(path, item.name), results, currentPath, options));
      } else {
        results.push(currentPath);
      }
    }
  
    await Promise.all(promises);
}
  
// return all files (not directories) in the dir, including the files in the sub directories; the returned files are path-like
function listDirPath(path, options = {}) {
    if (!path) throw new TypeError('path is required!');
    
    const results = [];
    
    return Promise.resolve(_listDirWalker(path, results, '', options)).return(results);
}

function _listDirSyncWalker(path, results, parent, options) {
    for (const item of _readAndFilterDirSync(path, options)) {
      const currentPath = join(path, item.name);
  
      if (item.isDirectory()) {
        _listDirSyncWalker(join(path, item.name), results, currentPath, options);
      } else {
        results.push(currentPath);
      }
    }
}
  
function listDirPathSync(path, options = {}) {
    if (!path) throw new TypeError('path is required!');

    const results = [];

    _listDirSyncWalker(path, results, '', options);

    return results;
}

module.exports.listDirPath = listDirPath;
module.exports.listDirPathSync = listDirPathSync;