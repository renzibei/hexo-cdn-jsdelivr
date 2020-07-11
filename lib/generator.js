'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const spawn = require('hexo-util/lib/spawn');
const nunjucks = require('nunjucks');
const moment = require('moment');




const swigHelpers = {
    now: function(format) {
      return moment().format(format);
    }
};


function assetsGenerator(locals) {
    if (!(process.argv.indexOf('generate') > -1 || process.argv.indexOf('g') > -1) )
        return;
    // console.log("locals has fields: ", Object.keys(locals));
    console.log("begin assert generate");
    var cdnConfig = require('./process').getCdnConfig(this);
    // console.log("this has fields: ", Object.keys(this));
    // console.log("base_dir = ", this.base_dir);
    // console.log("sorce_dir = ", this.source_dir);
    const baseDirPath = this.base_dir;
    const sourceDir = this.source_dir;
    const postDirPath = pathFn.join(sourceDir, "_posts");
    const deployAssetsDir = ".deploy_static_assets";
    const deployAssetsDirPath = pathFn.join(baseDirPath, deployAssetsDir);
    const postAssetDirName = "post-assets";
    const postAssetsPath = pathFn.join(deployAssetsDirPath, postAssetDirName);
    const message = commitMessage("");

    console.log("assetsDirPath is ", deployAssetsDirPath);

    function git(...args) {
        return spawn('git', args, {
          cwd: deployAssetsDir,
          stdio: 'inherit'
        }).then((ret) => {
            console.log("git ret:", ret);
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


    
    return makeAssetsDir(deployAssetsDirPath)
    .then(()=>{
        console.log("clear assets...");
        return fs.emptyDir(deployAssetsDirPath);
    })
    .then( () => { 
        console.log("copy assets...");
        return fs.copyDir(postDirPath, postAssetsPath, { ignorePattern: /\.md$/ });
     })
    .then( () => {
        console.log("begin push...");
        return push(cdnConfig.git_repo_url);
    });
    // console.log("theme config has ", Object.keys(this.theme.config));

}
module.exports = assetsGenerator;
