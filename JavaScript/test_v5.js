/**
 * cron 5 15 * * *  V5.js
 * Show:重写请求函数 在got环境或axios环境都可以请求
 * 变量名:
 * 变量值:
 * scriptVersionNow = "0.0.1";
 */

const $ = new Env("V5测试模板");
const notify = $.isNode() ? require('./sendNotify') : '';
let ckName = "test";
let envSplitor = ["&", "\n"]; //多账号分隔符
let strSplitor = "#"; //多变量分隔符
let userIdx = 0;
let userList = [];
let msg = ""
class Task {
    constructor(str) {
        this.index = ++userIdx;
        this.ck = str.split(strSplitor)[0]; //单账号多变量分隔符
        this.host = "echo.apipost.cn";
        this.hostname = "https://" + this.host;
        this.ckStatus = true;
    }
    async main() {
        await this.user_info();
    }
    async taskRequest(method, url, body = "") {
        //
        let headers = {}
        const reqeuestOptions = {
            url: url,
            method: method,
            headers: headers
        }
        method == "get" ? "" : Object.assign(reqeuestOptions, { body: body })
        let { body: result } = await $.httpRequest(reqeuestOptions)
        return result
    }
    async user_info() {
        try {
            let result = await this.taskRequest("get", `${this.hostname}/get.php`)
            console.log(result);
            if (result.errcode == 0) {
                $.log(`✅账号[${this.index}]  欢迎用户: ${result.errcode}🎉`)
                this.ckStatus = true;
            } else {
                $.log(`❌账号[${this.index}]  用户查询: 失败`);
                this.ckStatus = false;
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
}



!(async () => {
    if (!(await checkEnv())) return;
    if (userList.length > 0) {
        let taskall = [];
        for (let user of userList) {
            if (user.ckStatus) {
                taskall.push(user.main());
            }
        }
        await Promise.all(taskall);
    }
    await $.sendMsg($.logs.join("\n"))
})()
    .catch((e) => console.log(e))
    .finally(() => $.done());

//********************************************************
/**
 * 变量检查与处理
 * @returns
 */
async function checkEnv() {
    let userCookie = ($.isNode() ? process.env[ckName] : $.getdata(ckName)) || "";
    if (userCookie) {
        let e = envSplitor[0];
        for (let o of envSplitor)
            if (userCookie.indexOf(o) > -1) {
                e = o;
                break;
            }
        for (let n of userCookie.split(e)) n && userList.push(new Task(n));
    } else {
        console.log(`未找到CK【${ckName}】`);
        return;
    }
    return console.log(`共找到${userList.length}个账号`), true; //true == !0
}
//Env Api =============================
/*
*   @modifyAuthor @smallfawn 
*   @modifyTime 2024-05-01
*   @modifyInfo 抽离操作文件的函数
*/
//Env Api =============================
/*
 *   @modifyAuthor @smallfawn
 *   @modifyTime 2024-05-01
 *   @modifyInfo 抽离操作文件的函数
 */
function Env(t, s) {
    return new (class {
        constructor(t, s) {
            this.name = t;
            this.logs = [];
            this.logSeparator = "\n";
            this.startTime = new Date().getTime();
            Object.assign(this, s);
            this.log("", `\ud83d\udd14${this.name},\u5f00\u59cb!`);
        }
        isNode() {
            return "undefined" != typeof module && !!module.exports;
        }
        isQuanX() {
            return "undefined" != typeof $task;
        }
        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
        }
        isLoon() {
            return "undefined" != typeof $loon;
        }
        initRequestEnv(t) {
            try {
                require.resolve("got") &&
                    ((this.requset = require("got")), (this.requestModule = "got"));
            } catch (e) { }
            try {
                require.resolve("axios") &&
                    ((this.requset = require("axios")), (this.requestModule = "axios"));
            } catch (e) { }
            this.cktough = this.cktough ? this.cktough : require("tough-cookie");
            this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
            if (t) {
                t.headers = t.headers ? t.headers : {};
                if (
                    typeof t.headers.Cookie === "undefined" &&
                    typeof t.cookieJar === "undefined"
                ) {
                    t.cookieJar = this.ckjar;
                }
            }
        }
        queryStr(options) {
            return Object.entries(options)
                .map(
                    ([key, value]) =>
                        `${key}=${typeof value === "object" ? JSON.stringify(value) : value
                        }`
                )
                .join("&");
        }
        getURLParams(url) {
            const params = {};
            const queryString = url.split("?")[1];
            if (queryString) {
                const paramPairs = queryString.split("&");
                paramPairs.forEach((pair) => {
                    const [key, value] = pair.split("=");
                    params[key] = value;
                });
            }
            return params;
        }
        isJSONString(str) {
            try {
                return JSON.parse(str) && typeof JSON.parse(str) === "object";
            } catch (e) {
                return false;
            }
        }
        isJson(obj) {
            var isjson =
                typeof obj == "object" &&
                Object.prototype.toString.call(obj).toLowerCase() ==
                "[object object]" &&
                !obj.length;
            return isjson;
        }
        async sendMsg(message) {
            if (!message) return;
            if (this.isNode()) {
                await notify.sendNotify(this.name, message);
            } else {
                this.msg(this.name, "", message);
            }
        }
        async httpRequest(options) {
            let t = { ...options };
            t.headers = t.headers || {};
            if (t.params) {
                t.url += "?" + this.queryStr(t.params);
            }
            t.method = t.method.toLowerCase();
            if (t.method === "get") {
                delete t.headers["Content-Type"];
                delete t.headers["Content-Length"];
                delete t.headers["content-type"];
                delete t.headers["content-length"];
                delete t.body;
            } else if (t.method === "post") {
                let ContentType;
                if (!t.body) {
                    t.body = "";
                } else if (typeof t.body === "string") {
                    ContentType = this.isJSONString(t.body)
                        ? "application/json"
                        : "application/x-www-form-urlencoded";
                } else if (this.isJson(t.body)) {
                    t.body = JSON.stringify(t.body);
                    ContentType = "application/json";
                }
                if (!t.headers["Content-Type"] && !t.headers["content-type"]) {
                    t.headers["Content-Type"] = ContentType;
                }
            }
            if (this.isNode()) {
                this.initRequestEnv(t);
                if (this.requestModule === "axios" && t.method === "post") {
                    t.data = t.body;
                    delete t.body;
                }
                let httpResult;
                if (this.requestModule === "got") {
                    httpResult = await this.requset(t);
                    if (this.isJSONString(httpResult.body)) {
                        httpResult.body = JSON.parse(httpResult.body);
                    }
                } else if (this.requestModule === "axios") {
                    httpResult = await this.requset(t);
                    httpResult.body = httpResult.data;
                }
                return httpResult;
            }
            if (this.isQuanX()) {
                t.method = t.method.toUpperCase();
                return new Promise((resolve, reject) => {
                    $task.fetch(t).then((response) => {
                        if (this.isJSONString(response.body)) {
                            response.body = JSON.parse(response.body);
                        }
                        resolve(response);
                    });
                });
            }
        }
        randomNumber(length) {
            const characters = "0123456789";
            return Array.from(
                { length },
                () => characters[Math.floor(Math.random() * characters.length)]
            ).join("");
        }
        randomString(length) {
            const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
            return Array.from(
                { length },
                () => characters[Math.floor(Math.random() * characters.length)]
            ).join("");
        }
        timeStamp() {
            return new Date().getTime();
        }
        uuid() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                /[xy]/g,
                function (c) {
                    var r = (Math.random() * 16) | 0,
                        v = c == "x" ? r : (r & 0x3) | 0x8;
                    return v.toString(16);
                }
            );
        }
        time(t) {
            let s = {
                "M+": new Date().getMonth() + 1,
                "d+": new Date().getDate(),
                "H+": new Date().getHours(),
                "m+": new Date().getMinutes(),
                "s+": new Date().getSeconds(),
                "q+": Math.floor((new Date().getMonth() + 3) / 3),
                S: new Date().getMilliseconds(),
            };
            /(y+)/.test(t) &&
                (t = t.replace(
                    RegExp.$1,
                    (new Date().getFullYear() + "").substr(4 - RegExp.$1.length)
                ));
            for (let e in s)
                new RegExp("(" + e + ")").test(t) &&
                    (t = t.replace(
                        RegExp.$1,
                        1 == RegExp.$1.length
                            ? s[e]
                            : ("00" + s[e]).substr(("" + s[e]).length)
                    ));
            return t;
        }
        msg(s = t, e = "", i = "", o) {
            const h = (t) =>
                !t || (!this.isLoon() && this.isSurge())
                    ? t
                    : "string" == typeof t
                        ? this.isLoon()
                            ? t
                            : this.isQuanX()
                                ? { "open-url": t }
                                : void 0
                        : "object" == typeof t && (t["open-url"] || t["media-url"])
                            ? this.isLoon()
                                ? t["open-url"]
                                : this.isQuanX()
                                    ? t
                                    : void 0
                            : void 0;
            this.isMute ||
                (this.isSurge() || this.isLoon()
                    ? $notification.post(s, e, i, h(o))
                    : this.isQuanX() && $notify(s, e, i, h(o)));
            let logs = ["", "==============📣系统通知📣=============="];
            logs.push(t);
            e ? logs.push(e) : "";
            i ? logs.push(i) : "";
            console.log(logs.join("\n"));
            this.logs = this.logs.concat(logs);
        }
        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]),
                console.log(t.join(this.logSeparator));
        }
        logErr(t, s) {
            const e = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            e
                ? this.log("", `\u2757\ufe0f${this.name},\u9519\u8bef!`, t.stack)
                : this.log("", `\u2757\ufe0f${this.name},\u9519\u8bef!`, t);
        }
        wait(t) {
            return new Promise((s) => setTimeout(s, t));
        }
        done(t = {}) {
            const s = new Date().getTime(),
                e = (s - this.startTime) / 1e3;
            this.log(
                "",
                `\ud83d\udd14${this.name},\u7ed3\u675f!\ud83d\udd5b ${e}\u79d2`
            );
            this.log();
            if (this.isNode()) {
                process.exit(1);
            }
            if (this.isQuanX()) {
                $done(t);
            }
        }
    })(t, s);
}
function Bucket() {
    return new (class {
        constructor(fileName) {
            this.fileName = fileName;
            this.ensureFileExists();
            this.data = this.readFile();
        }
        ensureFileExists() {
            this.fs ? this.fs : (this.fs = require("fs"));
            this.path ? this.path : (this.path = require("path"));
            this.filePath = this.path.join(__dirname, this.fileName);
            if (!this.fs.existsSync(this.filePath)) {
                this.fs.writeFileSync(this.filePath, "{}");
            }
        }
        readFile() {
            try {
                const data = this.fs.readFileSync(this.filePath, "utf-8");
                return JSON.parse(data);
            } catch (error) {
                console.error(`Error reading file:${error}`);
                return {};
            }
        }
        writeFile() {
            try {
                this.fs.writeFileSync(
                    this.filePath,
                    JSON.stringify(this.data, null, 2)
                );
            } catch (error) { }
        }
        set(key, value) {
            this.data[key] = value;
            this.writeFile();
        }
        get(key) {
            return this.data[key];
        }
    })();
}
