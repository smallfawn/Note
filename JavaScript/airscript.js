const $ = Env("")
let msg = ""

main()
function main() {
    Notice()
    sendNotify()
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


function sendNotify() {
    let body = {
        token: "",
        title: "来自airScript的消息通知",
        content: msg,
        topic: "",
    };
    let url = "https://www.pushplus.plus/send"
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    }
    let result = $.httpRequest(url, options)
    console.log(result);
}
function Env() {
    const env = {};
    // 定义属性
    env.property = "value";
    // 定义方法
    env.DoubleLog = function (message) {
        console.log(message);
        msg += `\n ${message}`
    }
    env.httpRequest = function (url, options) {
        return HTTP.fetch(url, options).json();
    }
    
    return env;
}
