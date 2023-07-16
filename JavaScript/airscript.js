main()
function main() {
    sendNotify()
}
function Notice() {
    let url = "https://fastly.jsdelivr.net/gh/smallfawn/Note@main/Notice.json"
    let options = {
        method: "GET",
        headers: {},
    }
    let result = httpRequest(url, options)
    console.log(result.notice);
    return result.notice
}
function sendNotify() {
    let content = Notice()
    let body = {
        token: "",
        title: "来自airScript的消息通知",
        content: content,
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
    let result = httpRequest(url, options)
    console.log(result);
}

function httpRequest(url, options) {
    return HTTP.fetch(url, options).json()
}
