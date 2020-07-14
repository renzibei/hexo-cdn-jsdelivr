# hexo-cdn-jsdelivr

English | [简体中文](./readme-cn.md)

## Introduction

A hexo plugin to help you automatically use jsDelivr CDN for Github to speed up the loading of static resources like images.

If you want to use CDN for the static resources of your hexo website, [jsDelivr](https://www.jsdelivr.com/) provides an open-source CDN.

You may want to use this plugin and jsDelivr CDN when:

- Speed up the loading of static resources of your Hexo website
- Avoid inconsistent website access experience in different regions. For example, Github Pages is very slow to visit in China

- Save the bandwidth of your server

## Installation

```shell
$ npm install hexo-cdn-jsdelivr --save
```

You may come across some problems when using node 8.x version. We recommend that you use node >= 10.x version.

## Options

You can configure this plugin in `_config.yml`.

```yaml
jsdelivr_cdn:
  # If use_cdn is false, this plugin will not work
  use_cdn: true 

  # If deploy_when_generating is true, the assets repository will be pushed to github every time you generate the hexo project using 'hexo g' command. If this flag is set false, the repository will be pushed when deploying. You can manually push the assets repository to github when generating by using 'hexo g cdn' command.
  deploy_when_generating: true

  # cdn_url_prefix is the jsdelivr cdn url of your github repository(the assets repository for static assets rather than the hexo project deployment repository), it should be like: https://cdn.jsdelivr.net/gh/<username for github>/<assets repo name>/
  cdn_url_prefix: <the url of jsdelivr cdn for your github repository>

  # git_repo_url is the url of your new assets repository on github, it should be like git@github.com:<username>/<repo>.git
  git_repo_url: <git repository url>
  
  # you can use github token to push your assets repository. If you don't want to use a token, you can use a empty string '' or comment out this line. We do not recommand that you directly write your token in the _config.yml. We suggest that you read the token from the environment variable by setting token with a prefix '$'. e.g. '$GITHUB_TOKEN'. When you want to use token, you must use http(s) link of your repo. More information about github token can be found in https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line.
  token: <your github auth token, optional>

  # The path of an asset directory in asset_dirs should be the relative path to your hexo project directory, e.g. assets or source/assets or themes/<theme name>/assets. If you only want to use the cdn for the images in your posts, you can leave asset_dirs as empty
  asset_dirs:
    - [assets directory]
    - [another assets directory]
```

## Usage

If you want to use this plugin, you should set the`post_asset_folder` to `true` in `_config.yml` of your project. And you have to add the Options mentioned above to your `_config.yml`

You have to create a new repository in Github to store static assets. Set the repository link in options and this plugin will help you push static assets to the Github repository. Then the CDN link of your assets will be available in jsDelivr.

### Images in Posts

As it is recommanded in [Hexo documents](https://hexo.io/docs/asset-folders), you can use `{% asset_img slug [title] %}` tag in your markdown post file to insert pictures in the posts.

Originally, setting `post_asset_folder` as true, you place the pictures in each folder for the posts. Now with `hexo-cdn-jsdelivr`, you don't have to move your pictures assets. This plugin will automatically push all your pictures of posts to the repository on Github and using the jsdelivr CDN link in the generated html pages.

### Other Static Assets

Except for the images in posts, you can use this plugin to upload other static assets to CDN too! For example, you may have some `.js` or `.css` files on your site that you want to upload to the CDN.

There are several templates(which is `Helper` in hexo) you can use in to turn assets to CDN link.

```ejs
<!-- You can use cdn_css(path) to replace css(path) in hexo -->
<%- cdn_css(path) %>

<!-- This is used to replace js(path) -->
<%- cdn_js(path) %>

<!-- This will return a url link which is the cdn link of the asset -->
<%- cdn_asset(path) %>

<!-- Examples -->
<%- cdn_css('style.css') %>
<!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/<username>/<repo>@latest/css/style.css"> -->

<%- cdn_js('test.js') %>
<!-- <script src="https://cdn.jsdelivr.net/gh/<username>/<repo>@latest/js/test.js"></script> -->

<img src="<%- cdn_asset('assets/test.png') %>"/>
<!-- <img src="https://cdn.jsdelivr.net/gh/<username>/<repo>@latest/assets/test.png"/>  -->
```

## How it works

Thanks to  [jsDelivr](https://www.jsdelivr.com). jsDelivr  provides an open-source CDN for Github. So you can load all the asset files uploaded to Github from the CDN. You can know the jsDelivr CDN further by visiting [their website](https://www.jsdelivr.com/features).

In short, if the url of a file in your Github repo is like this: `https://github.com/<username>/<repo>/blob/master/<filename>`，you can also access the jsDelivr CDN url of it by `https://cdn.jsdelivr.net/gh/<username>/<repo>/<filename>`

`hexo-cdn-jsdelivr` works by copying the static assets files to `.deploy_static_assets` and then it will push this directory to your assets git repo on Github. Then you can load your assets through jsDelivr CDN.

This plugin will replace all the image links which come from `asset_img` tags in posts with the CDN link of each image. 

Except for the assets in the `_post` directory and the `asset_dirs` set in the Options, the plugin will scan the `public` directory to find all the `.js` and `.css` files and upload them to github repo, in which way the css files generated by `stylus` can also be accessed by the CDN.

## TODO List

- [x] Add support for Github token
- [ ] Add suport for markdown-style image inserting

## Reset

```
$ rm -rf .deploy_static_assets
```

## Reference

Some of the codes refer to [hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git)

## License

MIT