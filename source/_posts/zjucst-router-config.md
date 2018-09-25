---
title: 浙大软院路由器配置指南
date: 2018-09-12 12:00:00
tags: [宽带症候群, 浙江大学软件学院]
---

刚入学, 发现校园网是使用 srun 3000 进行认证, 可以使用客户端或或者网页认证. 可是无论是客户端还是网页, 登录之后都有一个不能关闭的窗口, 一旦关闭就断开网络, ~~虽然可以丢到一个新建的桌面, 眼不见心不烦~~, 这是不能忍的.

幸好, 把本科期间的路由器带来了, 我的路由器是华硕的 P1900, 刷了原版梅林系统, 不过下面的操作, 对于 OpenWRT 也是一样的.

# 失败: 使用Linux客户端

在 196.0.0.6 的文档里面, 关于 linux 登录的说明是使用 srun 3000 的专用 auth 程序进行登录. 

但是, 测试后发现, 这个程序无法在路由器上进行运行, 会出现 `Syntax error: "(" unexpected` 错误, Google 之后知道是这个客户端的编译方式无法在路由器上运行

# 模拟登陆

既然客户端不行, 那就试试看模拟登陆. 在网页上登录, 用 Chrome 控制台查看了一下, 发现就是往 `192.0.0.6/cgi-bin/` 发送了一个请求, 登录用户名密码保存在 formdata 里面 ( 密码使用 md5 处理过了) 

这样子以来, 自己使用 curl 命令也能实现登录, 不过处理异常信息会比较麻烦.

## 一键脚本

搜索了一下, 发现 github 已经有软院的校网[验证脚本](https://github.com/0xHJK/srunauth)了, 感谢作者🙏

考虑到路由器没有连上网络, 无法直接 clone 项目, 我把代码贴出来, 直接复制黏贴到 ssh 里面就好了.

首先把路由器的外部网络(wan) 切换到动态 ip 模式

ssh 进入路由器

```
可以放置再任意的目录, 我放在 /jffs, 请不要选择 /tmp 目录, 包括 /tmp 下的任意子目录, 可能会被定时清除
cd /jffs
mkdir srunauth
cd srunauth
vi auth.sh
```

贴上一面一段代码, 根据注释, 进行修改

```bash
#!/bin/bash 
# 如果路由器没有 bash ( /bin/bash ) 就替换成 /bin/sh
# Author HJK <https://github.com/0xHJK>

USERNAME='' # 填上用户名 ( 学号 )
PASSWORD='' # 密码 ( 直接填, 不需要 md5 )
USERSFILE='users.txt'
STATEFILE='state.txt'
DOMAIN='192.0.0.6'
COMMOND='do_login'
VERBOSE='y'

usage(){
    echo "Usage: bash `basename $0` [-q] [-u username] [-p password] [-f file] [Commond]"
    echo "Commonds: login, logout"
    exit 1
}
md5_hash(){
    if [[ `uname | grep 'Darwin'` ]]; then
        echo -n ${1} | md5 -q | cut -c9-24
    else
        echo -n ${1} | md5sum | cut -c9-24
    fi
}

say_out(){
    if [[ ${VERBOSE} == 'y' ]]; then echo $*; fi
}

submit(){
    msg=`curl -s "http://${DOMAIN}/cgi-bin/${1}" -H 'Pragma: no-cache' -H "Origin: http://${DOMAIN}" -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4' -H 'User-Agent: Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Accept: */*' -H 'Cache-Control: no-cache' -H "Referer: http://${DOMAIN}/" -H 'Connection: keep-alive' -H 'DNT: 1' --data "username=${2}&password=${3}&drop=0&type=1&n=1" --compressed`
    if [[ `echo ${msg} | grep 'ip_exist_error'` ]]; then
        echo "IP尚未下线  ${msg}"
    elif [[ `echo ${msg} | grep 'online_num_error'` ]]; then
        echo "账号 ${USERNAME} 登录人数超过限额 ${msg}"
    elif [[ `echo ${msg} | grep 'username_error'` ]]; then
        echo "用户名 ${USERNAME} 错误  ${msg}"
    elif [[ `echo ${msg} | grep 'password_error'` ]]; then
        echo "密码 ${PASSWORD} 错误  ${msg}"
    elif [[ `echo ${msg} | grep 'logout_ok'` ]]; then
        echo "账号 ${USERNAME} 注销成功  ${msg}"
    elif [[ `echo ${msg} | grep '[0-9]\{10,\}'` ]]; then
        echo "账号 ${USERNAME} 登录成功  ${msg}"
    else
        echo "未知消息 ${msg}"
    fi
}

# 当有参数时获取参数
if [ $# -gt 0 ]; then
    while getopts :qu:p:f: OPTION
    do
        case $OPTION in
            q) VERBOSE='n' ;;
            u) USERNAME=$OPTARG ;;
            p) PASSWORD=$OPTARG ;;
            f) USERSFILE=$OPTARG ;;
            \?) usage ;;
        esac
    done
fi

shift $(($OPTIND - 1)) # 如果这一句话出错, 注释掉

# 如果登录
if [ $# -eq 0 ] || [[ $1 == 'login' ]]; then
    # 如果账号密码为空，则从文件里读取
    if [[ ${USERNAME} == '' ]] || [[ ${PASSWORD} == '' ]]; then
        while read l1; do
            USERNAME=`echo -n $l1 | awk '{ print $1 }'`
            PASSWORD=`echo -n $l1 | awk '{ print $2 }'`
            say_out "正在尝试登录 ${USERNAME} ${PASSWORD}"
            PASSWORD=`md5_hash ${PASSWORD}`
            # 如果登录成功，则退出循环，并记录账号密码
            state=`submit 'do_login' ${USERNAME} ${PASSWORD}`
            say_out "state: ${state}"
            if [[ `echo "${state}" | grep '成功'` ]]; then
                echo "${USERNAME} 登录成功"
                echo "${USERNAME} ${PASSWORD}" > ${STATEFILE}
                exit
            fi
        done < ${USERSFILE}
        echo "所有账号登录失败"
    else
        say_out "正在尝试登录 ${USERNAME} ${PASSWORD}"
        PASSWORD=`md5_hash ${PASSWORD}`
        submit 'do_login' ${USERNAME} ${PASSWORD}
    fi
# 如果注销
elif [[ $1 == 'logout' ]]; then
    # 如果账号密码为空，则从文件里读取
    if [[ ${USERNAME} == '' ]] || [[ ${PASSWORD} == '' ]]; then
        USERNAME=`cat ${STATEFILE} | awk '{ print $1 }'`
        PASSWORD=`cat ${STATEFILE} | awk '{ print $2 }'`
        say_out "正在尝试注销 ${USERNAME} ${PASSWORD}"
    fi
    submit 'force_logout' ${USERNAME} ${PASSWORD}
else
    usage
fi
```

最后`:wq`退出

```
chmod +x auth.sh
touch state.txt
touch users.txt
```

配置好了

运行`./auth.sh` 就可以登录, `./auth.sh logout` 就可以注销
