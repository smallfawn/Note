let resp = HTTP.fetch("https://fastly.jsdelivr.net/gh/smallfawn/Note@main/Notice.json", {
  method: "GET",
})

//console.log(resp.json())
let q = resp.json()
console.log(q)
let w = JSON.stringify(q)
console.log(w)
let body = {
  token: "",
  title: "来自airScript的消息通知",
  content: w,
  topic: "",
};
console.log(body)
const r = HTTP.fetch("https://www.pushplus.plus/send", {
  method: 'POST',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': ' application/json',
  },
})
