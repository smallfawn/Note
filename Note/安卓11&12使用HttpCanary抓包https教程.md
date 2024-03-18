这里分享的是安卓11和安卓12使用HttpCanary抓包https教程，可以解决微信QQ等APP抓包时无网络的问题。部分教程内容参考自酷安，本人MIUI12.5 安卓11测试通过。

首先手机必须要root，并且已安装Magisk、LSPosed，这些的安装方法不在本文讨论范围内。如果手机没root也可以用VMOS虚拟机或电脑安卓模拟器。


安装 HttpCanary，这里推荐安装magisk版本，安装好直接可以用，包含根证书等。注意magisk模块安装好之后需要重启手机才能生效。

https://wwu.lanzoul.com/b030w2ivc  密码：5txp


然后需要安装 JustTrustMe 这个Xposed插件，主要用于解决抓取https时APP无网络的问题

https://wwi.lanzoub.com/iQ54c02sivoj


在LSPosed管理器里面开启 JustTrustMe 插件，作用域选要抓包的APP。注意APP需要强制关闭之后，再启动，才能成功加载该Xposed插件。



这样在HttpCanary打开后就能成功抓到https的包了，同时也支持微信小程序抓包。
