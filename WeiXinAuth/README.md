# 1.APP 应用（移动应用）

1.通过 Appid 和 Appsecret 获取 access_token

https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=appid&secret=secret

2.通过 access_token 拿到 sdk_ticket(有效期 7200 秒 2 小时 ticket 过期可重新获取 重复调用会限流)

https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=accessToken&type=2

3.拿到 sdk_ticket 生成授权二维码

拿到 ticket 后 按照下面的加密和请求后即可获取 uuid
https://open.weixin.qq.com/connect/qrcode/ uuid（展示二维码）
https://open.weixin.qq.com/connect/confirm?uuid=xxxxxx (可直接转码可扫描)

```JavaScript
function randomString(len = 16) {
  const keyString = '1234567890abcdefghijklmnopqrstuvwxyz';
  const _key = [];
  const keyStringArr = keyString.split('');
  for (let i = 0; i < len; i += 1) {
    const ceil = Math.ceil((keyStringArr.length - 1) * Math.random());
    const _tmp = keyStringArr[ceil];
    _key.push(_tmp);
  }
  return _key.join('');
};
function sha1(str) {
  const crypto = require('crypto');
  return crypto.createHash("sha1").update(str).digest('hex')
}
const appid = ``
const noncestr = randomString()
const ticket = ``//通过接口获得
const timestamp = Date.now();
const signaturePrams = `appid=${appid}&noncestr=${noncestr}&sdk_ticket=${ticket}&timestamp=${timestamp}`;
const signature = sha1(signaturePrams)
console.log(signaturePrams);
const url = `https://open.weixin.qq.com/connect/sdk/qrconnect?appid=${appid}&noncestr=${noncestr}&timestamp=${timestamp}&scope=snsapi_userinfo&signature=${signature}`
console.log(url);
```

# 2.H5 应用（网页应用）

1.这里以知乎为例 wx268fcfe924dcb171
https://open.weixin.qq.com/connect/qrconnect?appid=wx268fcfe924dcb171&redirect_uri=https%3A%2F%2Fwww.zhihu.com%2Foauth%2Fcallback%2Fwechat%3Faction%3Dlogin%26from%3D&response_type=code&scope=snsapi_login#wechat

```JavaScript
redirect_uri为登录后重定向的url response_type表示返回的内容 scope域
var fordevtool = "https://long.open.weixin.qq.com/connect/l/qrconnect?uuid=xxxxxxx"
            // console.log('devtool use', fordevtool)  uuid内嵌在html网页里面
```

https://lp.open.weixin.qq.com/connect/l/qrconnect?uuid=aaaaaaaa&_=1701256440100 \_时间戳

window.wx_errcode=408;window.wx_code=''; 无状态 成功会显示 code
