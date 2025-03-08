const axios = require('axios');
const fs = require('fs');
const CryptoJS = require("crypto-js");
let invite = []
let freeLotteryIds = []
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

            "x-auth-token":
                "Bearer " + authToken,
        },
        data: data,
    };

    let { data: res } = await axios.request(options);
    if (res?.code == 200) {
        if (res?.data?.activityList) {
            for (let item of res?.data?.activityList) {
                if (item?.status == 2) {
                    freeLotteryIds.push(item?.id)
                }
            }
        }
    } else {
        console.log(`上上签抽奖列表查询失败[${res.msg}]`);
    }
}
async function fetchInviteData() {

    let data = JSON.stringify({
        "id": 32000,
        "type": 2
    });

    let config = {
        method: 'POST',
        url: 'https://app.dewu.com/hacking-zero-lottery/v1/activity/show-keyword?sign=94f525c5df9d3f6da2b4ad1cd0b44fef',
        headers: {
            'Content-Type': 'application/json',

            'x-auth-token': 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NDEzOTQ3MjMsImV4cCI6MTc3MjkzMDcyMywiaXNzIjoiODVjOGRlZmUwMTdlYjJlZiIsInN1YiI6Ijg1YzhkZWZlMDE3ZWIyZWYiLCJ1dWlkIjoiODVjOGRlZmUwMTdlYjJlZiIsInVzZXJJZCI6MTYzMDM2Mjk1OCwidXNlck5hbWUiOiLosYHovr7pu5HpuL3lrZBiNUoiLCJpc0d1ZXN0IjpmYWxzZX0.PyZMqsv_tT9z6cJw595cajpSc5t4_7OqNBpnM_tf_yTo_B4F968Eo68gtWriO57X8L9AQ6Ew-72hiLdVqSLvDAX8Fx8Kc9oPm6eIPVa0yW-OxxoSvjxd76death9rwk8n6tNLkXmZfh-KNK8iLFDS5-St-zpF8TORcvJBra5y2DFjEHwDV2jC82Hick89jHjScUhqY-4z3L2-Xqp9sUBRYN11A6cozkvOvpxmromGW5FPIsyEYK7WnD-v6D_U4UntEd9zMer4j2aG8m4T9cXSZi7D7lfYNQW7eaaZNXLrQXA6sK2LfPxazLMBY4IYbOm_gKYQg_5ueMkPauKFIn7mQ',


        },
        data: data
    };

    let { data: res } = await axios.request(config);
    if (res?.code == 200) {
        if (res?.data && res?.data?.keyword) {
            invite.push(res?.data?.keyword)
        }
    }


}

!(async () => {
    await freeLotteryInfo()
    await fetchInviteData()
    fs.writeFileSync('./dwinvite.json', JSON.stringify(invite, null, 2))

})()



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
    const hashedContent = CryptoJS.MD5(
        signContent.concat(secretKey)
    ).toString();
    return hashedContent;
}