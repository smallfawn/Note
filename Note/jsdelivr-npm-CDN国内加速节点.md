JSDelivrs 是由 @Cloudflare 提供的免费开源公共 CDN。

默认的提供的节点是：cdn.jsdelivr.net 该节点国内几乎不可用，需要使用可用性高的节点作为替代。

jsdelivr 节点：常用于加速 GitHub/npm 项目，可通过更改节点改善项目在国内的可用性。
gcore.jsdelivr.net	Gcore 节点	可用性高
testingcf.jsdelivr.net	Cloudflare 节点	可用性高
quantil.jsdelivr.net	Quantil 节点	可用性尚可
fastly.jsdelivr.net	Fastly 节点	可用性尚可
originfastly.jsdelivr.net	Fastly 节点	可用性低
test1.jsdelivr.net	Cloudflare 节点	可用性低
cdn.jsdelivr.net	通用节点	可用性低
第三方提供的 jsdelivr 节点
jsd.cdn.zzko.cn	国内 CDN
jsd.onmicrosoft.cn	国内 CDN
jsdelivr.b-cdn.net	台湾 CDN
cdn.jsdelivr.us	Anycast
这两个节点国内速度很快，不清楚稳定性。

npm 节点：unpkg.com 国内几乎不可用，可用下方国内 cdn 节点。
npm.elemecdn.com	饿了么	同步快，缺的多
npm.onmicrosoft.cn	公益	需准确的版本号
unpkg.zhimg.com	知乎	同步慢
npm.akass.cn	公益	需准确的版本号
cdn.chuqis.com/npm/	公益	需准确的版本号
code.bdstatic.com/npm	百度	仅同步热门包
