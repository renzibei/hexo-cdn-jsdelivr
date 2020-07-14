/* global hexo */
'use strict';


hexo.extend.helper.register('cdn_css', require('./lib/helper').cdn_css);
hexo.extend.helper.register('cdn_js', require('./lib/helper').cdn_js);
hexo.extend.helper.register('cdn_asset', require('./lib/helper').cdn_asset);
var cdnConfig = require('./lib/process').getCdnConfig(hexo);

if (cdnConfig && 'use_cdn' in cdnConfig && cdnConfig.use_cdn) {
  hexo.extend.filter.register('before_post_render', require('./lib/process').processPost);
  hexo.extend.filter.register('before_exit',  require('./lib/generator').assetsGenerator);
  hexo.extend.filter.register('before_exit', require('./lib/generator').assetsDeployer);
}


