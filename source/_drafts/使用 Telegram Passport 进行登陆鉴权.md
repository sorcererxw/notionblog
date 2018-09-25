这两天在做一个 Telegram 贴图包编辑器, 发现所有获取用户 id ( 相当于 Token ) 有些繁琐. 对于普通用户来说, 无法使用直接获取自己的账户 id, 需要用户自己通过 bot 进行查询. 这样子的体验并不好. 正好这时候发现 Telegram Passport 的功能, 允许外部软件获取 Telegram 的用户的信息. 于是尝试了一下.

# 创建一个 bot

一个 telegram bot 是 telegram 开发者为用户提供服务的基础, 只有拥有了 bot 的 token 了, 才可以访问 telegram bot api 接口. 而 telegram passport 也是 bot 的能力之一.

 

