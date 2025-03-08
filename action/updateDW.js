const axios = require("axios");
const fs = require("fs");
const CryptoJS = require("crypto-js");
let invite = [];
let freeLotteryIds = [];
let upupLotteryIds = [];
let fishLotteryIds = [];
const authToken = process.env.dewuCookie;
async function freeLotteryInfo() {
    let data = {
        inner: true,
        source: "youxizx",
    };

    let options = {
        method: "POST",
        url:
            "https://app.dewu.com/api/v1/h5/oss-platform/hacking-zero-lottery/v1/activity/query-today?sign=" +
            calculateSign(data),
        headers: {
            "Content-Type": "application/json",

            "x-auth-token": "Bearer " + authToken,
        },
        data: data,
    };

    let { data: res } = await axios.request(options);
    if (res?.code == 200) {
        if (res?.data?.activityList) {
            for (let item of res?.data?.activityList) {
                if (item?.status == 2) {
                    freeLotteryIds.push(item?.id);
                }
            }
        }
    } else {
        console.log(`上上签抽奖列表查询失败[${res.msg}]`);
    }
}
async function freeLotteryGetShareCode(id) {
    let data = {
        id: id,
        type: 2,
    };

    let config = {
        method: "POST",
        url:
            "https://app.dewu.com/hacking-zero-lottery/v1/activity/show-keyword?sign=" +
            calculateSign(data),
        headers: {
            "Content-Type": "application/json",

            "x-auth-token": "Bearer " + authToken,
        },
        data: data,
    };

    let { data: res } = await axios.request(config);
    if (res?.code == 200) {
        if (res?.data && res?.data?.keyword) {
            invite.push(res?.data?.keyword);
        }
    }
}
async function upupLotteryInfo() {
    let data = {
        student: false,
        source: "wanyiwan",
    };

    let options = {
        method: "POST",
        url:
            "https://app.dewu.com/hacking-groupon/v1/dsell/query/ongoing-list?sign=" +
            calculateSign(data),
        headers: {
            "Content-Type": "application/json",

            "x-auth-token": "Bearer " + authToken,
        },
        data: data,
    };
    let { data: res } = await axios.request(options);
    if (res?.code == 200) {
        if (res?.data?.records) {
            for (let item of res?.data?.records) {
                if (item["ownedCodeNum"] != 0) {
                    upupLotteryIds.push(item["id"]);

                }
            }
        }
    } else {
        console.log(` 上上签列表查询失败[${res.msg}]`);
    }
}
async function upupLotteryGetShareCode(id) {
    let data = {
        id: id,
    };

    let config = {
        method: "POST",
        url: "https://app.dewu.com/hacking-groupon/v1/dsell/station/keyword?sign=" + calculateSign(data),
        headers: {
            "Content-Type": "application/json",

            "x-auth-token": "Bearer " + authToken,
        },
        data: data,
    };
    let { data: res } = await axios.request(config);
    if (res?.code == 200) {
        if (res?.data && res?.data?.keyword) {
            invite.push(res?.data?.keyword);
        }
    }
}
async function fishLotteryInfo() {
    let data = {
        "inner": true
    }

    let options = {
        method: 'POST',
        url: 'https://app.dewu.com/hacking-lucky/v1/activity/query-today?sign=' + calculateSign(data),
        headers: {

            'Content-Type': 'application/json',

            'x-auth-token': 'Bearer ' + authToken,

        },
        data: data
    };

    let { data: res } = await axios.request(options);
    if (res?.code == 200) {
        if (res?.data?.activityList) {
            for (let item of res?.data?.activityList) {
                if (item["status"] == 2) {

                    fishLotteryIds.push(item["id"]);
                }
            }
        }
    } else {
        console.log(`海洋夺宝列表查询失败[${res.msg}]`);
    }
}
async function fishLotteryGetShareCode(id) {

    let data = {
        "id": id,
        "type": 2
    }

    let config = {
        method: 'POST',
        url: 'https://app.dewu.com/hacking-lucky/v1/activity/show-keyword?sign=' + calculateSign(data),
        headers: {
            "Content-Type": "application/json",

            "x-auth-token": "Bearer " + authToken,
        },
        data: data
    };



    let { data: res } = await axios.request(config);
    if (res?.code == 200) {
        if (res?.data && res?.data?.keyword) {
            invite.push(res?.data?.keyword);
        }
    }
}



!(async () => {
    await freeLotteryInfo();
    for (let id of freeLotteryIds) {
        await freeLotteryGetShareCode(id);
    }
    await upupLotteryInfo();
    for (let id of upupLotteryIds) {
        await upupLotteryGetShareCode(id);
    }
    await fishLotteryInfo();
    for (let id of fishLotteryIds) {
        await fishLotteryGetShareCode(id);
    }
    console.log(invite);

    fs.writeFileSync("./dwinvite.json", JSON.stringify(invite, null, 2));
})();

function calculateSign(requestBody) {
    const sortedKeys = Object.keys(requestBody).sort();
    let signContent = sortedKeys.reduce((acc, key) => {
        const value = requestBody[key];
        if (value === null) {
            return acc;
        }
        if (typeof value === "object" && !Array.isArray(value)) {
            return acc.concat(key).concat(JSON.stringify(value));
        }
        if (Array.isArray(value)) {
            if (value.length > 0) {
                let typeOfFirstItem = typeof value[0];
                if (typeOfFirstItem === "object") {
                    let arrayStr = "";
                    value.forEach((item, index) => {
                        arrayStr +=
                            JSON.stringify(item) + (index !== value.length - 1 ? "," : "");
                    });
                    return acc.concat(key).concat(arrayStr);
                }
            }
            return acc.concat(key).concat(value.toString());
        }
        return acc.concat(key).concat(value.toString());
    }, "");
    const secretKey = "048a9c4943398714b356a696503d2d36";
    const hashedContent = CryptoJS.MD5(signContent.concat(secretKey)).toString();
    return hashedContent;
}
