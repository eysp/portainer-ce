# Portainer中文版

Docker好评率比较高的Portainer面板，完整汉化版，

汉化过程中原来没汉化词条非常多，版本是在1.24.2请熟知。

其实还有很大一部分基本上用不到的没汉化，你能看到的也没基本都汉化了，注册页面好像没汉化

经测试群晖和openwrt均可用，arm架构欢迎各位测试，有问题欢迎加Q群[758648462](https://jq.qq.com/?_wv=1027&k=5U91thC)反馈交流

**另外看清楚我的代码把端口改为9999了，所以访问IP:9999**

**具体看图吧，懒得打字，另外本人小学毕业，大多是谷歌百度翻译+我自己的理解，翻译不准确欢迎指教，不喜勿喷**

运行，适合x86-64架构CPU
```
docker run -d --restart=always --name=portainer -p 9999:9000 -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data 6053537/portainer
```

运行，适合arm-64架构CPU
```
docker run -d --restart=always --name=portainer -p 9999:9000 -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data 6053537/portainer:linux-arm64
```

