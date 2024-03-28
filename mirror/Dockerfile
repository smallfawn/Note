FROM ubuntu
# 更新并安装必要的软件包
RUN apt update && apt install -y \
 git \
 git-lfs \
 python3 \
 python3-pip
# 设置 SSH 配置
RUN echo "StrictHostKeyChecking no" >> /etc/ssh/ssh_config
# 复制脚本文件到镜像中
COPY mirror/*.sh /
# 复制根目录中的 action.yml 文件到镜像中
COPY action.yml /
# 复制根目录中的 hub-mirror 文件夹到镜像中的根目录下的 hub-mirror 文件夹中
COPY /hub-mirror /hub-mirror
# 设置容器启动时的入口点
ENTRYPOINT ["/mirror/entrypoint.sh"]
