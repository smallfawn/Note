function Env(t, s) {
  return new (class {
    constructor(t, s) {
      this.name = t;
      this.data = null;
      this.dataFile = "box.dat";
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
    loaddata() {
      if (!this.isNode()) return {};
      this.fs = this.fs ? this.fs : require("fs")
      this.path = this.path ? this.path : require("path");
      // 获取数据文件的绝对路径
      const t = this.path.resolve(this.dataFile);
      const s = this.path.resolve(process.cwd(), this.dataFile);
      const e = this.fs.existsSync(t);
      const i = !e && this.fs.existsSync(s);
      // 如果数据文件不存在，则返回空对象
      if (!e && !i) return {};
      const c = e ? t : s; // 使用存在的文件路径
      return new Promise((resolve, reject) => {
        this.fs.readFile(c, "utf8", (r, o) => {
          if (r) reject({});
          else o = this.isJSONString(o) ? JSON.parse(o) : o; resolve(o);
        });
      });
    }
    writedata() {
      if (!this.isNode()) return; // 如果不在Node环境中，则返回空对象
      this.fs = this.fs ? this.fs : require("fs"); // 如果fs未定义，则加载fs模块
      this.path = this.path ? this.path : require("path"); // 如果path未定义，则加载path模块
      // 获取数据文件的绝对路径
      const t = this.path.resolve(this.dataFile), // 获取数据文件的绝对路径
        s = this.path.resolve(process.cwd(), this.dataFile), // 获取备用数据文件的绝对路径
        e = this.fs.existsSync(t), // 检查数据文件是否存在
        i = !e && this.fs.existsSync(s); // 检查备用数据文件是否存在
      //if (!e && !i) return;
      const o = JSON.stringify(this.data); // 将数据转换为JSON字符串
      const pt = e ? t : (i ? s : t);
      return new Promise((resolve, reject) => {
        this.fs.writeFile(pt, o, (r) => {
          if (r) reject(r);
          else resolve();
        });
      });
    }
    getval(t) {
      if (this.isSurge() || this.isLoon()) {
        return $persistentStore.read(t);
      } else if (this.isQuanX()) {
        return $prefs.valueForKey(t);
      } else if (this.isNode()) {
        this.data = this.loaddata();
        return this.data[t];
      } else {
        return (this.data && this.data[t]) || null;
      }
    }
    setval(t, s) {
      if (this.isSurge() || this.isLoon()) {
        return $persistentStore.write(t, s);
      } else if (this.isQuanX()) {
        return $prefs.setValueForKey(t, s);
      } else if (this.isNode()) {
        this.data = this.loaddata();
        this.data[s] = t;
        this.writedata();
        return true;
      } else {
        return (this.data && this.data[s]) || null;
      }
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
      if ($.isNode()) {
        await notify.sendNotify($.name, message);
      } else {
        $.msg($.name, "", message);
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
