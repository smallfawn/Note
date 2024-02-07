https://www.mi-d.cn/5800              黑群晖SSH 开启ROOT权限后进入容器  

docker ps 查看容器

docker exec -it ID或者NAME /bin/bash

执行 npm config set registry https://registry.npmmirror.com 设置镜像源

备用 npm config set registry https://registry.npm.taobao.org/

由于文件有权限设置 导致命令docker 执行的无法自动创建文件  所以要手动创建 并且在docker部署时手动修改映射文件夹  参考百度
刷引导U盘
https://www.mi-d.cn/6802  https://www.mi-d.cn/4029  
原版https://github.com/wjz304

开启NVME存储 https://www.mi-d.cn/5784
