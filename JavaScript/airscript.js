const $ = Env("测试")
//输入你变量所在的表格位置
let range = "A1"

let userList
function task(i) {
    let index = userList.indexOf(i);
    $.DoubleLog(`------ 开始第${index + 1}个账号 ------`)
    if (i.indexOf("&") !== -1) {
        let arr = i.split("&");
        $.DoubleLog(`账号的参数${arr[0]}`)
        $.DoubleLog(`账号的参数${arr[1]}`)
    } else {
        $.DoubleLog(`账号的参数${i}`)
    }
    //初始化变量
    let token = ""
    //执行代码
    //任务1
    apipost(i)//测试
    //任务2
    //任务3
}

function apipost() {
    let url = "https://echo.apipost.cn/get.php"
    let options = {
        method: "GET",
        headers: {},
    }
    let result = $.httpRequest(url, options)
    $.DoubleLog(result)
}
function Notice() {
    let url = "https://fastly.jsdelivr.net/gh/smallfawn/Note@main/Notice.json"
    let options = {
        method: "GET",
        headers: {},
    }
    let result = $.httpRequest(url, options)
    $.DoubleLog(result.notice)
}

main()
function main() {
    $.wait(5000)
    $.start()
    Notice()
    userList = $.checkEnv()
    userList = Array.isArray(userList) ? userList.forEach(task) : task(userList)
    /*if (Array.isArray(userList)) {
        for (let i of userList) {
            task(i)
        }
    } else {
        task(userList)
    }*/
    $.sendNotify()
    $.done()
}


// Env for wps AirScript(JavaScript)
// @time 2023-7-16
// update: new getDate & setDate
// @Author: smallfawn 
// @Github: https://github.com/smallfawn 
function Env(name) {
    const env = {};
    // 定义属性
    env.property = "value";
    // 定义方法
    env.name = name;
    env.startTime = Date.now();
    env.msg = ""
    env.DoubleLog = function (message) {
        console.log(message);
        this.msg += `\n ${message}`
    }
    env.start = function () {
        this.DoubleLog(`🔔${this.name}, 开始! 🕛`)
    }
    env.checkEnv = function () {
        let userCookie = $.getData(range) !== "" ? $.getData(range) : "";
        if (userCookie && userCookie.indexOf("@") !== -1) {
            return userCookie.split("@");
        } else if (userCookie) {
            return userCookie;
        } else {
            console.log("环境变量为空");
            return [];
        }
    };
    //比如A1 那么就输出A1表格的内容
    env.getData = function (Range) {
        return Application.Range(Range).Text
    }
    env.setDate = function (Range, Value) {
        return Application.Range(Range).Value = Value
    }
    env.httpRequest = function (url, options) {
        /*使用HTTP服务时，禁止使用IP地址发起请求，禁止使用端口发起请求。
        使用HTTP服务时，收到内容的消息体最大为2M，超过2M会抛出错误。*/
        let resp = HTTP.fetch(url, options).text();
        try { resp = JSON.parse(resp) } catch (error) { }
        return resp
    }
    env.sendNotify = function () {
        let body = {
            token: "",
            title: "来自airScript的消息通知",
            content: this.msg,
            topic: "",
        };
        if (!body.token) {
            return console.log("PushPlus token为空")
        }
        let url = "https://www.pushplus.plus/send"
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        }
        let result = this.httpRequest(url, options)
        console.log(result);
    }
    env.timestamp = function () {
        return Date.now();
    }
    env.randomString = function (len, charset = 'abcdef0123456789') {
        let str = ''; for (let i = 0; i < len; i++) { str += charset.charAt(Math.floor(Math.random() * charset.length)); }
        return str;
    }
    env.random = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    /**
     * Hash加密 允许"md5", "sha1", "sha", "sha256", "sha512"
     * @param {*} algorithm 加密方法
     * @param {*} data 加密参数
     * @param {*} returnType 返回类型 默认hex
     * @returns 
     */
    env.HashEncrypt = function (algorithm, data, returnType = "hex") {
        return Crypto.createHash(algorithm).update(data).digest(returnType)
    }
    /**
     * Hmac加密 允许"md5", "sha1", "sha", "sha256", "sha512"
     * @param {*} algorithm 加密方法
     * @param {*} data 加密参数
     * @param {*} key 加密密钥
     * @param {*} returnType 返回类型 默认hex
     * @returns 
     */
    env.HmacEncrypt = function (algorithm, data, key, returnType = "hex") {
        return Crypto.createHmac(algorithm, key).update(data).digest(returnType)
    }
    env.wait = function (time) {
        return Time.sleep(time)
    }
    env.base64Encrypt = function (data) {
        let base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; let result = ""; let i = 0; while (i < data.length) { let char1 = data.charCodeAt(i++); let char2 = data.charCodeAt(i++); let char3 = data.charCodeAt(i++); let enc1 = char1 >> 2; let enc2 = ((char1 & 3) << 4) | (char2 >> 4); let enc3 = ((char2 & 15) << 2) | (char3 >> 6); let enc4 = char3 & 63; if (isNaN(char2)) { enc3 = enc4 = 64 } else if (isNaN(char3)) { enc4 = 64 } result += base64Chars.charAt(enc1) + base64Chars.charAt(enc2) + base64Chars.charAt(enc3) + base64Chars.charAt(enc4) }
        return result
    }
    env.base64Decrypt = function (data) {
        let base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; let result = ""; let i = 0; while (i < data.length) { let enc1 = base64Chars.indexOf(data.charAt(i++)); let enc2 = base64Chars.indexOf(data.charAt(i++)); let enc3 = base64Chars.indexOf(data.charAt(i++)); let enc4 = base64Chars.indexOf(data.charAt(i++)); let char1 = (enc1 << 2) | (enc2 >> 4); let char2 = ((enc2 & 15) << 4) | (enc3 >> 2); let char3 = ((enc3 & 3) << 6) | enc4; result += String.fromCharCode(char1); if (enc3 != 64) { result += String.fromCharCode(char2) } if (enc4 != 64) { result += String.fromCharCode(char3) } }
        return result
    }
    env.done = function () {
        const costTime = (Date.now() - this.startTime) / 1000;
        this.DoubleLog(`🔔${this.name}, 结束! 🕛 ${costTime} 秒`);
    }
    return env;
}
