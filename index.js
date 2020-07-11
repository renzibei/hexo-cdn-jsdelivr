/* global hexo */
'use strict';



var cdnConfig = require('./lib/process').getCdnConfig(hexo);

if (cdnConfig && 'use_cdn' in cdnConfig && cdnConfig.use_cdn) {
  hexo.extend.filter.register('before_post_render', require('./lib/process').processPost);
  hexo.extend.generator.register('jsdelivr_cdn_generator',  require('./lib/generator'));
  console.log("use cdn");
}
else {
  console.log("not use cdn");
}


