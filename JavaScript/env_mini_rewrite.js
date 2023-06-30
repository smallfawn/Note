function EnvMini(name, opts) { class Http { constructor(env) { this.env = env } send(opts, method = "GET") { opts = typeof opts === "string" ? { url: opts } : opts; let sender = this.get; if (method === "POST") { sender = this.post } return new Promise((resolve, reject) => { sender.call(this, opts, (err, resp, body) => { if (err) reject(err); else resolve(resp) }) }) } get(opts) { return this.send.call(this.env, opts) } post(opts) { return this.send.call(this.env, opts, "POST") } } return new (class { constructor(name, opts) { this.userList = []; this.userIdx = 0; this.name = name; this.http = new Http(this); this.data = null; this.dataFile = "box.dat"; this.logs = []; this.isMute = false; this.isNeedRewrite = false; this.logSeparator = "\n"; this.encoding = "utf-8"; this.startTime = new Date().getTime(); Object.assign(this, opts); this.log("", `🔔${this.name},开始!`) } getEnv() { if ("undefined" !== typeof $environment && $environment["surge-version"]) return "Surge"; if ("undefined" !== typeof $environment && $environment["stash-version"]) return "Stash"; if ("undefined" !== typeof module && !!module.exports) return "Node.js"; if ("undefined" !== typeof $task) return "Quantumult X"; if ("undefined" !== typeof $loon) return "Loon"; if ("undefined" !== typeof $rocket) return "Shadowrocket" } isNode() { return "Node.js" === this.getEnv() } isQuanX() { return "Quantumult X" === this.getEnv() } isSurge() { return "Surge" === this.getEnv() } isLoon() { return "Loon" === this.getEnv() } isShadowrocket() { return "Shadowrocket" === this.getEnv() } isStash() { return "Stash" === this.getEnv() } toObj(str, defaultValue = null) { try { return JSON.parse(str) } catch { return defaultValue } } toStr(obj, defaultValue = null) { try { return JSON.stringify(obj) } catch { return defaultValue } } getjson(key, defaultValue) { let json = defaultValue; const val = this.getdata(key); if (val) { try { json = JSON.parse(this.getdata(key)) } catch { } } return json } setjson(val, key) { try { return this.setdata(JSON.stringify(val), key) } catch { return false } } getScript(url) { return new Promise((resolve) => { this.get({ url }, (err, resp, body) => resolve(body)) }) } runScript(script, runOpts) { return new Promise((resolve) => { let httpapi = this.getdata("@chavy_boxjs_userCfgs.httpapi"); httpapi = httpapi ? httpapi.replace(/\n/g, "").trim() : httpapi; let httpapi_timeout = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20; httpapi_timeout = runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout; const [key, addr] = httpapi.split("@"); const opts = { url: `http://${addr}/v1/scripting/evaluate`, body: { script_text: script, mock_type: "cron", timeout: httpapi_timeout, }, headers: { "X-Key": key, Accept: "*/*" }, timeout: httpapi_timeout, }; this.post(opts, (err, resp, body) => resolve(body)) }).catch((e) => this.logErr(e)) } loaddata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"); this.path = this.path ? this.path : require("path"); const curDirDataFilePath = this.path.resolve(this.dataFile); const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile); const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath); const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath); if (isCurDirDataFile || isRootDirDataFile) { const datPath = isCurDirDataFile ? curDirDataFilePath : rootDirDataFilePath; try { return JSON.parse(this.fs.readFileSync(datPath)) } catch (e) { return {} } } else return {} } else return {} } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"); this.path = this.path ? this.path : require("path"); const curDirDataFilePath = this.path.resolve(this.dataFile); const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile); const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath); const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath); const jsondata = JSON.stringify(this.data); if (isCurDirDataFile) { this.fs.writeFileSync(curDirDataFilePath, jsondata) } else if (isRootDirDataFile) { this.fs.writeFileSync(rootDirDataFilePath, jsondata) } else { this.fs.writeFileSync(curDirDataFilePath, jsondata) } } } lodash_get(source, path, defaultValue = undefined) { const paths = path.replace(/\[(\d+)\]/g, ".$1").split("."); let result = source; for (const p of paths) { result = Object(result)[p]; if (result === undefined) { return defaultValue } } return result } lodash_set(obj, path, value) { if (Object(obj) !== obj) return obj; if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []; path.slice(0, -1).reduce((a, c, i) => Object(a[c]) === a[c] ? a[c] : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {}), obj)[path[path.length - 1]] = value; return obj } getdata(key) { let val = this.getval(key); if (/^@/.test(key)) { const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key); const objval = objkey ? this.getval(objkey) : ""; if (objval) { try { const objedval = JSON.parse(objval); val = objedval ? this.lodash_get(objedval, paths, "") : val } catch (e) { val = "" } } } return val } setdata(val, key) { let issuc = false; if (/^@/.test(key)) { const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key); const objdat = this.getval(objkey); const objval = objkey ? objdat === "null" ? null : objdat || "{}" : "{}"; try { const objedval = JSON.parse(objval); this.lodash_set(objedval, paths, val); issuc = this.setval(JSON.stringify(objedval), objkey) } catch (e) { const objedval = {}; this.lodash_set(objedval, paths, val); issuc = this.setval(JSON.stringify(objedval), objkey) } } else { issuc = this.setval(val, key) } return issuc } getval(key) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.read(key); case "Quantumult X": return $prefs.valueForKey(key); case "Node.js": this.data = this.loaddata(); return this.data[key]; default: return (this.data && this.data[key]) || null } } setval(val, key) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.write(val, key); case "Quantumult X": return $prefs.setValueForKey(val, key); case "Node.js": this.data = this.loaddata(); this.data[key] = val; this.writedata(); return true; default: return (this.data && this.data[key]) || null } } initGotEnv(opts) { this.got = this.got ? this.got : require("got"); this.cktough = this.cktough ? this.cktough : require("tough-cookie"); this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar(); if (opts) { opts.headers = opts.headers ? opts.headers : {}; if (undefined === opts.headers.Cookie && undefined === opts.cookieJar) { opts.cookieJar = this.ckjar } } } get(request, callback = () => { }) { if (request.headers) { delete request.headers["Content-Type"]; delete request.headers["Content-Length"]; delete request.headers["content-type"]; delete request.headers["content-length"] } switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: if (this.isSurge() && this.isNeedRewrite) { request.headers = request.headers || {}; Object.assign(request.headers, { "X-Surge-Skip-Scripting": false }) } $httpClient.get(request, (err, resp, body) => { if (!err && resp) { resp.body = body; resp.statusCode = resp.status ? resp.status : resp.statusCode; resp.status = resp.statusCode } callback(err, resp, body) }); break; case "Quantumult X": if (this.isNeedRewrite) { request.opts = request.opts || {}; Object.assign(request.opts, { hints: false }) } $task.fetch(request).then((resp) => { const { statusCode: status, statusCode, headers, body, bodyBytes, } = resp; callback(null, { status, statusCode, headers, body, bodyBytes }, body, bodyBytes) }, (err) => callback((err && err.error) || "UndefinedError")); break; case "Node.js": let iconv = require("iconv-lite"); this.initGotEnv(request); this.got(request).on("redirect", (resp, nextOpts) => { try { if (resp.headers["set-cookie"]) { const ck = resp.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); if (ck) { this.ckjar.setCookieSync(ck, null) } nextOpts.cookieJar = this.ckjar } } catch (e) { this.logErr(e) } }).then((resp) => { const { statusCode: status, statusCode, headers, rawBody, } = resp; const body = iconv.decode(rawBody, this.encoding); callback(null, { status, statusCode, headers, rawBody, body }, body) }, (err) => { const { message: error, response: resp } = err; callback(error, resp, resp && iconv.decode(resp.rawBody, this.encoding)) }); break } } post(request, callback = () => { }) { const method = request.method ? request.method.toLocaleLowerCase() : "post"; if (request.body && request.headers && !request.headers["Content-Type"] && !request.headers["content-type"]) { request.headers["content-type"] = "application/x-www-form-urlencoded" } if (request.headers) { delete request.headers["Content-Length"]; delete request.headers["content-length"] } switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: if (this.isSurge() && this.isNeedRewrite) { request.headers = request.headers || {}; Object.assign(request.headers, { "X-Surge-Skip-Scripting": false }) } $httpClient[method](request, (err, resp, body) => { if (!err && resp) { resp.body = body; resp.statusCode = resp.status ? resp.status : resp.statusCode; resp.status = resp.statusCode } callback(err, resp, body) }); break; case "Quantumult X": request.method = method; if (this.isNeedRewrite) { request.opts = request.opts || {}; Object.assign(request.opts, { hints: false }) } $task.fetch(request).then((resp) => { const { statusCode: status, statusCode, headers, body, bodyBytes, } = resp; callback(null, { status, statusCode, headers, body, bodyBytes }, body, bodyBytes) }, (err) => callback((err && err.error) || "UndefinedError")); break; case "Node.js": let iconv = require("iconv-lite"); this.initGotEnv(request); const { url, ..._request } = request; this.got[method](url, _request).then((resp) => { const { statusCode: status, statusCode, headers, rawBody } = resp; const body = iconv.decode(rawBody, this.encoding); callback(null, { status, statusCode, headers, rawBody, body }, body) }, (err) => { const { message: error, response: resp } = err; callback(error, resp, resp && iconv.decode(resp.rawBody, this.encoding)) }); break } } time(fmt, ts = null) { const date = ts ? new Date(ts) : new Date(); let o = { "M+": date.getMonth() + 1, "d+": date.getDate(), "H+": date.getHours(), "m+": date.getMinutes(), "s+": date.getSeconds(), "q+": Math.floor((date.getMonth() + 3) / 3), S: date.getMilliseconds(), }; if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length)); for (let k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)); return fmt } queryStr(options) { let queryString = ""; for (const key in options) { let value = options[key]; if (value != null && value !== "") { if (typeof value === "object") { value = JSON.stringify(value) } queryString += `${key}=${value}&` } } queryString = queryString.substring(0, queryString.length - 1); return queryString } msg(title = name, subt = "", desc = "", opts) { const toEnvOpts = (rawopts) => { switch (typeof rawopts) { case undefined: return rawopts; case "string": switch (this.getEnv()) { case "Surge": case "Stash": default: return { url: rawopts }; case "Loon": case "Shadowrocket": return rawopts; case "Quantumult X": return { "open-url": rawopts }; case "Node.js": return undefined }case "object": switch (this.getEnv()) { case "Surge": case "Stash": case "Shadowrocket": default: { let openUrl = rawopts.url || rawopts.openUrl || rawopts["open-url"]; return { url: openUrl } } case "Loon": { let openUrl = rawopts.openUrl || rawopts.url || rawopts["open-url"]; let mediaUrl = rawopts.mediaUrl || rawopts["media-url"]; return { openUrl, mediaUrl } } case "Quantumult X": { let openUrl = rawopts["open-url"] || rawopts.url || rawopts.openUrl; let mediaUrl = rawopts["media-url"] || rawopts.mediaUrl; let updatePasteboard = rawopts["update-pasteboard"] || rawopts.updatePasteboard; return { "open-url": openUrl, "media-url": mediaUrl, "update-pasteboard": updatePasteboard, } } case "Node.js": return undefined }default: return undefined } }; if (!this.isMute) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: $notification.post(title, subt, desc, toEnvOpts(opts)); break; case "Quantumult X": $notify(title, subt, desc, toEnvOpts(opts)); break; case "Node.js": break } } if (!this.isMuteLog) { let logs = ["", "==============📣系统通知📣=============="]; logs.push(title); subt ? logs.push(subt) : ""; desc ? logs.push(desc) : ""; console.log(logs.join("\n")); this.logs = this.logs.concat(logs) } } log(...logs) { if (logs.length > 0) { this.logs = [...this.logs, ...logs] } console.log(logs.join(this.logSeparator)) } logErr(err, msg) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: this.log("", `❗️${this.name},错误!`, err); break; case "Node.js": this.log("", `❗️${this.name},错误!`, err.stack); break } } wait(time) { return new Promise((resolve) => setTimeout(resolve, time)) } DoubleLog(data) { if ($.isNode()) { if (data) { console.log(`${data}`); msg += `\n ${data}` } } else { console.log(`${data}`); msg += `\n ${data}` } } async SendMsg(message) { if (!message) return; if (Notify > 0) { if ($.isNode()) { var notify = require("./sendNotify"); await notify.sendNotify($.name, message) } else { $.msg($.name, "", message) } } else { console.log(message) } } done(val = {}) { const endTime = new Date().getTime(); const costTime = (endTime - this.startTime) / 1000; this.log("", `🔔${this.name},结束!🕛${costTime}秒`); this.log(); switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: $done(val); break; case "Node.js": process.exit(1); break } } })(name, opts) }
function Env(t, e) {
    class s {
        constructor(t) {
            this.env = t
        }
        send(t, e = "GET") {
            t = "string" == typeof t ? {
                url: t
            } : t;
            let s = this.get;
            return ("POST" === e && (s = this.post), new Promise((e, a) => {
                s.call(this, t, (t, s, r) => {
                    t ? a(t) : e(s)
                })
            }))
        }
        get(t) {
            return this.send.call(this.env, t)
        }
        post(t) {
            return this.send.call(this.env, t, "POST")
        }
    }
    return new(class {
        constructor(t, e) {
            this.userList = [];
            this.userIdx = 0;
            (this.name = t), (this.http = new s(this)), (this.data = null), (this.dataFile = "box.dat"), (this.logs = []), (this.isMute = !1), (this.isNeedRewrite = !1), (this.logSeparator = "\n"), (this.encoding = "utf-8"), (this.startTime = new Date().getTime()), Object.assign(this, e), this.log("", `🔔${this.name},开始!`)
        }
        getEnv() {
            return "undefined" != typeof $environment && $environment["surge-version"] ? "Surge" : "undefined" != typeof $environment && $environment["stash-version"] ? "Stash" : "undefined" != typeof module && module.exports ? "Node.js" : "undefined" != typeof $task ? "Quantumult X" : "undefined" != typeof $loon ? "Loon" : "undefined" != typeof $rocket ? "Shadowrocket" : void 0
        }
        isNode() {
            return "Node.js" === this.getEnv()
        }
        isQuanX() {
            return "Quantumult X" === this.getEnv()
        }
        isSurge() {
            return "Surge" === this.getEnv()
        }
        isLoon() {
            return "Loon" === this.getEnv()
        }
        isShadowrocket() {
            return "Shadowrocket" === this.getEnv()
        }
        isStash() {
            return "Stash" === this.getEnv()
        }
        toObj(t, e = null) {
            try {
                return JSON.parse(t)
            } catch {
                return e
            }
        }
        toStr(t, e = null) {
            try {
                return JSON.stringify(t)
            } catch {
                return e
            }
        }
        getjson(t, e) {
            let s = e;
            const a = this.getdata(t);
            if (a) try {
                s = JSON.parse(this.getdata(t))
            } catch {}
            return s
        }
        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e)
            } catch {
                return !1
            }
        }
        getScript(t) {
            return new Promise((e) => {
                this.get({
                    url: t
                }, (t, s, a) => e(a))
            })
        }
        runScript(t, e) {
            return new Promise((s) => {
                let a = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                a = a ? a.replace(/\n/g, "").trim() : a;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                (r = r ? 1 * r : 20), (r = e && e.timeout ? e.timeout : r);
                const [i, o] = a.split("@"), n = {
                    url: `http://${o}/v1/scripting/evaluate`,
                    body: {
                        script_text: t,
                        mock_type: "cron",
                        timeout: r
                    },
                    headers: {
                        "X-Key": i,
                        Accept: "*/*"
                    },
                    timeout: r,
                };
                this.post(n, (t, e, a) => s(a))
            }).catch((t) => this.logErr(t))
        }
        loaddata() {
            if (!this.isNode()) return {}; {
                (this.fs = this.fs ? this.fs : require("fs")), (this.path = this.path ? this.path : require("path"));
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    a = !s && this.fs.existsSync(e);
                if (!s && !a) return {}; {
                    const a = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(a))
                    } catch (t) {
                        return {}
                    }
                }
            }
        }
        writedata() {
            if (this.isNode()) {
                (this.fs = this.fs ? this.fs : require("fs")), (this.path = this.path ? this.path : require("path"));
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    a = !s && this.fs.existsSync(e),
                    r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : a ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }
        lodash_get(t, e, s) {
            const a = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of a)
                if (((r = Object(r)[t]), void 0 === r)) return s;
            return r
        }
        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), (e.slice(0, -1).reduce((t, s, a) => Object(t[s]) === t[s] ? t[s] : (t[s] = Math.abs(e[a + 1]) >> 0 == +e[a + 1] ? [] : {}), t)[e[e.length - 1]] = s), t)
        }
        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, a] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                if (r) try {
                    const t = JSON.parse(r);
                    e = t ? this.lodash_get(t, a, "") : e
                } catch (t) {
                    e = ""
                }
            }
            return e
        }
        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, a, r] = /^@(.*?)\.(.*?)$/.exec(e), i = this.getval(a), o = a ? ("null" === i ? null : i || "{}") : "{}";
                try {
                    const e = JSON.parse(o);
                    this.lodash_set(e, r, t), (s = this.setval(JSON.stringify(e), a))
                } catch (e) {
                    const i = {};
                    this.lodash_set(i, r, t), (s = this.setval(JSON.stringify(i), a))
                }
            } else s = this.setval(t, e);
            return s
        }
        getval(t) {
            switch (this.getEnv()) {
                case "Surge":
                case "Loon":
                case "Stash":
                case "Shadowrocket":
                    return $persistentStore.read(t);
                case "Quantumult X":
                    return $prefs.valueForKey(t);
                case "Node.js":
                    return (this.data = this.loaddata()), this.data[t];
                default:
                    return (this.data && this.data[t]) || null
            }
        }
        setval(t, e) {
            switch (this.getEnv()) {
                case "Surge":
                case "Loon":
                case "Stash":
                case "Shadowrocket":
                    return $persistentStore.write(t, e);
                case "Quantumult X":
                    return $prefs.setValueForKey(t, e);
                case "Node.js":
                    return ((this.data = this.loaddata()), (this.data[e] = t), this.writedata(), !0);
                default:
                    return (this.data && this.data[e]) || null
            }
        }
        initGotEnv(t) {
            (this.got = this.got ? this.got : require("got")), (this.cktough = this.cktough ? this.cktough : require("tough-cookie")), (this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()), t && ((t.headers = t.headers ? t.headers : {}), void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
        }
        get(t, e = () => {}) {
            switch ((t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"], delete t.headers["content-type"], delete t.headers["content-length"]), this.getEnv())) {
                case "Surge":
                case "Loon":
                case "Stash":
                case "Shadowrocket":
                default:
                    this.isSurge() && this.isNeedRewrite && ((t.headers = t.headers || {}), Object.assign(t.headers, {
                        "X-Surge-Skip-Scripting": !1
                    })), $httpClient.get(t, (t, s, a) => {
                        !t && s && ((s.body = a), (s.statusCode = s.status ? s.status : s.statusCode), (s.status = s.statusCode)), e(t, s, a)
                    });
                    break;
                case "Quantumult X":
                    this.isNeedRewrite && ((t.opts = t.opts || {}), Object.assign(t.opts, {
                        hints: !1
                    })), $task.fetch(t).then((t) => {
                        const {
                            statusCode: s,
                            statusCode: a,
                            headers: r,
                            body: i,
                            bodyBytes: o,
                        } = t;
                        e(null, {
                            status: s,
                            statusCode: a,
                            headers: r,
                            body: i,
                            bodyBytes: o,
                        }, i, o)
                    }, (t) => e((t && t.error) || "UndefinedError"));
                    break;
                case "Node.js":
                    let s = require("iconv-lite");
                    this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                        try {
                            if (t.headers["set-cookie"]) {
                                const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                                s && this.ckjar.setCookieSync(s, null), (e.cookieJar = this.ckjar)
                            }
                        } catch (t) {
                            this.logErr(t)
                        }
                    }).then((t) => {
                        const {
                            statusCode: a,
                            statusCode: r,
                            headers: i,
                            rawBody: o,
                        } = t, n = s.decode(o, this.encoding);
                        e(null, {
                            status: a,
                            statusCode: r,
                            headers: i,
                            rawBody: o,
                            body: n,
                        }, n)
                    }, (t) => {
                        const {
                            message: a,
                            response: r
                        } = t;
                        e(a, r, r && s.decode(r.rawBody, this.encoding))
                    })
            }
        }
        post(t, e = () => {}) {
            const s = t.method ? t.method.toLocaleLowerCase() : "post";
            switch ((t.body && t.headers && !t.headers["Content-Type"] && !t.headers["content-type"] && (t.headers["content-type"] = "application/x-www-form-urlencoded"), t.headers && (delete t.headers["Content-Length"], delete t.headers["content-length"]), this.getEnv())) {
                case "Surge":
                case "Loon":
                case "Stash":
                case "Shadowrocket":
                default:
                    this.isSurge() && this.isNeedRewrite && ((t.headers = t.headers || {}), Object.assign(t.headers, {
                        "X-Surge-Skip-Scripting": !1
                    })), $httpClient[s](t, (t, s, a) => {
                        !t && s && ((s.body = a), (s.statusCode = s.status ? s.status : s.statusCode), (s.status = s.statusCode)), e(t, s, a)
                    });
                    break;
                case "Quantumult X":
                    (t.method = s), this.isNeedRewrite && ((t.opts = t.opts || {}), Object.assign(t.opts, {
                        hints: !1
                    })), $task.fetch(t).then((t) => {
                        const {
                            statusCode: s,
                            statusCode: a,
                            headers: r,
                            body: i,
                            bodyBytes: o,
                        } = t;
                        e(null, {
                            status: s,
                            statusCode: a,
                            headers: r,
                            body: i,
                            bodyBytes: o,
                        }, i, o)
                    }, (t) => e((t && t.error) || "UndefinedError"));
                    break;
                case "Node.js":
                    let a = require("iconv-lite");
                    this.initGotEnv(t);
                    const {
                        url: r,
                        ...i
                    } = t;
                    this.got[s](r, i).then((t) => {
                        const {
                            statusCode: s,
                            statusCode: r,
                            headers: i,
                            rawBody: o,
                        } = t, n = a.decode(o, this.encoding);
                        e(null, {
                            status: s,
                            statusCode: r,
                            headers: i,
                            rawBody: o,
                            body: n
                        }, n)
                    }, (t) => {
                        const {
                            message: s,
                            response: r
                        } = t;
                        e(s, r, r && a.decode(r.rawBody, this.encoding))
                    })
            }
        }
        time(t, e = null) {
            const s = e ? new Date(e) : new Date();
            let a = {
                "M+": s.getMonth() + 1,
                "d+": s.getDate(),
                "H+": s.getHours(),
                "m+": s.getMinutes(),
                "s+": s.getSeconds(),
                "q+": Math.floor((s.getMonth() + 3) / 3),
                S: s.getMilliseconds(),
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let e in a) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? a[e] : ("00" + a[e]).substr(("" + a[e]).length)));
            return t
        }
        queryStr(t) {
            let e = "";
            for (const s in t) {
                let a = t[s];
                null != a && "" !== a && ("object" == typeof a && (a = JSON.stringify(a)), (e += `${s}=${a}&`))
            }
            return (e = e.substring(0, e.length - 1)), e
        }
        msg(e = t, s = "", a = "", r) {
            const i = (t) => {
                switch (typeof t) {
                    case void 0:
                        return t;
                    case "string":
                        switch (this.getEnv()) {
                            case "Surge":
                            case "Stash":
                            default:
                                return {
                                    url: t
                                };
                            case "Loon":
                            case "Shadowrocket":
                                return t;
                            case "Quantumult X":
                                return {
                                    "open-url": t
                                };
                            case "Node.js":
                                return
                        }
                    case "object":
                        switch (this.getEnv()) {
                            case "Surge":
                            case "Stash":
                            case "Shadowrocket":
                            default:
                                {
                                    let e = t.url || t.openUrl || t["open-url"];
                                    return {
                                        url: e
                                    }
                                }
                            case "Loon":
                                {
                                    let e = t.openUrl || t.url || t["open-url"],
                                        s = t.mediaUrl || t["media-url"];
                                    return {
                                        openUrl: e,
                                        mediaUrl: s
                                    }
                                }
                            case "Quantumult X":
                                {
                                    let e = t["open-url"] || t.url || t.openUrl,
                                        s = t["media-url"] || t.mediaUrl,
                                        a = t["update-pasteboard"] || t.updatePasteboard;
                                    return {
                                        "open-url": e,
                                        "media-url": s,
                                        "update-pasteboard": a,
                                    }
                                }
                            case "Node.js":
                                return
                        }
                    default:
                        return
                }
            };
            if (!this.isMute) switch (this.getEnv()) {
                case "Surge":
                case "Loon":
                case "Stash":
                case "Shadowrocket":
                default:
                    $notification.post(e, s, a, i(r));
                    break;
                case "Quantumult X":
                    $notify(e, s, a, i(r));
                    break;
                case "Node.js":
            }
            if (!this.isMuteLog) {
                let t = ["", "==============📣系统通知📣==============", ];
                t.push(e), s && t.push(s), a && t.push(a), console.log(t.join("\n")), (this.logs = this.logs.concat(t))
            }
        }
        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }
        logErr(t, e) {
            switch (this.getEnv()) {
                case "Surge":
                case "Loon":
                case "Stash":
                case "Shadowrocket":
                case "Quantumult X":
                default:
                    this.log("", `❗️${this.name},错误!`, t);
                    break;
                case "Node.js":
                    this.log("", `❗️${this.name},错误!`, t.stack)
            }
        }
        wait(t) {
            return new Promise((e) => setTimeout(e, t))
        }
        DoubleLog(data) {
            if ($.isNode()) {
                if (data) {
                    console.log(`${data}`);
                    msg += `\n ${data}`
                }
            } else {
                console.log(`${data}`);
                msg += `\n ${data}`
            }
        }
        async SendMsg(message) {
            if (!message) return;
            if (Notify > 0) {
                if ($.isNode()) {
                    var notify = require("./sendNotify");
                    await notify.sendNotify($.name, message)
                } else {
                    $.msg($.name, "", message);
                    console.log($.name, "", message)
                }
            } else {
                console.log(message)
            }
        }
        done(t = {}) {
            const e = new Date().getTime(),
                s = (e - this.startTime) / 1e3;
            switch ((this.log("", `🔔${this.name},结束!🕛 ${s}秒`), this.log(), this.getEnv())) {
                case "Surge":
                case "Loon":
                case "Stash":
                case "Shadowrocket":
                case "Quantumult X":
                default:
                    $done(t);
                    break;
                case "Node.js":
                    process.exit(1)
            }
        }
    })(t, e)
}
