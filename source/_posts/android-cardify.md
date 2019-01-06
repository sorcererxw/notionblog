---
title: Android「卡片中的列表」的实现探索
date: 2016-11-25 08:12:47
tags:
---

## 需求

作为一个"MD癌"患者, 在自己开发的过程中怎么会不在意一些炫酷Material Design呢?

Material Design中最具代表性的一个设计元素要属Card. 所以我也非常喜欢将每一样元素放在一个又一个Card里面来呈现. 对于独立的元素, 这么做很好, 但是对于列表这样子的有大量元素的控件, 如果每一个普通列表项都用一个独立的Card包裹会稍显凌乱, 而且一定程度上违背Material Design初衷(用不同层级的元素来进行交互, 而不是单纯的呈现数据), 所以就会考虑把整个列表放到一个独立的Card中.

<!--more-->

## 方案1

[代码](https://github.com/sorcererXW/CardList/tree/master/app/src/main/java/com/sorcererxw/demo/cardlist/planA)

这是最最暴力的方法, 就是直接将一个RecyclerView外面套一个CardView, 这有一个巨大的缺陷就是CardView不会跟随RecyclerView滚动, 而是直接缩小到`min(RecyclerView.height, Screen.height)`了, 所以不推荐这个方案.

### 效果

![img](http://ofpmelh8h.bkt.clouddn.com/blog/20161125/173503531.png)
![img](http://ofpmelh8h.bkt.clouddn.com/blog/20161125/173442223.png)

### 总结

- [x] 不会造成性能影响
- [ ] 卡片长度和列表长度一致(卡片跟随列表滚动)
- [x] 卡片视觉效果
- [x] 实现便捷

## 方案2

[代码](https://github.com/sorcererXW/CardList/tree/master/app/src/main/java/com/sorcererxw/demo/cardlist/planB)

想来想去是否可以在单个列表项中下手, 我们知道CardView有个特点, 就是如果两个贴合的CardView在Z轴上高度一致, 在显示上就会有"融合"的效果, 看不出两者之间的边界.

基于这个思路, 我尝试给在一个列表项外面套了一个CardView, 并且移除了每一项之间的间隔

但是这么一来, 为了不遮挡阴影, 必须给边缘的项设置margin, 中间的不需要设置margin, 这么一来, 整件事情就变得复杂了, **对于一个单列的列表, 就有3种情况(上中下), 一个多列的列表甚至有8项(中间, 上边缘, 下边缘, 左边缘, 右边缘, 左上角, 右上角, 左下角, 右下角), 这还没考虑数据量较少的情况(比如只有一项, 那么同时包含上下的特点)**

为了不在代码中动态调整margin(会把代码逻辑弄得更复杂), 我决定通过定义更多的布局文件, 每种情况个一个布局.

![img](http://ofpmelh8h.bkt.clouddn.com/blog/20161125/174328104.png)

由于是每一项单独处理, 当时表格的时候, 需要在获得数据后, 将数据数量补齐为表格列数的整数倍, 否则会出现以下情况

![img](http://ofpmelh8h.bkt.clouddn.com/blog/20161125/173058838.png)

但是以上的问题都不是最关键的, 因为都只是导致代码更加复杂, 但是有一个致命的问题是, CardView的radius无法分不同角来调整, 也就是说, 如果我为了保证整块卡片区域没有空隙, 就必须把radius设置为0, 但是左上角, 左下角, 右上角, 右下角有事必须要有radius的, 否则, 没有圆角这就不叫卡片!

而且, 这样本来一个CardView就可以解决的事情, 被扩大为大量的CardView, 加上每一项的计算, 对性能有不小的影响, 滑动的时候会有, 明显的掉帧.

### 效果

![img](https://ofpmelh8h.bkt.clouddn.com/blog/20161125/175553993.png)
![img](https://ofpmelh8h.bkt.clouddn.com/blog/20161125/175608550.png)

### 总结

- [ ] 不会造成性能影响
- [x] 卡片长度和列表长度一致(卡片跟随列表滚动)
- [ ] 卡片视觉效果
- [ ] 实现便捷
  可以说和第一个方案走向了两个极端

## 方案2.1

[代码](https://github.com/sorcererXW/CardList/tree/master/app/src/main/java/com/sorcererxw/demo/cardlist/planC)
为了解决方案2的卡片无圆角的问题, 我找了一个开源库[Slice](https://github.com/mthli/Slice), 这个库可以不依赖于CardView给View外套上一个Card, 而且这个Card可以选择哪个圆角显示, 哪个不显示, 哪一边有阴影, 哪一边无阴影, 非常实用.
这个方案具体我也不多说了, 逻辑上和方案2没有本质的区别, 也是实现麻烦, 性能欠缺, 具体可以去看一下代码.

### 效果

![img](https://ofpmelh8h.bkt.clouddn.com/blog/20161125/181255126.png)
![img](https://ofpmelh8h.bkt.clouddn.com/blog/20161125/181315503.png)

### 总结

- [ ] 不会造成性能影响
- [x] 卡片长度和列表长度一致(卡片跟随列表滚动)
- [x] 卡片视觉效果
- [ ] 实现便捷

## 方案3

[代码](https://github.com/sorcererXW/CardList/tree/master/app/src/main/java/com/sorcererxw/demo/cardlist/planD)
过了很久, 不经意的看见一个开源应用, 应用内也有卡片列表, 似乎非常完美, 去github上看了一下, 惊讶地发现它居然只是将一个Recyclerview放在一个NestScrollView中, 就可以实现.
原谅我的无知, 我一直只把NestScrollView当做一个普通的ScrollView, 列表是不能放在其中使用的.

### 效果

![img](http://ofpmelh8h.bkt.clouddn.com/blog/20161125/184236230.png)
![img](http://ofpmelh8h.bkt.clouddn.com/blog/20161125/184253688.png)

但是问题在于, 这种实现方式对于列表来说, 就失去了Recycle机制了, 所有view会一口气全部绘制出来, 相当于一个linerlayout, 所以在小数据的时候问题不大, 如果数据量大的话, 会消耗大量的资源, 同样会照常卡顿

### 总结

- [ ] 不会造成性能影响
- [x] 卡片长度和列表长度一致(卡片跟随列表滚动)
- [x] 卡片视觉效果
- [x] 实现便捷

## 个人使用经验

我自己的项目[Sorcery图标包](https://github.com/sorcererXW/SorceryIconPack)中, 我将一组的图标放在同一张卡片中, 同时每一组还有一个header

我尝试过方案三, 但是问题在于, 每一页图标少则十几个, 多则上千个, 这样大的数据会造成非常严重的卡顿

为了更好的滑动体验, 我选择了逻辑更加复杂的方案二, 虽然在实现的过程我恶心得要死, 但是最后的效果还是非常不错的

![img](http://ofpmelh8h.bkt.clouddn.com/blog/20170123/112609829.png)

