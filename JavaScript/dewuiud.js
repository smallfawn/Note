function processString(inputString) {
    var charactersArray = inputString.split(""),
        lastCharacterIndex = charactersArray[charactersArray.length - 1].charCodeAt(0) % 31;

    charactersArray.splice(lastCharacterIndex, 1, '5'); // 将数组中索引为lastCharacterIndex的字符替换为数字5的字符串形式

    return charactersArray.join(""); // 将处理后的字符数组连接成字符串
}
function randomStr(length, charset) {
    var tmp1,
        tmp2,
        data =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
                ""
            ),
        result = [];

    if (((charset = charset || data["length"]), length))
        for (tmp1 = 0; tmp1 < length; tmp1++)
            result[tmp1] = data[0 | (Math.random() * charset)];
    else
        for (
            result[8] = result[13] = result[18] = result[23] = "-",
            result[14] = "4",
            tmp1 = 0;
            tmp1 < 36;
            tmp1++
        )
            result[tmp1] ||
                ((tmp2 =
                    0 |
                    (
                        16 *
                        Math["random"]()
                    )),
                    (result[tmp1] =
                        data[
                        19 === tmp1 ? (3 & tmp2) | 8 : tmp2
                        ]));
    return result["join"]("");
}

console.log((processString(randomStr(32))));
