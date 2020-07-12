'use strict';


const pathFn = require('path');
const fs = require('hexo-fs');
const spawn = require('hexo-util/lib/spawn');
const nunjucks = require('nunjucks');
const moment = require('moment');
const customFs = require('./customfs');
const { info } = require('console');




const swigHelpers = {
    now: function(format) {
      return moment().format(format);
    }
};

function isJsFile(path) {
    return /\.js$/.test(path);
}

function isCssFile(path) {
    return /\.css$/.test(path);
}


function assetsGenerator(locals) {
    if (!(process.argv.indexOf('generate') > -1 || process.argv.indexOf('g') > -1) )
        return;

    const log = this.log;
    log.info("begin assets generate");
    let cdnConfig = require('./process').getCdnConfig(this);
    const baseDirPath = this.base_dir;
    const sourceDir = this.source_dir;
    const publicDirPath = this.public_dir;
    const postDirPath = pathFn.join(sourceDir, "_posts");
    const deployAssetsDir = ".deploy_static_assets";
    const deployAssetsDirPath = pathFn.join(baseDirPath, deployAssetsDir);
    const postAssetDirName = "post-assets";
    const postAssetsPath = pathFn.join(deployAssetsDirPath, postAssetDirName);
    

    function git(...args) {
        return spawn('git', args, {
          cwd: deployAssetsDir,
          stdio: 'inherit'
        }).then((ret) => {
            return ret;
        });
    };

    function initAssetsDir(assetsDirPath) {
        const userName = '';
        const userEmail = '';

        // Create a placeholder for the first commit
        return fs.writeFile(pathFn.join(assetsDirPath, 'placeholder'), '').then(() => {
            return git('init');
        }).then(() => {
            return userName && git('config', 'user.name', userName);
        }).then(() => {
            return userEmail && git('config', 'user.email', userEmail);
        }).then(() => {
            return git('add', '-A');
        }).then(() => {
            return git('commit', '-m', 'First commit');
        });
    };
    
    function makeAssetsDir(assetsDirPath) {
        return fs.exists(assetsDirPath).then(exist => {
            if(exist) return;
            fs.mkdirs(assetsDirPath);
            return initAssetsDir(assetsDirPath); 
        });
    };
      





    function isTmpFile(path) {
        return path.endsWith('%') || path.endsWith('~');
    }
      
    function isHiddenFile(path) {
        return /(^|\/)\./.test(path);
    }
      
    function isExcludedFile(path, config) {
        if (isTmpFile(path)) return true;
        if (isHiddenFile(path) && !isMatch(path, config.include)) return true;
        return false;
    }





    
    
    return makeAssetsDir(deployAssetsDirPath)
    .then(()=>{
        log.info("clear assets...");
        return fs.emptyDir(deployAssetsDirPath);
    })
    .then( () => { 
        log.info("copy post assets...");
        return fs.copyDir(postDirPath, postAssetsPath, { ignorePattern: /\.md$/ });
     })
    .then( () => {
        if(typeof cdnConfig.asset_dirs !== 'undefined') {
            log.info("copy other assets...");
            let assetsDirList = cdnConfig.asset_dirs
            let jsAssetsDirPath = pathFn.join(deployAssetsDirPath, "js");
            let cssAssetsDirPath = pathFn.join(deployAssetsDirPath, "css");
            if(Array.isArray(assetsDirList)) {
                let listLen = assetsDirList.length;
                for(let i = 0; i < listLen; ++i) {
                    let staticAssetDir = assetsDirList[i];
                    let staticAssetDirPath = pathFn.join(baseDirPath, staticAssetDir);
                    let dstDirPath = pathFn.join(deployAssetsDirPath, pathFn.basename(staticAssetDir));
                    fs.copyDir(staticAssetDirPath, dstDirPath, {ignorePattern: /\.(js|css)$/});
                    customFs.listDirPathSync(staticAssetDirPath)
                    .filter(item => isJsFile(item) || isCssFile(item))
                    .map(item => {
                        // console.log("item: ", item);
                        log.info("Copy from: ", item);
                        let fileBaseName = pathFn.basename(item);
                        if(isJsFile(item)) {
                            return fs.copyFile(item, pathFn.join(jsAssetsDirPath, fileBaseName));
                        }
                        else if(isCssFile(item)) {
                            return fs.copyFile(item, pathFn.join(cssAssetsDirPath, fileBaseName));
                        }
                        else {
                            log.info("what happend!");
                        }
                    });
                }
            }
        }

    });

}

function assetsDeployer(args) {
    if (!(process.argv.indexOf('generate') > -1 || process.argv.indexOf('g') > -1) )
        return;

    const log = this.log;

    const baseDirPath = this.base_dir;
    const publicDirPath = this.public_dir;
    const deployAssetsDir = ".deploy_static_assets";
    const deployAssetsDirPath = pathFn.join(baseDirPath, deployAssetsDir);
    const message = commitMessage("");
    const jsAssetsDirPath = pathFn.join(deployAssetsDirPath, "js");
    const cssAssetsDirPath = pathFn.join(deployAssetsDirPath, "css");

    function git(...args) {
        return spawn('git', args, {
          cwd: deployAssetsDir,
          stdio: 'inherit'
        }).then((ret) => {
            return ret;
        });
    };

    function commitMessage(m) {
        const message = m || 'Site updated: {{ now(\'YYYY-MM-DD HH:mm:ss\') }}';
        return nunjucks.renderString(message, swigHelpers);
    };

    function push(repo_url) {
        return git('add', '-A').then(() => {
            return git('commit', '-m', message).catch(() => {
            // Do nothing. It's OK if nothing to commit.
            });
        }).then(() => {
            return git('push', '-u', repo_url, 'HEAD:' + "master", '--force');
        });
    };

    let cdnConfig = require('./process').getCdnConfig(this);
    log.info("copy the js and css files in public");

    return customFs.listDirPath(publicDirPath)
    .catch(err => {
        if (err && err.code === 'ENOENT') return [];
        throw err;
    })
    .filter(item => isJsFile(item) || isCssFile(item))
    .map(item => {
        log.info("Copy from: ", item);
        let fileBaseName = pathFn.basename(item);
        if(isJsFile(item)) {
            return fs.copyFile(item, pathFn.join(jsAssetsDirPath, fileBaseName));
        }
        else if(isCssFile(item)) {
            return fs.copyFile(item, pathFn.join(cssAssetsDirPath, fileBaseName));
        }
        else {
            log.info("what happend!");
        }
    })
    .then(() => {
        log.info("begin push...");
        return push(cdnConfig.git_repo_url);
    });
    
    

}

module.exports.assetsGenerator = assetsGenerator;

module.exports.assetsDeployer = assetsDeployer;