/**
 * cron 5 15 * * *  V5.js
 * Show:重写请求函数 在got环境或axios环境都可以请求
 * 变量名:
 * 变量值:
 * scriptVersionNow = "0.0.1";
 */

const $ = new Env("V5测试模板");
const axios = require('axios');
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
    this.ckStatus = true;
  }
  async main() {
    await this.UserInfo();
  }
  async UserInfo() {
    let result = await this.taskRequest({ method: "GET", url: `https://echo.apipost.cn/get.php` })
    //console.log(result);
    if (result.errcode == 0) {
      $.log(`✅账号[${this.index}]  欢迎用户: ${result.errcode}🎉`)
      this.ckStatus = true;
    } else {
      $.log(`❌账号[${this.index}]  用户查询: 失败`);
      this.ckStatus = false;
      //console.log(result);
    }
  }

  async taskRequest(options) {
    let headers = {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.99 Mobile Safari/537.36/lenovoofficialapp/9e4bb0e5bc326fb1_10219183246/newversion/versioncode-1000112/',
      'Accept-Encoding': 'gzip, deflate',
      'pragma': 'no-cache',
      'cache-control': 'no-cache',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    }
    Object.assign(options, { headers })
    let { data: result } = await axios.request(options)
    return result
  }
}



!(async () => {
  console.log(`==================================================\n 脚本执行 - 北京时间(UTC+8): ${new Date(
    new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000
  ).toLocaleString()} \n==================================================`);
  if (!(await checkEnv())) return;
  let taskall = [];
  for (let user of userList) {
    taskall.push(await user.main());
  }
  await Promise.all(taskall);

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
      /(y+)/.test(t) && (t = t.replace(RegExp.$1, (new Date().getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let e in s) {
        new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? s[e] : ("00" + s[e]).substr(("" + s[e]).length)));
      }
      return t;
    };
    msg(title = t, subtitle = "", body = "", options) {
      const formatOptions = (options) => {
        if (!options) {
          return options;
        } else if (typeof options === "string") {
          if (this.isQuanX()) {
            return { "open-url": options };
          } else {
            return undefined;
          }
        } else if (typeof options === "object" && (options["open-url"] || options["media-url"])) {
          if (this.isQuanX()) {
            return options;
          } else {
            return undefined;
          }
        } else {
          return undefined;
        }
      };
      if (!this.isMute) {
        if (this.isQuanX()) {
          $notify(title, subtitle, body, formatOptions(options));
        }
      }
      let logs = ["", "==============📣系统通知📣=============="];
      logs.push(title);
      subtitle ? logs.push(subtitle) : "";
      body ? logs.push(body) : "";
      console.log(logs.join("\n"));
      this.logs = this.logs.concat(logs);
    };
    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]),
        console.log(t.join(this.logSeparator));
    }
    logErr(t, s) {
      const e = !this.isQuanX();
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
