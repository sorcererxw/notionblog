---
title: nginx 反向代理配置 Github Page 的 api 网关
date: 2018-08-10 08:12:47
tags:
---

将 web app 部署在 Github Pages (以下简称 gp) 非常方便优雅, 但是会面临一个问题, 就是**访问接口的跨域问题**.

# 解决思路

通常, 我们直接将域名解析到 nginx 服务器, 再通过 nginx 反向代理, 将前端的 api 路径代理到 api 服务器上.
另一方面, 如果将项目部署在 gp 上面, 我们就需要将域名直接解析到 gp 服务器上.
这么一来, 两者就发生了冲突, 需要进行一些额外的配置.
那么, 我们索性将域名直接解析给 nginx, 然后通过 nginx 来将前端代理到 gp, api 代理到后端. 不过这么一来, 就没有遵循 gp 的配置规则, 无法启用 gp 的 enforce https 的功能, 不过这个跳转环节可以直接放在 nginx 上实现.

<!--more-->

# 实践

## 准备工作

首先需要准备一台服务器, 然后安装启用 nginx, 将自己的所需要为前端配置的域名  `example.com` 解析到这台服务器上.
另外, 还需要配置好后端服务器, 并做好域名解析, 比如 `api.example.com`

## 部署 gh

参考 [我之前的文章](https://blog.sorcererxw.com/2018/08/09/deploy-github-pags/) 来部署好 gh, 并在自定义域名栏目里面填入 `example.com`, 由于解析地址的时候并没有解析到 gh, 所以看到 Enforce Https 无法勾选, 而且现在也无法进行访问.
![img](https://wx2.sinaimg.cn/mw690/86dfa6f4gy1fu4djg8ub3j20sc0m0gnn.jpg)

## 配置 nginx 反向代理

```
server
{ 
    listen 80;
    server_name example.com; # 填上自己的域名
    location /api { # 配置前端 api 的路径
        proxy_pass https://api.example.com/; # 填上要转发的 api 服务器地址
        # 这里有一个需要注意的地方如果填的是 https://api.xxxx.com (末尾无斜杠)
        # 那么, 当前端访问 xxxx.com/api/target 时
        # nginx 会将请求转发到 https://api.xxxx.com/api/target
        # 而如果填的是 https://api.xxxx.com/
        # 那么, 当前端访问 xxxx.com/api/target 时
        # nginx 会将请求转发到 https://api.xxxx.com/target  
    }
    location / {
        proxy_redirect off;
        proxy_set_header host $host;
        proxy_set_header x-real-ip $remote_addr;
        proxy_set_header x-forwarded-for $proxy_add_x_forwarded_for;
        proxy_pass https://example.github.io;
		# 填上你的 gp 的二级域名, 比如我的是 sorcererxw.github.io
    }
    access_log /var/log/nginx/sorcererxw.com_access.log;
}
```
好了, 然后重载一下 nginx
```
nginx -s reload
```
这个时候, 如果你访问 example.com 应该是可以访问了, 也能够在前端直接访问 api 接口.
原理就是, 虽然是直接将前端流量转发到 example.github.io, 但是通过当前地址栏当中的域名, gh 会显示为对应的前端页面.

## 配置 Https 跳转

最方便的办法就是直接使用 letsencrypt 的 certbot 进行配置
根据 https://certbot.eff.org/ 来进行安装
```
certbot --nginx
```
记得选上 redirect https 即可.
当然, 如果有条件购买证书, 更加推荐使用.