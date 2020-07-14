# hexo-cdn-jsdelivr

简体中文 | [English](./readme.md)

## 介绍

一个自动地帮助你将图片等静态资源使用jsDelivr的Github CDN加速的hexo插件。

如果你想要使用CDN来加速你的Hexo网站中的静态资源，那么 [jsDelivr](https://www.jsdelivr.com/)提供了一个开源的CDN。

你可能在以下场景中想要使用该插件和jsDelivr CDN:

- 加速Hexo网站中静态资源的加载
- 避免网站在不同地区访问体验的不一致。例如，Github Pages在中国的访问速度较慢且体验因地区差异较大。
- 节省浏览器的带宽

## 安装

```shell
$ npm install hexo-cdn-jsdelivr --save
```

如果你使用node 8.x版本，那么可能会遇到一些问题。我们推荐你至少使用node 10.x版本。

## 配置选项

你可以在项目的`_config.yml`文件中配置该插件。

```yaml
jsdelivr_cdn:
  # 如果 use_cdn 被设置为false， 则该插件不会工作
  use_cdn: true 
  
  # 如果 deploy_when_generating 被设置为true, 那么静态资源目录将会在每次使用'hexo g'命令生成hexo项目的时候被推送到github。如果被设置为false，则只会在deploy时被推送。你也可以在该标志设置为false时使用'hexo g cdn'命令手动推送到github。
  deploy_when_generating: true
  
  # cdn_url_prefix是jsdelivr上你的github仓库(这是专门用来作CDN加速的静态资源仓库而非原hexo项目的部署仓库)的对应网址，应该形如 https://cdn.jsdelivr.net/gh/<username for github>/<assets repo name>/
  cdn_url_prefix: <你在github上的静态资源仓库对应的jsdelivr网址>
  
  # git_repo_url是你github上的静态资源仓库的url，应该形如git@github.com:<username>/<repo>.git
  git_repo_url: <github上的静态资源仓库的url>
  
  # 你可以使用Github token来验证推送你的资源仓库。如果不想使用token验证，那么只要将token值设置为空或者注释掉这一行即可。我们不推荐将token直接写在_config.yml中。我们推荐使用环境变量储存token，只要将token值的第一个字符设置为'$',该插件就会从该环境变量中读取。例如你可以使用'$GITHUB_TOKEN'环境变量来储存token。当使用token验证时，必须通过http(s)连接的方式。更多关于Github token的信息可以去 https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line 内查看。
  token: <your github auth token, optional>
  
  # asset_dirs是可选的需要上传至github静态资源仓库的目录列表，其中的每一个资源目录应该是相对于你的hexo项目目录的路径， 例如 assets 或者 source/assets 或者 themes/<theme name>/assets 。如果你只是想用CDN加速你的post中的图片，则可以不设置asset_dirs
  asset_dirs:
    - [存放静态资源的目录]
    - [另一个存放静态资源的目录]
```

## 如何使用

如果你想要使用jsdelivr CDN加速你的posts中的图片，那么你需要设置`_config.yml`中的`post_asset_folder`选项为`true`。并且你需要将上面的配置选项加入`_config.yml`中。

你需要在Github上新建一个仓库专门来存放静态资源。新建完仓库后，将仓库的链接填写在配置选项中，该插件就会帮助你将静态资源自动地推送到Github上的仓库中。然后jsDelivr的CDN中可以访问你的静态资源了。

### 文章内图片

正如[Hexo官方文档](https://hexo.io/zh-cn/docs/asset-folders.html)中推荐的那样，你可以在文章的markdown文件中使用 `{% asset_img <图片名> [图片注解] %}`tag 来在文章中插入图片。如果还不熟悉这种插入图片的方法，可以再浏览一下官方文档。

在没有安装该插件时，如果`_config.yml` 中的`post_asset_folder`选项被设置为`true`，那么每篇文章都会有一个同名的资源文件夹，你需要将文章的图片放在对应的资源文件夹中。在使用该插件后，你不需要移动任何文件夹，仍然使用该种方式存放图片和在文章中引用图片。该插件会自动化地将你文章资源文件夹中的所有图片推送到Github资源仓库中，并且会把生成的html页面内的图片链接全部替换为指向jsDelivr CDN中的链接。

### 其他的静态资源

除了文章内的图片，你还可以使用该插件来将通过CDN加速hexo项目内的其他的静态资源。例如，你的网站中可能有一些`.js`或`.css`文件是你想通过CDN加速的。

有一些你可以在模板文件如`.ejs`文件中使用的模板方法（在hexo中被称为`Helper`），你可以使用他们来将原本指向本站的资源链接转换为CDN上的链接。

```ejs
<!-- 你可以使用 cdn_css(path) 来代替hexo中的 css(path) -->
<%- cdn_css(path) %>

<!-- 可以使用 cdn_js(path) 来代替 css(path) -->
<%- cdn_js(path) %>

<!-- cdn_asset(path) 将会转换为指向cdn中资源的链接 -->
<%- cdn_asset(path) %>

<!-- 使用举例 -->
<%- cdn_css('style.css') %>
<!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/<username>/<repo>@latest/css/style.css"> -->

<%- cdn_js('test.js') %>
<!-- <script src="https://cdn.jsdelivr.net/gh/<username>/<repo>@latest/js/test.js"></script> -->

<img src="<%- cdn_asset('assets/test.png') %>"/>
<!-- <img src="https://cdn.jsdelivr.net/gh/<username>/<repo>@latest/assets/test.png"/>  -->
```



## 工作原理

感谢 [jsDelivr](https://www.jsdelivr.com)。jsDelivr为Github提供了一个开源CDN。因此你可以从jsDelivr的CDN上加载任何你上传到Github公开仓库中的文件。你可以进一步地了解jsDelivr CDN通过访问[他们的网站](https://www.jsdelivr.com/features)

简单而言，如果你的Github仓库中的一个文件的网址形如 `https://github.com/<username>/<repo>/blob/master/<filename>`，那么也可以通过jsDelivr CDN的链接访问它  `https://cdn.jsdelivr.net/gh/<username>/<repo>/<filename>`

`hexo-cdn-jsdelivr`会将静态资源拷贝至`.deploy_static_assets`目录，然后将该目录推送到你Github上的资源仓库。然后你就可以通过jsDelivr的CDN来加载上传至Github仓库中的静态资源。

该插件会将文章中所有使用`asset_img`tag的图片链接替换为CDN中的图片链接。

除了`_post`目录下的文章资源目录与配置选项中`asset_dirs`中的目录，该插件还会扫描`public`目录下的文件，并将所有`.js`与`.css`文件推送至Github仓库。通过该方式，使用`stylus`等css模板产生的css文件也能够被CDN获取。

## TODO List

- [x] 添加对通过Github token推送的支持

- [ ] 考虑支持markdown风格的文件插入链接方法

## 重置

```
$ rm -rf .deploy_static_assets
```

## 参考

部分代码参考了 [hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git)的实现

## License

MIT