---
title: Root Android Without Recovery & Replace Kingroot
date: 2015-12-21 08:12:47
tags:
---

# step 1
安装以下软件

1. [Kingroot](http://www.coolapk.com/apk/com.kingroot.kinguser)
2. [Android Terminal Emulator](http://www.coolapk.com/apk/jackpal.androidterm)

下载[压缩包](http://www.mediafire.com/download/mxzbt42xypvn2ts/Replace_Kinguser_with_SuperSU-v2.4.zip)

# step 2
启动kingroot进行root
如果失败则此方法无效, 绕道另寻他法

# step 3
将下载的压缩包解压, 将解压出来的mrw文件放到手机sdcard目录(storage/emulated/0/)中

#  step 4
启动android terminal emulator
输入
```
su
```
kingroot会弹出询问是否给予超级权限, 确定
再输入
```
sh /sdcard/mrw/root.sh
```
接下来会出现很多输出, 可能有些会显示error, 但是没关系
最后会自动跳转到Supersu目录下, Supersu询问询问是够更新二进制文件, 选择normal, 重启
启动好之后会发现手机当中的Kingroot已经消失, 取而代之的是Supersu

最后附上[youtube视频演示](https://www.youtube.com/watch?v=x6IgvVRt3ak)