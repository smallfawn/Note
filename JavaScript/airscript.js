const $ = Env("测试")
let userCookie = `变量1&变量1.1@变量2&变量2.2@变量3&变量3.3`
let userList

function task(i) {
    let index = userList.indexOf(i);
    $.DoubleLog(`------ 开始第${index + 1}个账号 ------`)
    if (i.indexOf("&") !== -1) {
        let arr = i.split("&");
        console.log(`账号一的参数${arr[0]}`);
        console.log(`账号一的参数${arr[1]}`);
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
    if (Array.isArray(userList)) {
        for (let i of userList) {
            task(i)
        }
    } else {
        task(userList)
    }
    //userList = Array.isArray(userList) ? userList.forEach(task) : task(userList)
    $.sendNotify()
    $.done()
}

// Env for wps AirScript(JavaScript)
// @time 2023-7-16
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
        if (userCookie && userCookie.indexOf("@") !== -1) {
            return userCookie.split("@");
        } else if (userCookie) {
            return userCookie;
        } else {
            console.log("环境变量为空");
        }
    }
    //比如A1 那么就输出A1表格的内容
    env.getData = function (Range) {
        return Application.Range(Range).Text
    }
    env.setDate = function (Range, Value) {
        return Application.Range(Range).Value = Value
    }
    env.httpRequest = function (url, options) {
        return HTTP.fetch(url, options).json();
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
    env.random = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    env.MD5 = function (data) {
        return Crypto.createHash("md5").update(data).digest("hex")
    }
    env.SHA1 = function (data) {
        return Crypto.createHash("sha1").update(data).digest("hex")
    }
    env.SHA256 = function (data) {
        return Crypto.createHash("sha256").update(data).digest("hex")
    }
    env.HAMCMD5 = function (data, key) {
        return Crypto.createHmac("md5", key).update(data).digest('hex')
    }
    env.HAMCSHA1 = function (data, key) {
        return Crypto.createHmac("sha256", key).update(data).digest('hex')
    }
    env.HAMCSHA256 = function (data, key) {
        return Crypto.createHmac("sha256", key).update(data).digest('hex')
    }
    env.wait = function (time) {
        return Time.sleep(time)
    }
    env.done = function () {
        const endTime = Date.now();
        const costTime = (endTime - this.startTime) / 1000;
        this.DoubleLog(`🔔${this.name}, 结束! 🕛 ${costTime} 秒`);
    }
    return env;
}
