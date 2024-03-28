const crypto = require('crypto');

function combineStrings(userAgentString, fixedString = "EBBQADSwAw") {
    let combinedChars = [];
    let maxLength = Math.max(userAgentString.length, fixedString.length);
    for (let index = 0; index < maxLength; index++) {
        if (index < userAgentString.length) {
            combinedChars.push(userAgentString.charAt(index));
        }
        if (index < fixedString.length) {
            combinedChars.push(fixedString.charAt(index));
        }
    }
    let combinedString = combinedChars.join('');
    return combinedString;
}

function getCurrentDateTimeInFormat() {
    const now = new Date();
    let year = now.getFullYear().toString().padStart(4, '0');
    let month = (now.getMonth() + 1).toString().padStart(2, '0');
    let date = now.getDate().toString().padStart(2, '0');
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    return `${year}${month}${date}${hours}${minutes}${seconds}`;
}

function generateShumeiId(userAgentString) {
    let combinedString = combineStrings(userAgentString);
    let time = getCurrentDateTimeInFormat();
    let md5OfCombined = crypto.createHash('md5').update(combinedString).digest('hex');
    let intermediateValue = time + md5OfCombined + '00c0';
    let finalMd5 = crypto.createHash('md5').update(intermediateValue).digest('hex');
    return time + md5OfCombined + '00c0' + finalMd5.substring(10, 22);
}

console.log(generateShumeiId("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 SLBrowser/9.0.3.1311 SLBChan/1031536864"));
console.log(generateShumeiId("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 SLBrowser/9.0.3.1311 SLBChan/1031536864") == "20240328102042dddbc5aededf0928182e63382252d7f800c0cdd20774fad5");
