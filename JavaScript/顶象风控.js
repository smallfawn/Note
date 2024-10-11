/*! v1.2852.0(3332) 2022-07-08 10:10:02 */
const axios = require('axios');
async function request(url, method, params, headers) {
    return await axios({
        url: url,
        method: method,
        params: params,
        headers: headers
    })
}
const W = {
    "encode": function (a, u) {

        if (!a)
            return "";
        var P = ""
        for (var b, _, S, E, x, T, A, O = 0; O < a['length'];) {

            b = a['charCodeAt'](O++);

            _ = a['charCodeAt'](O++);

            S = a['charCodeAt'](O++)
            E = b >> 2
            x = (b & 3) << 4 | _ >> 4
            T = (_ & 15) << 2 | S >> 6
            A = S & 63
            isNaN(_) ? T = A = 64 : isNaN(S) && (A = 64)
            P = P + u['charAt'](E) + u['charAt'](x) + u['charAt'](T) + u['charAt'](A);
        }

        return P
    }
}

function randomNumber(n) {
    return Math.floor(Math.random() * n)
}
function randomString(n) {
    var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        a = t.length,
        e = "";
    for (var i = 0; i < n; i++)
        e += t.charAt(Math.floor(Math.random() * a));
    return e
}
async function main() {
    //第一次请求
    let fristEncData = {
        "lid": Date.now() + "" + randomString(32), //时间戳+ 随机字符串32位
        "lidType": "0",
        "cache": true,
        "appKey": "8c8b64324274bd85cb1a410769046ca5"
    }
    let key1 = 'S0DOZN9bBJyPV-qczRa3oYvhGlUMrdjW7m2CkE5_FuKiTQXnwe6pg8fs4HAtIL1x='
    let fristRes = {
        "data": "950ad1eb840058e16877f1f3b9b0fdd3bc3f2af413c846d7686fa928279fd77a8018c559", //这里DATA为第二次请求的LID 其中LIDTYPE这时候为1   这里可以缓存data为第三次第四次的lid 
        "msg": "The lid is invalid.",
        "status": -4
    }
    //第二次请求  生成TOKEN

    let secondEncData = {
        "lid": "54ed8e1f86b1ca127ac0bcaefacda8b62bc3f34ff6bd9d6d08a5b2561258ccf32104c64d",
        "lidType": 1,
        "cache": true,
        "can": "eac893f2d3c0c53c2afa8d6ce3afa058",
        "web": "7498974d51b7fcdf95612d5a13468802",
        "gi": "Google Inc. (AMD);ANGLE (AMD, AMD Radeon RX 6600M (0x000073FF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
        "pr": 1,
        "dm": 8,
        "cc": "unknown",
        "hc": 16,
        "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 SLBrowser/9.0.5.8121 SLBChan/103 SLBVPV/64-bit",
        "np": "Win32",
        "lug": "zh-CN",
        "ce": 1,
        "ts": "0;false;false",
        "timezone": "Asia/Shanghai",
        "to": -480,
        "ls": 1,
        "ss": 1,
        "ind": 1,
        "ab": 0,
        "od": 0,
        "cd": 24,
        "res": "1920;1080",
        "ar": "1920;1032",
        "vs": "667;928",
        "ws": "1920;1032",
        "rp": "Chromium PDF Plugin;Chromium PDF Viewer",
        "adb": false,
        "hl": 2,
        "cl": 4,
        "st": 96743,//随机
        "ct": 1, //1为抽奖页 可以用缓存生成TOKEN 2不可以缓存
        "hlb": false,
        "hll": false,
        "hlo": false,
        "hlr": false,
        "db": 1,
        "sm": 0,
        "appKey": "8c8b64324274bd85cb1a410769046ca5"
    }
    let key2 = 'S0DOZN9bBJyPV-qczRa3oYvhGlUMrdjW7m2CkE5_FuKiTQXnwe6pg8fs4HAtIL1x='
    //返回
    let secondRes = {
        data: '6708be20cIfbisuD74hE3zKyDFTyv52AwNwTd5p1',
        msg: 'The token has been generated successfully.',
        status: 2
    }

    //大于等于3次的请求   验证TOKEN  拿到第一次缓存的lid 请求头加上If-None-Match验证TOKEN是否还有效  如果作为脚本生成参数一般不需要验证这个TOKEN 生成后 5分钟或者3分钟内直接可以用
    let thirdEncData = {
        "lid": "54ed8e1f86b1ca127ac0bcaefacda8b62bc3f34ff6bd9d6d08a5b2561258ccf32104c64d",//第一次缓存的lid
        "lidType": 1,
        "cache": true,
        "appKey": "8c8b64324274bd85cb1a410769046ca5"
    }
    let key3 = 'S0DOZN9bBJyPV-qczRa3oYvhGlUMrdjW7m2CkE5_FuKiTQXnwe6pg8fs4HAtIL1x='
    const param = W['encode'](JSON.stringify(secondEncData), 'S0DOZN9bBJyPV-qczRa3oYvhGlUMrdjW7m2CkE5_FuKiTQXnwe6pg8fs4HAtIL1x=')

    const { data: res } = await request("https://fmsfk.bhmc.com.cn:8090/udid/c1?", "GET", {

    }, {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Connection": "keep-alive",
        "Host": "fmsfk.bhmc.com.cn:8090",
        "Origin": "https://bm2-wx.bluemembers.com.cn",
        "Param": param,
        "Referer": "https://bm2-wx.bluemembers.com.cn/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 SLBrowser/9.0.5.8121 SLBChan/103 SLBVPV/64-bit",
        "sec-ch-ua": "\"Chromium\";v=\"9\", \"Not?A_Brand\";v=\"8\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        //"If-None-Match": "6708c739fLUc4PohZtaW7sfM9oOv7Nf4GdHsgOR1"
    })
    console.log(res);

}

main()
