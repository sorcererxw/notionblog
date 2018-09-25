---
title: 记一次 GitHub Pages 部署
date: 2018-08-9 08:12:47
tags:
---

之前买了一个域名 [ilove.works](https://ilove.works)，用 React 写了一个小玩具。本来打算放在自己的服务器里面，但是想想这只是一个小玩具，放在自己服务器里面只会让未来的维护成本上升。好吧，那就放在 GitHub Pages 上吧。毕竟 React 官方的 create-react-app 能够搭配 gh-pages 非常舒服地进行部署。

<!-- more -->

# 步骤

之前只使用 pages 部署过个人主页，没有部署过独立地项目主页。整个过程参考了[create-react-app 文档](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#github-pages)，但是还是踩了一些坑，复盘记录一下步骤。

## 集成 gh-pages

写完代码，本地测试完毕，准备部署了。
```
npm install --save-dev gh-pages
```
并在 `packages.json` 的 `scripts` 节点当中添加两句命令
```
  "scripts": {
+   "predeploy": "npm run build",
+   "deploy": "gh-pages -d build",
    "start": "react-scripts start",
    "build": "react-scripts build",
  } 
```
部署的时候只需要直接执行 `deploy` 命令，`predeploy` 会在不部署前被自动调用执行的。

## 配置主页地址

在 `packages.json` 根节点当中添加一行
```
"homepage": "https:/example.github.io/",
```

### 坑点

这里和文档当中不一样，文档当中是添加 `"homepage": "https:/example.github.io/app"`，如果根据文档上的部署，的确能够正确地将项目部署上去，访问地址就是 `example.github.io/app`，但是如果之后再配置域名，访问地址也会是 `example.com/app`，而我们需要的是直接访问自定义域名，而不是其中一个子目录。
我折腾了半天才发现，因为在我配置完自定义域名后，打开自定义域名会一直显示资源文件404，只有手动在地址栏里面输入 'ilove.works/iloveworks' 才可以访问，这显然很愚蠢。

## 配置自定义域名

这很简单，直接根据 GitHub Pages 下面的说明，在设置里面填入你的域名或者手动把 CNAME 文件放在你的项目 public 目录下面。
然后需要把 DNS 解析到 GitHub Pages。常见的作法就是直接添加 A记录和 CNAME alias。我添加了 4 个 A 记录
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153

可以正常访问了，但是 GitHub Pages 设置面板里面一直显示 `Unavailable for your site because your domain is not properly configured to support HTTPS`，即无法启用 GP 的 `enforce Https`，怎么会这样。Google 了一圈，都找不到合适的解释。
因为能够正常解析，所以我一直没有意识到是 DNS 的问题。但最终我发现确实是 DNS 的问题。因为我使用的 Cloudflare 的解析服务，但是 Cloudflare 会默认给域名套上 CDN，导致直接查询域名的主机地址是 Cloudflare 的 CDN 服务器，而不是 Github Pages。所以，Github 才认为我并没有配置好解析，也无法进行下一步。
![img](https://wx2.sinaimg.cn/mw690/86dfa6f4gy1ftjv23wahnj208206ujrh.jpg)
解决方法很简单，单击那个云变成 `dns only` 即可。
![img](https://wx1.sinaimg.cn/mw690/86dfa6f4gy1ftjv3hdlyej20xh0csta8.jpg)
当然，cloudflare 的这个功能这个能够保护主机真实地址，但是毕竟是放在 Github 的主机里面，也不用在乎这些了。

最后检查域名地址
```
$ dig +noall +answer example.com
;example.com.
example.com.   3600  IN  A 185.199.108.153
example.com.   3600  IN  A 185.199.109.153
example.com.   3600  IN  A 185.199.110.153
example.com.   3600  IN  A 185.199.111.153
```
好了，一波配置之后，删除 Github Pages 上原来的自定义域名设置，然后重新添加一下。发现 Github 提示说要等待一段时间来进行证书申请。等几十分钟，就可以勾选 `enforce https` 了。

## 最终的效果

访问 `ilove.works` 可以直接访问项目。
访问 `sorcererxw.github.io` 是自己的主页项目（如果没有就是404）
访问 `sorcererxw.github.io/iloveworks` 会自动跳转到 `ilove.works`