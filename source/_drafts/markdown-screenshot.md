---
title: Markdown "绘制"截图实践
date: 2018-08-12 08:12:47
tags:
---

今天看到 v2ex 上有人分享[这篇博文](https://geelaw.blog/entries/win10-update-restarts/), 比较有意思的是文章内的截图使用了 HTML+CSS 直接渲染, 而不是贴图.
觉得这个方式非常有意思, 首先就是图片不需要托管在图床上面了, 直接内嵌在文章当中, 方便备份. 而且, 因为是直接渲染的原因, 可以做到最大程度的高分辨率, 网页加载速度也会更快.
不过缺点就是麻烦, 而且各个平台的显示效果会存在差异.
不过不管怎样, 不如实践一下.

# 渲染 HTML

因为我一直都是使用 markdown 进行编辑文章, 正好我现在使用的博客系统是 WordPress, 所以我使用了[WP Editor.MD](https://github.com/JaxsonWang/WP-Editor.md)进行文章编辑.
在设置当中开启`支持HTML`即可
当然, 其他的 md 编辑器, 只要支持 HTML 渲染都是没问题的.
这样一来, 不需要其他标记, 直接写 dom 就能渲染出来, 试着渲染一个 button 出来

```HTML
<pre>
example:<button type="button">button</button>
</pre>
```
<pre>
example:
<button type="button">button</button>
</pre>

# 渲染 CSS

渲染了 HTML之后, 如果要真的渲染成一张图片, 还需要加入 CSS 样式.

## inline-style

这是最直观的方式, 是直接将样式属性写在 tag 的 style 属性里面
```HTML
<pre>
example:<button type="button">button</button>
</pre>
```
<p style="color:red;font-size:2rem;">这是一段话</p>

## style 标签

直接行内写样式最大的缺点就是不方便管理, 无法享受到 CSS 的好处. 在不加载 CSS 的前提下, 可以在 HTML 里面插入 `<style>` 标签, 来实现 CSS 的使用.

```html
<div>
	<style>
		._myroot {
			background-color: #f6f6f6;
			padding:8px;
			border-color: #dddddd;
			border-style: solid;
			border-width: 1px;
			border-radius: 4px;
		}
		._myroot>span {
			font-size: 2rem;
			color: blue
		}
	</style>
	<div class="_myroot">
		<span>span</span>
		<p>paragraph</p>
	</div>
</div>
```

<div>
	<style>
		._myroot {
			background-color: #f6f6f6;
			padding:8px;
			border-color: #dddddd;
			border-style: solid;
			border-width: 1px;
			border-radius: 4px;
		}
		._myroot>span {
			font-size: 2rem;
			color: blue
		}
	</style>
	<div class="_myroot">
		<span>span</span>
		<p>paragraph</p>
	</div>
</div>

这里我就用 div 来模拟了 pre 标签的样式
值得注意的是, style 标签的载入, 其中的样式会覆盖页面中已有的样式, 所以不能直接对标签进行加样式. 应该通过自定义 class 名或者 id 来配置样式, 就算是这样, 也要避免和页面中其他元素重名. 如果需要用到对标签加载样式, 请通过 CSS 选择器选中根元素下方的标签.

## CSS 文件加载

WordPress 是不支持为单篇文章配置 CSS 样式的, 但是可以通过插件的实现. 但我还是不推荐这种做法, 因为这样, 这一篇文章就没办法轻易地复制到其他编辑器里面显示, 失去了 markdown 易迁移的优点, 实在得不偿失.

# 实操

<div>
    <style>
        .ss_root {
            border-radius: 8px;
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
            height: auto;
            width: 411px;
            background:url(https://images.unsplash.com/photo-1454804422997-4137c1858692);
            display: flex;
            flex-direction: column;
        }
        .ss_status_bar {
            height: 25px;
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            padding-left: 8px;
            padding-right: 8px;
            box-sizing: border-box;
        }
        .ss_status_bar>img,image {
            color: white;
            fill: white;
            height: 16px;
            border-radius: 0px;
            box-shadow: 0 0px 0px rgba(0, 0, 0, 0);
        }
        .ss_status_bar>span {
            font-size: 16px;
            color: white;
        }
        .ss_content {
            padding: 8px;
        }
        .ss_line {
            display: flex;
            flex-direction: row;
            height: 120px;
            align-items: center;
            justify-content: center;
        }
        .ss_clock {
            font-size: 48px;
            color: white;
        }
        .ss_search_bar {
            height: 48px;
            background-color: rgba(255, 255, 255, 0.85);
            width: 100%;
            margin-left: 8px;
            margin-right: 8px;
            border-radius: 24px;
            box-shadow: 0px 5px 50px -15px rgba(0, 0, 0, 0.60);
            display: flex;
            flex-direction: row;
            align-items: center;
            padding-left: 16px;
            padding-right: 16px;
            box-sizing: border-box;
        }
        .ss_search_bar>img {
            height: 24px;
            width: 24px;
        }
        .ss_indictor {
            width: 100%;
            height: 24px;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }
       .ss_indictor>*{
            max-height: 100%;
        }
        .ss_dock {
            height: 80px;
            width: 100%;
            background-color: rgba(255, 255, 255, 0.2);
            display: flex;
            flex-direction: row;
            align-items: center;
        }
        .ss_icon_container {
            flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
        }
        .ss_icon_container>img {
            background-color: white;
            box-sizing: border-box;
            height: 48px;
            width: 48px;
            border-radius: 20px;
            box-shadow: 0px 5px 50px -15px rgba(0, 0, 0, 0.60);
        }
        .ss_icon_container>span {
            color: white;
			margin-top: 8px;
            font-size: 10px;
            box-shadow: 0px 5px 50px -15px rgba(0, 0, 0, 0.60);
        }
		.ss_icon_container>br {
			height: 0;
			display: none;
		}
    </style>
    <div class="ss_root">
        <div class="ss_status_bar">
            <span style="margin-left:4px">6:00</span>
            <image style="margin-left:4px" src="https://material.io/tools/icons/static/icons/round-battery_90-24px.svg" />
            <image src="https://material.io/tools/icons/static/icons/round-signal_cellular_4_bar-24px.svg" />
            <image src="https://material.io/tools/icons/static/icons/round-network_wifi-24px.svg" />
            <image style="margin-right: 4px;" src="https://material.io/tools/icons/static/icons/round-vpn_key-24px.svg"/>
        </div>
        <div class="ss_content">
            <div class="ss_line">
                    <div class="ss_clock">
                        6:00
                    </div>
            </div>
            <div class="ss_line">
				<div class="ss_search_bar">
					<img src="https://secure.gravatar.com/avatar/24ba30616d2a20673f54c2aee36d159e.jpg" />
				</div>
            </div>
            <div class="ss_line"><span></span></div>
            <div class="ss_line"><span></span></div>
            <div class="ss_line">
                <div class="ss_icon_container">
                    <img src="https://slack-files2.s3-us-west-2.amazonaws.com/avatars/2016-03-21/28174051188_215180e097a3dd513d6d_512.png" />
                    <span>Todoist</span>
                </div>
                <div class="ss_icon_container">
                    <img src="https://lh5.ggpht.com/tq3WqEUxtRyBn-d_0t3j6WKNHuJDrmLq-FE3GAYrsAMQFIaS7FIgRLfzzql2SvfvLqto" />
                    <span>Photos</span>
                </div>
                <div class="ss_icon_container">
                    <img src="https://d2wk81qbuk09ji.cloudfront.net/6169/public/imagegallery/original/GooglePlay_512_512_1512755206.png" />
                    <span>Play Store</span>
                </div>
                <div class="ss_icon_container">
                    <img src="https://lh3.googleusercontent.com/Zmol9WVk6mjWE38P6wc3Aaz9mQn-VFhviKllLP4kiplfW4xIEjgYmKUalZcFsOOnDQ" />		                     <span>Telegram X</span>
                </div>
                <div class="ss_icon_container">
                    <img class="fullicon" src="https://lh3.ggpht.com/zC5Q4atR1JytzagSPIPAg-z4uItJGsTVjZHvf9nSeGdwrwnuPPW_OqMk6FAI3DJvzQ" />
                    <span>WeChat</span>
                </div>
            </div>
        </div>
        <div class="ss_indictor">
        </div>
        <div class="ss_dock">
            <div class="ss_icon_container">
                    <img src="https://i2.wp.com/onhax.me/wp-content/uploads/2018/03/unnamed-10.png" />
            </div>
            <div class="ss_icon_container">
                    <img src="https://lh3.googleusercontent.com/nYhPnY2I-e9rpqnid9u9aAODz4C04OycEGxqHG5vxFnA35OGmLMrrUmhM9eaHKJ7liB-" />
            </div>
            <div class="ss_icon_container">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/de/Google_Inbox_by_Gmail_logo.png" />
            </div>
            <div class="ss_icon_container">
                    <img src="https://i0.wp.com/androidpicks.com/wp-content/uploads/2017/01/Google-Messenger-Icon-New-Android-Picks.png" />
            </div>
            <div class="ss_icon_container">
                    <img src="https://i.pinimg.com/originals/85/19/d2/8519d2131098753aedc02e1e5fe2bafa.png" />
            </div>
        </div>
    </div>
</div>
    

*背景图片来自于[unsplash](https://unsplash.com/photos/vit8BCsqAho)*

我就拿我的手机主屏幕来试了一下, 似乎效果还不错, 不过有点问题就是会被文章原先的主题的样式影响到, 实际做的过程还是要花点时间的, 具体细节都懒得扣了.
而且之前我说的不依赖于外部图片, 其实不对, 你看上面各种图标其实还是要载入外部图片的.
这一段代码我发在 [Gist](https://gist.github.com/sorcererXW/549525db30582bc109be7a6dfecd6269) 上面了, 欢迎改进.

<div>
<script src="https://gist.github.com/sorcererXW/549525db30582bc109be7a6dfecd6269.js"></script>
</div>

# 总结

结论就是我喜欢这种"截图"方式, 以后也会继续使用, 但是也只会在相对比较简单的, 而且对于整篇文章相当关键的图片上面.