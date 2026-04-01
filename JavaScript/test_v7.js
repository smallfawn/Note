/*
------------------------------------------
@Author: sm
@Date: 2024.06.07 19:15
@Description: 海底捞
cron: 12 12 * * *
------------------------------------------
#Notice:   
如果微信小程序抓包的写变量名hdlwx:
https://superapp-public.kiwa-tech.com/api/gateway/login/center/login/wechatLogin 接口的请求参数openId#uid
如果是APP抓包的写变量名hdlapp:
自助获取token接口：


⚠️【免责声明】
------------------------------------------
1、此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2、由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3、请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4、此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5、本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6、如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7、所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。
*/

const { Env } = require("../tools/env")
const $ = new Env("硬声");
let ckName = `yingsheng`;
const strSplitor = "#";
process.env[ckName] = "15666655552#sndjdj"
const axios = require("axios");
const defaultUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.31(0x18001e31) NetType/WIFI Language/zh_CN miniProgram"




class Task {
    constructor(env) {
        this.index = $.userIdx++
        let user = env.split(strSplitor);
        this.name = user[0];
        this.passwd = user[1];
        this.auth = '';
        this.device_id = '07cdc486c91ca0457e4263cfa9667aa7od'
        this.valid = false;

    }


    async login() {
        try {
            let pwd = this.EncryptCrypto(this.passwd)
            console.log(pwd)
            let param = { 'account': this.name, 'password': pwd, 'device_id': this.device_id }
            let url = `https://ysapi.elecfans.com/api/sso/accountLogin`
            let body = $.jsonToStr(param, '&', true)
            let headersParams = this.calculateSign(param, 'ysapi')
            let options = {
                method: 'post',
                url,
                headers: {
                    ...headersParams,
                    "User-Agent": defaultUserAgent,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: body
            }
            let { data: result } = await axios.request(options)
            if (result.code == 0) {
                this.valid = true
                this.name = result.data.mobile
                this.coins = result.data.coins
                this.auth = result.data.Authorization
                this.user_id = result.data.user_id
                console.log(`登录成功`)
                console.log(`手机：${this.name}`)
                console.log(`硬币：${this.coins}`)
            } else {
                console.log(`登录失败: ${JSON.stringify(result)}`)
            }
        } catch (e) {
            console.log(e)
        } finally { }
    }

    async getInfo() {
        try {
            let param = { 'user_id': this.user_id }
            let url = `https://ysapi.elecfans.com/api/member/getInfo?${$.jsonToStr(param, '&')}`
            let headersParams = this.calculateSign(param, 'ysapi')
            let options = {
                method: 'get',
                url,
                headers: {
                    ...headersParams,
                    "User-Agent": defaultUserAgent,
                },
            }
            let { data: result } = await axios.request(options)
            if (result.code == 0) {
                this.coins = result.data.coins
                console.log(`硬币：${this.coins}`)
            } else {
                console.log(`查询账户失败: ${result.message}`)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async getSignStatus() {
        try {
            let param = { 'date': '' }
            let url = `https://yingsheng.elecfans.com/ysapi/wapi/activity/signin/data?${$.jsonToStr(param, '&')}`
            let headersParams = this.calculateSign(param, 'yingsheng')
            let options = {
                method: 'get',
                url,
                headers: {
                    ...headersParams,
                    "User-Agent": defaultUserAgent,
                },
            }
            let { data: result } = await axios.request(options)
            if (result.code == 0) {
                if (result.data.data.today_is_sign == 1) {
                    console.log(`今日已签到`)
                } else {
                    console.log(`今日未签到`)
                    await $.wait(this.TASK_WAIT_TIME);
                    await this.signin();
                }
            } else {
                console.log(`查询签到状态失败: ${result.message}`)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async signin() {
        try {
            let param = { 'date': '' }
            let url = `https://yingsheng.elecfans.com/ysapi/wapi/activity/signin/signin`
            let body = JSON.stringify(param)
            let headersParams = this.calculateSign(param, 'yingsheng')
            let options = {
                method: 'post',
                url,
                headers: {
                    ...headersParams,
                    "User-Agent": defaultUserAgent,
                    "Content-Type": "application/json"
                },
                data: body
            }
            let { data: result } = await axios.request(options)
            if (result.code == 0) {
                console.log(`签到成功，获得${result.data.coins}硬币`)
            } else {
                console.log(`签到失败: ${result.message}`)
            }
        } catch (e) {
            console.log(e)
        }
    }


}

!(async () => {
    await getNotice()
    $.checkEnv(ckName);

    for (let user of $.userList) {
        await new Task(user).run();
    }
})()
    .catch((e) => console.log(e))
    .finally(() => $.done());

async function getNotice() {
    let options = {
        url: `https://ghproxy.net/https://raw.githubusercontent.com/smallfawn/Note/refs/heads/main/Notice.json`,
        headers: {
            "User-Agent": defaultUserAgent,
        }
    }
    let { data: res } = await axios.request(options);
    $.log(res)
    return res
}
