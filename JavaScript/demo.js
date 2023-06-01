/**
 * 演示模板
 * cron 10 7 * * *  demoV5.js
 * 23/01/22 利用$.函数 &and
 * ========= 青龙--配置文件 ===========
 * # 项目名称
 * export demo_data='token @ token'
 * 
 * 多账号用 换行 或 @ 分割
 * 抓包 xxx.xxx.xxx , 找到 token 即可
 * ====================================
 *   
 */



const $ = new Env("test测试模板");
const ckName = "test";
//-------------------- 一般不动变量区域 -------------------------------------
const { log } = require('console')
const Notify = 1;         //0为关闭通知,1为打开通知,默认为1
const notify = $.isNode() ? require('./sendNotify') : '';
let envSplitor = ["@", "\n"]; //多账号分隔符
let msg = '';
let userCookie = ($.isNode() ? process.env[ckName] : $.getdata(ckName)) || '';
let userList = [];
let userIdx = 0;
let userCount = 0;
let scriptVersionLatest; //最新版本
let scriptVersionNow = '0.0.1'; //现在版本
//---------------------- 自定义变量区域 -----------------------------------
//---------------------------------------------------------

async function start() {
    await getVersion('smallfawn/Note@main/JavaScript/test.js')
    log(`\n============ 当前版本：${scriptVersionNow}  最新版本：${scriptVersionLatest} ============`)
    await notice()
    console.log('\n================== 用户信息 ==================\n');
    taskall = [];
    for (let user of userList) {
        if (user.ckStatus) {
            taskall.push(await user.user_info());
            await $.wait(1000); //延迟  1秒  可充分利用 $.环境函数
        }
    }
    await Promise.all(taskall);



}
