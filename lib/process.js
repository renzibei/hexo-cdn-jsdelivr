'use strict';

const pathFn = require('path');
const urljoin = require('url-join');


function getCdnConfig(ctx) {
    var cdnConfig = null;
    if (typeof (ctx.config.jsdelivr_cdn) !== 'undefined') {
        cdnConfig = ctx.config.jsdelivr_cdn;
    }
    return cdnConfig;
}

function removeLastSlash(s) {
    if (s.length === 0)
        return s;
    if (s[s.length - 1] === '/')
        return s.substring(0, s.length - 1);
    return s;
}

// replace all asset_img tag with html img tag
function processPost(data) {
    let cdnConfig = getCdnConfig(this);
    const postAssetDirName = "post-assets";
        // var reg = /!\[(.*)\]\((.*)\)/g;: ", data.source, " full_source: ", data.full_source);
    if(typeof data.asset_dir !== "undefined" && typeof this.config !== "undefined") {
        if(!this.config.post_asset_folder) {
            throw new TypeError("post_asset_folder in _config.yml must be set true to use cdn-jsdelivr");
        }
        let cdnUrlPrefix = removeLastSlash(cdnConfig.cdn_url_prefix) + "@latest"
        let postUrlPrefix = urljoin(cdnUrlPrefix, postAssetDirName);
        let imgTagReg = /{%\s*asset_img\s+([^%\s]+)\s+([^%]*)%?}/g;
        data.content = data.content.replace(imgTagReg, "<img src=\"" + urljoin(postUrlPrefix, pathFn.basename(data.asset_dir), '$1') + "\" alt=\"" + "$2" + "\">");
    }
    return data;
}



module.exports.processPost = processPost;

module.exports.getCdnConfig = getCdnConfig;