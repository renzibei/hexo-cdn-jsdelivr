'use strict';

const pathFn = require('path');
const urljoin = require('url-join');

function removeLastSlash(s) {
    if (s.length === 0)
        return s;
    if (s[s.length - 1] === '/')
        return s.substring(0, s.length - 1);
    return s;
}

function cdn_js(path) {

    // const baseDirPath = this.base_dir;
    // const deployAssetsDir = ".deploy_static_assets";
    // const deployAssetsDirPath = path.join(baseDirPath, deployAssetsDir);
    // const jsAssetsDirPath = path.join(deployAssetsDirPath, "js");

    // const hexo_js = this.extend.helper.get('js').bind(this);
    

    let cdnConfig = require('./process').getCdnConfig(this);

    if (!path.endsWith('.js')) {
        path += '.js';
    }
    let jsUrl = path;
    if(typeof cdnConfig.use_cdn !== 'undefined' && cdnConfig.use_cdn) {
        
        let jsFileBaseName = pathFn.basename(path);

        let cdnUrlPrefix = removeLastSlash(cdnConfig.cdn_url_prefix) + "@latest"
        jsUrl = urljoin(cdnUrlPrefix, "js", jsFileBaseName);
    }
    return '<script src="' + this.url_for(jsUrl) + '"></script>';
}

function cdn_css(path) {
    // const hexo_css = this.extend.helper.get('css').bind(this);
    if (!path.endsWith('.css')) {
        path += '.css';
    }
    let cssUrl = path;
    let cdnConfig = require('./process').getCdnConfig(this);
    if(typeof cdnConfig.use_cdn !== 'undefined' && cdnConfig.use_cdn) {
        let cssFileBaseName = pathFn.basename(path);
        let cdnUrlPrefix = removeLastSlash(cdnConfig.cdn_url_prefix) + "@latest"
        cssUrl = urljoin(cdnUrlPrefix, "css", cssFileBaseName);
    }
    return '<link rel="stylesheet" href="' + this.url_for(cssUrl) + '">';
}

function cdn_asset(path) {
    let assetUrl = path;
    let cdnConfig = require('./process').getCdnConfig(this);
    if(typeof cdnConfig.use_cdn !== 'undefined' && cdnConfig.use_cdn) {
        let cdnUrlPrefix = removeLastSlash(cdnConfig.cdn_url_prefix) + "@latest"
        let fileBaseName = pathFn.basename(path);
        let baseDirName = pathFn.basename(pathFn.dirname(path));
        assetUrl = urljoin(cdnUrlPrefix, baseDirName, fileBaseName);
    }
    return this.url_for(assetUrl);
}

module.exports.cdn_js = cdn_js;
module.exports.cdn_css = cdn_css;
module.exports.cdn_asset = cdn_asset;