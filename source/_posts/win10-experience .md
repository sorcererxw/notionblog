---
title: 一些win10的使用经验
date: 2015-08-10 08:12:47
tags:
---

# 高DPI显示

由于win10使用了全新的渲染方式,不同于之前win7,win8的方式,所以会出现大量的软件出现界面模糊的现象. 
观察发现大部分都是国产软件几乎全部阵亡,只有少数几个比如网易云音乐,微信之类良心产品存活下来,也有可能这些软件开始开发的时间比较晚,使用比较新框架. 
国外软件大部分能够在高DPI下正常显示,不过steam,evernote会出现模糊现象.
其实是win10在高DPI下会强制将软件拉伸,使得界面拥有更好的可读性,但是并不是每一个软件都会适配高DPI,使得有些软件在拉伸之后变得模糊. ( 详细可以看 [『独家：详解Windows 10 DPI 技术』](http://quan.ithome.com/0/000/731.htm) )

与其抱怨软件厂商开发不与时俱进,还不如研究一下怎样获得更好的使用体验.

## 使用兼容性设置

![img](http://sorcerer.farbox.com/%E6%8A%98%E8%85%BE/_image/%E5%85%B3%E4%BA%8Ewin10%E7%9A%84%E4%BD%BF%E7%94%A8%E7%BB%8F%E9%AA%8C/06-55-06.jpg)
像是这样勾选兼容性选项卡里面的高DPI设置就可以实现让软件清晰显示,但是软件界面的会相应缩小.

## 使用Windows10_DPI_FIX

![img](http://sorcerer.farbox.com/%E6%8A%98%E8%85%BE/_image/%E5%85%B3%E4%BA%8Ewin10%E7%9A%84%E4%BD%BF%E7%94%A8%E7%BB%8F%E9%AA%8C/07-07-14.jpg)
这是一个国外用户开发的一个软件,可以让系统该用win8的渲染方式,让软件不被拉伸,打开选择Use Windows 8.1 DPI scaling,然后选择一个合适的比例,apply重启即可.
下载地址:http://pan.baidu.com/s/15AOhw

# 一些可能有用的设置

## 关于系统动画和特效

![img](http://sorcerer.farbox.com/%E6%8A%98%E8%85%BE/_image/%E5%85%B3%E4%BA%8Ewin10%E7%9A%84%E4%BD%BF%E7%94%A8%E7%BB%8F%E9%AA%8C/08-52-13.jpg)
如果电脑的性能有限已经喜欢朴素简洁的用户可以在『控制面板\系统和安全\系统\高级系统设置\性能设置』下把不需要的选项取消打勾,譬如我就不喜欢win10的窗口打开从任务栏图标缩放到窗口的动画,就把最后一项取勾了.
PS: 在我看来,win10使用扁平化本身就是返璞归真的一种表现,抛弃冗杂的动画是必须的,能够在一定程度上提高流畅度以及操作效率.

## 库和此电脑的打开

从win7开始,微软就一直在推行模糊磁盘的概念,想要用库来替代文件资料管理,但是使用过后会发现库使用起来还是比较麻烦的,要将某个文件夹纳入库的管理并不比直接建立一个文件夹来得方便,也有可能是先入为主的原因,一直都用不惯库.
默认的桌面上是只有一个垃圾桶的,大部分图标都被固定在任务栏上面,这也是微软希望用任务栏进行任务管理,而不是把让图标把整个桌面占满的理念. 所以要打开此电脑(我的电脑)只能通过任务栏的资源管理器图标打开,默认是打开库的,但是为了遵循之前的使用习惯,我会将这个默认打开位置修改为此电脑.
只需要在**此电脑**的**查看**选项卡上的**选项**内将**打开文件资源管理器是打开**更改为**此电脑即可**
![img](http://sorcerer.farbox.com/%E6%8A%98%E8%85%BE/_image/%E5%85%B3%E4%BA%8Ewin10%E7%9A%84%E4%BD%BF%E7%94%A8%E7%BB%8F%E9%AA%8C/09-38-22.jpg)

# 关于cortana

进入win10桌面第一眼最明显能够感受得到的变化就是任务栏上多了一条灰灰的搜索框,这是微软在win10内集成的cortana,放在如此鲜艳的位置,可见微软对于这个智能助手是多么重视. 但是这么大的搜索框在我看来是并不美观的,而且占用了大量任务栏的空间,没有实际意义. 只需要右键搜索框,如下图设置即可将cortana变成一个图标,需要只需要点击图标.
![img](http://sorcerer.farbox.com/%E6%8A%98%E8%85%BE/_image/%E5%85%B3%E4%BA%8Ewin10%E7%9A%84%E4%BD%BF%E7%94%A8%E7%BB%8F%E9%AA%8C/08-52-17.jpg)
关于cortana的设置,在cortana内的笔记本标签下选择设置即可进入设置
![img](http://sorcerer.farbox.com/%E6%8A%98%E8%85%BE/_image/%E5%85%B3%E4%BA%8Ewin10%E7%9A%84%E4%BD%BF%E7%94%A8%E7%BB%8F%E9%AA%8C/08-54-49.jpg)
可以选择将cortana设置为一个小面团,感觉萌萌哒~
![img](http://sorcerer.farbox.com/%E6%8A%98%E8%85%BE/_image/%E5%85%B3%E4%BA%8Ewin10%E7%9A%84%E4%BD%BF%E7%94%A8%E7%BB%8F%E9%AA%8C/08-55-56.jpg)
最好玩的是可以设置让cortana直接响应"你好小娜"的语音,哪怕没有点开搜索框,说句话就可以开始调戏小娜,但是好玩归好玩,这个指令平时也很容易被误触发,没有人愿意在干正事的时候忽然跳出一个小娜说"我没有听清楚",所以建议平时关闭了,需要小娜的时候直接ctrl+c进行呼出即可.

# 关于Universal Windows App

这是微软在win10提出的一个新概念,通用应用(以下称为UWA). 使得平台可以通用一个应用,减少了用户使用体验的割裂感,降低了全平台软件开发成本.
由于UWA有标准的设计规范,已经更加完善的权限管理机制,使得软件也更加美观,也不会像国内软件一样耍流氓. 所以在条件允许的情况下我会尽量使用UWA.
由于应用商店内质量较高的软件还是比较少的,所有我推荐几个以做参考(包括但不限与UWA,还有一些普通win8应用):

- 奇妙清单(wunderlist)
  - 其实奇妙清单有两个版本,一个是普通的win8应用,但是官方又根据UWA开发了一遍,现在UWA版本还是处于BETA阶段,使用还是有一定的BUG,也没有老的版本美观. 如果直接在应用商店搜索只会找到老的版本.
  - [下载链接](https://www.microsoft.com/store/apps/9WZDNCRDFXZS&geoMarket=cn)
- office mobile
  - 微软现在已经在应用商店提供了几乎全套office下载,包含Word,PowerPoint,Excel,Onenote,Sway(暂时只有移动版和WEB版),Lync,Outlook(其实不叫Outlook,叫作邮件和日历,但本质上就是替代Outlook的功能),OneDrive(其实是win10内置的)
  - 官方声明在10寸一下设备这些应用都可以一直免费使用.
  - 但是这些都是针对触屏优化的mobile,更能相对于office 2016简单了不少,对文档的兼容性支持也不足,但是如果电脑性能不足或者对文档编辑的需求不高,使用mobile版本的office还是不错的选择的
- 下载链接
  - [Word](https://www.microsoft.com/store/apps/9wzdncrfjb9s)
  - [PowerPoint](https://www.microsoft.com/store/apps/9WZDNCRFJB5Q&geoMarket=cn)
  - [Excel](https://www.microsoft.com/store/apps/9WZDNCRFJBH3&geoMarket=cn)
  - [邮件与日历(win10内置)](https://www.microsoft.com/store/apps/9WZDNCRFHVQM&geoMarket=cn)
  - [Sway](https://www.microsoft.com/store/apps/9WZDNCRD2G0J&geoMarket=cn)
  - [OneNote](https://www.microsoft.com/store/apps/9WZDNCRFHVJL&geoMarket=cn)
  - [Lync](https://www.microsoft.com/store/apps/9WZDNCRFHVHM&geoMarket=cn)
- Skype
  - Skype是微软旗下的视频聊天软件,移动版本在电脑上使用一直都有着不熟桌面版本的体验,而且在动画和界面优于桌面版本,但是很奇怪的是前段时间官方声称会停止应用商店内的Skype更新,但是又据说下个版本的win10会集成Skype,对于有视频聊天需求的用户,这当然是最好不过的了.
  - [下载链接](https://www.microsoft.com/store/apps/9WZDNCRFJ364&geoMarket=cn)
- Nextgen Reader
  - 我一直有着RSS的阅读习惯,但是苦于一直没有喜欢的桌面的RSS阅读软件,一直带feedly网站上看,但是因为是国外网站的原因,而且受限于浏览器,阅读等各方面还是无法有很好的体验,直到我发现了Nextgen Reader,试用了一下,发现体验很好,就果断买了,正巧是降价,6元人民币.
  - 说下一下使用感受: Nextgen是抓取feedly的消息,过渡过来很简单. 虽然是给平板使用的版本,但是对于键盘快捷键还是有优化的,基本大部分操作可以通过键盘实现. 但是由于不是UWA的原因,使用老式的界面,看上去并没有很优雅. 而且因为是本身不够稳定以及抓取feedly订阅的原因,常常会闪退或者抓取失败,我解决方法就是重启应用. 总的来说这是一个不错的RSS阅读器,可以满足大部分人的需求.
  - 之前无法刷新出消息,发邮件询问了官方,终于找到了解决的方案,只需要在设置里面启用https协议即可,设置上标注了可能会减慢访问速度,其实感受不出,至少可以刷新出来.
  - [下载链接](https://www.microsoft.com/store/apps/9WZDNCRFJ262&geoMarket=cn)

期待更多的UWA应用会上架,腾讯阿里的应用都在win10发布会展示过,期待BAT的应用上架.

# 卸载内置应用

虽然win10内置通用拥有美观的UI, 但是终归是对触摸屏优化, 如果没有或者不使用触摸屏, 那些应用只会占在那里, 有些还会无耻地成为某些文件的默认启动程序, 不如卸载了

1. 用管理员身份打开PowerShell(直接搜索并右键以管理员身份运行)
2. 获取APPX应用清单

```
get-appxpackage | select name, packagefullname
```

这里我已经获取了一份, 系统号是10532, 可以直接参考(已经删去部分系统lib, runtime, framework和我猜不出的←_←; 不包括完整包名列表)
**不保证一下每一个应用名对应的应用都正确, 删除请谨慎**

| 对应应用           | 应用名                                       |
| ------------------ | -------------------------------------------- |
| Cortana            | Microsoft.Windows.Cortana                    |
| 账户管理           | Microsoft.AccountsControl                    |
| 应该是锁屏         | Microsoft.LockApp                            |
| Edge浏览器         | Microsoft.MicrosoftEdge                      |
| 应该是登录界面的锁 | Microsoft.Windows.AssignedAccessLockApp      |
| 可能是操作中心     | Microsoft.Windows.ContentDeliveryManager     |
| 会员中心           | Microsoft.Windows.FeatureOnDemand.InsiderHub |
| 家庭成员管理       | Microsoft.Windows.ParentalControls           |
| 反馈               | Microsoft.WindowsFeedback                    |
| 联系支持人员       | Windows.ContactSupport                       |
| Miracast组件       | Windows.MiracastView                         |
| 人脉               | Microsoft.People                             |
| 3D Builder         | Microsoft.3DBuilder                          |
| 闹钟和时钟         | Microsoft.WindowsAlarms                      |
| XBox               | Microsoft.XboxApp                            |
| 地图               | Microsoft.WindowsMaps                        |
| 计算器             | Microsoft.WindowsCalculator                  |
| 获取Skype          | Microsoft.SkypeApp                           |
| 天气               | Microsoft.BingWeather                        |
| 体育               | Microsoft.BingSports                         |
| 资讯               | Microsoft.BingNews                           |
| 财经               | Microsoft.BingFinance                        |
| 应用商店           | Microsoft.WindowsStore                       |
| 入门               | Microsoft.Getstarted                         |
| 电影和电视         | Microsoft.ZuneVideo                          |
| Groove 音乐        | Microsoft.ZuneMusic                          |
| 照片               | Microsoft.Windows.Photos                     |
| 相机               | Microsoft.WindowsCamera                      |
| 语音录音机         | Microsoft.WindowsSoundRecorder               |
| 获取Office         | Microsoft.MicrosoftOfficeHub                 |
| OneNote            | Microsoft.Office.OneNote                     |
| 日历和邮件         | microsoft.windowscommunicationsapps          |

1. 开始卸载

```
Get-AppxPackage -allusers *appname* | Remove-AppxPackage
```

将appname改写成以上的应用名即可, 如果太长了, 可以在左右加上*作为通配符

一下是我的卸载清单, 可以直接复制使用

```
get-appxpackage -allusers *onenote* | remove-appxpackage
get-appxpackage -allusers *3dbuilder* | remove-appxpackage
get-appxpackage -allusers *bingsports* | remove-appxpackage
get-appxpackage -allusers *zunevideo* | remove-appxpackage
get-appxpackage -allusers *bingnews* | remove-appxpackage
get-appxpackage -allusers *bingfinance* | remove-appxpackage
get-appxpackage -allusers *officehub* | remove-appxpackage
get-appxpackage -allusers *skype* | remove-appxpackage  
```

1. 还原 使用一下命令重装所有应用

```
Get-AppxPackage -allusers | foreach {Add-AppxPackage -register "$($_.InstallLocation)appxmanifest.xml" -DisableDevelopmentMode}
```

