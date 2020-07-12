# hexo-cdn-jsdelivr

A hexo plugin to help you automatically use jsdelivr CDN for Github to speed up the loading of static resources like images.

## Installation

```shell
$ npm install hexo-cdn-jsdelivr --save
```

## Options

You can configure this plugin in `_config.yml`.

```yaml
jsdelivr_cdn:
	# if use_cdn is false, this plugin will not work
  use_cdn: true 
  # cdn_url_prefix should be like: https://cdn.jsdelivr.net/gh/<username for github>/<assets repo name>/
  cdn_url_prefix: <the url of jsdelivr cdn for your github repository>
  # git_repo_url should be like git@github.com:<username>/<repo>.git , this is the new repository for your assets
  git_repo_url: <git repository url>
  # The path of a asset directory in asset_dirs should be the relative path to your hexo project directory, e.g. assets or source/assets or themes/<theme name>/assets
  asset_dirs:
  	- [assets directory]
  	- [another assets directory]
    - themes/hexo-theme-icalm/source/assets
```

## Usage

If you want to use this plugin, you should set the`post_asset_folder` to `true` in `_config.yml` of your project. And you have to add the Options mentioned above to your `_config.yml`

You have to create a new repository in Github to store static assets. Set the repository link in options and this plugin will help you push static assets to the Github repository. Then the cdn link of your assets will be available in jsdelivr.

### Images in Posts

As it is recommanded in [Hexo documents](https://hexo.io/docs/asset-folders), you can use `{% asset_img slug [title] %}` tag in your markdown post file to insert pictures in the posts.

Originally, setting `post_asset_folder` as true, you place the pictures in each folder for the posts. Now with `hexo-cdn-jsdelivr`, you don't have to move your pictures assets. This plugin will automatically push all your pictures of posts to the the repository on Github and using the jsdelivr cdn link in the generated html pages.

### Other Static Assets

Except the images in posts, you can use this plugin to upload other static assets to CDN too! For example, you may have some `.js` or `.css` files in your site that you want to upload to the CDN.

There are serval templates(which is `Helper` in hexo) you can use in to turn assets to CDN link.

```ejs
<!-- You can use cdn_css(path) to replace css(path) in hexo -->
<%- cdn_css(path) %>

<!-- This is used to replace js(path) -->
<%- cdn_js(path) %>

<!-- This will return a url link which is the cdn link of the asset -->
<%- cdn_asset(path) %>

<!-- Examples -->
<%- cdn_css('style.css') %>
<!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/<username>/<repo>/css/style.css"> -->

<%- cdn_js('test.js') %>
<!-- <script src="https://cdn.jsdelivr.net/gh/<username>/<repo>/js/test.js"></script> -->

<img src="<%- cdn_asset('assets/test.png') %>"/>
<!-- <img src="https://cdn.jsdelivr.net/gh/<username>/<repo>/assets/test.png"/>  -->
```



## How it works

`hexo-cdn-jsdelivr` works by copying the static assets files to `.deploy_static_assets` and then it will push this directory to your assets git repo on Github. [jsDelivr](https://www.jsdelivr.com) provides an open source cdn for github. So you can load all the asset files uploaded to github from the cdn.

This plugin will replace all the image href which come from `asset_img` tag in posts with the cdn link of each image. 

Except for the assets in the `_post` directory and the `asset_dirs` set in the Options, the plugin will scan the `public` directory to find all the `.js` and `.css` files and upload them to github repo, in which way the css files generate by `stylus` can also be accessed by the cdn.

## Reset

```
$ rm -rf .deploy_static_assets
```

## License

MIT