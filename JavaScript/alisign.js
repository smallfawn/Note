/**
 * 阿里系 H5 全站 Sign 
 * @param {String} e o.token + "&" + a + "&" + s + "&" + n.data  _m_h5_tk & 时间戳 & appkey & 请求表单
 * @returns 
 */

function ali_H5_sign(e) {
    function t(e, t) {
        return e << t | e >>> 32 - t
    }
    function n(e, t) {
        var n, r, o, i, a;
        return o = 2147483648 & e,
            i = 2147483648 & t,
            a = (1073741823 & e) + (1073741823 & t),
            (n = 1073741824 & e) & (r = 1073741824 & t) ? 2147483648 ^ a ^ o ^ i : n | r ? 1073741824 & a ? 3221225472 ^ a ^ o ^ i : 1073741824 ^ a ^ o ^ i : a ^ o ^ i
    }
    function r(e, t, n) {
        return e & t | ~e & n
    }
    function o(e, t, n) {
        return e & n | t & ~n
    }
    function i(e, t, n) {
        return e ^ t ^ n
    }
    function a(e, t, n) {
        return t ^ (e | ~n)
    }
    function s(e, o, i, a, s, u, l) {
        return e = n(e, n(n(r(o, i, a), s), l)),
            n(t(e, u), o)
    }
    function u(e, r, i, a, s, u, l) {
        return e = n(e, n(n(o(r, i, a), s), l)),
            n(t(e, u), r)
    }
    function l(e, r, o, a, s, u, l) {
        return e = n(e, n(n(i(r, o, a), s), l)),
            n(t(e, u), r)
    }
    function c(e, r, o, i, s, u, l) {
        return e = n(e, n(n(a(r, o, i), s), l)),
            n(t(e, u), r)
    }
    function f(e) {
        for (var t, n = e.length, r = n + 8, o, i = 16 * ((r - r % 64) / 64 + 1), a = new Array(i - 1), s = 0, u = 0; n > u;)
            s = u % 4 * 8,
                a[t = (u - u % 4) / 4] = a[t] | e.charCodeAt(u) << s,
                u++;
        return s = u % 4 * 8,
            a[t = (u - u % 4) / 4] = a[t] | 128 << s,
            a[i - 2] = n << 3,
            a[i - 1] = n >>> 29,
            a
    }
    function d(e) {
        var t, n, r = "", o = "";
        for (n = 0; 3 >= n; n++)
            r += (o = "0" + (t = e >>> 8 * n & 255).toString(16)).substr(o.length - 2, 2);
        return r
    }
    function p(e) {
        e = e.replace(/\r\n/g, "\n");
        for (var t = "", n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            128 > r ? t += String.fromCharCode(r) : r > 127 && 2048 > r ? (t += String.fromCharCode(r >> 6 | 192),
                t += String.fromCharCode(63 & r | 128)) : (t += String.fromCharCode(r >> 12 | 224),
                    t += String.fromCharCode(r >> 6 & 63 | 128),
                    t += String.fromCharCode(63 & r | 128))
        }
        return t
    }
    var h, m, y, v, g, A, b, _, w, M = [], S = 7, x = 12, k = 17, L = 22, E = 5, C = 9, T = 14, O = 20, Y = 4, j = 11, D = 16, P = 23, I = 6, B = 10, N = 15, R = 21, F;
    for (M = f(e = p(e)),
        A = 1732584193,
        b = 4023233417,
        _ = 2562383102,
        w = 271733878,
        h = 0; h < M.length; h += 16)
        m = A,
            y = b,
            v = _,
            g = w,
            A = s(A, b, _, w, M[h + 0], 7, 3614090360),
            w = s(w, A, b, _, M[h + 1], x, 3905402710),
            _ = s(_, w, A, b, M[h + 2], k, 606105819),
            b = s(b, _, w, A, M[h + 3], L, 3250441966),
            A = s(A, b, _, w, M[h + 4], 7, 4118548399),
            w = s(w, A, b, _, M[h + 5], x, 1200080426),
            _ = s(_, w, A, b, M[h + 6], k, 2821735955),
            b = s(b, _, w, A, M[h + 7], L, 4249261313),
            A = s(A, b, _, w, M[h + 8], 7, 1770035416),
            w = s(w, A, b, _, M[h + 9], x, 2336552879),
            _ = s(_, w, A, b, M[h + 10], k, 4294925233),
            b = s(b, _, w, A, M[h + 11], L, 2304563134),
            A = s(A, b, _, w, M[h + 12], 7, 1804603682),
            w = s(w, A, b, _, M[h + 13], x, 4254626195),
            _ = s(_, w, A, b, M[h + 14], k, 2792965006),
            A = u(A, b = s(b, _, w, A, M[h + 15], L, 1236535329), _, w, M[h + 1], 5, 4129170786),
            w = u(w, A, b, _, M[h + 6], 9, 3225465664),
            _ = u(_, w, A, b, M[h + 11], T, 643717713),
            b = u(b, _, w, A, M[h + 0], O, 3921069994),
            A = u(A, b, _, w, M[h + 5], 5, 3593408605),
            w = u(w, A, b, _, M[h + 10], 9, 38016083),
            _ = u(_, w, A, b, M[h + 15], T, 3634488961),
            b = u(b, _, w, A, M[h + 4], O, 3889429448),
            A = u(A, b, _, w, M[h + 9], 5, 568446438),
            w = u(w, A, b, _, M[h + 14], 9, 3275163606),
            _ = u(_, w, A, b, M[h + 3], T, 4107603335),
            b = u(b, _, w, A, M[h + 8], O, 1163531501),
            A = u(A, b, _, w, M[h + 13], 5, 2850285829),
            w = u(w, A, b, _, M[h + 2], 9, 4243563512),
            _ = u(_, w, A, b, M[h + 7], T, 1735328473),
            A = l(A, b = u(b, _, w, A, M[h + 12], O, 2368359562), _, w, M[h + 5], 4, 4294588738),
            w = l(w, A, b, _, M[h + 8], j, 2272392833),
            _ = l(_, w, A, b, M[h + 11], D, 1839030562),
            b = l(b, _, w, A, M[h + 14], P, 4259657740),
            A = l(A, b, _, w, M[h + 1], 4, 2763975236),
            w = l(w, A, b, _, M[h + 4], j, 1272893353),
            _ = l(_, w, A, b, M[h + 7], D, 4139469664),
            b = l(b, _, w, A, M[h + 10], P, 3200236656),
            A = l(A, b, _, w, M[h + 13], 4, 681279174),
            w = l(w, A, b, _, M[h + 0], j, 3936430074),
            _ = l(_, w, A, b, M[h + 3], D, 3572445317),
            b = l(b, _, w, A, M[h + 6], P, 76029189),
            A = l(A, b, _, w, M[h + 9], 4, 3654602809),
            w = l(w, A, b, _, M[h + 12], j, 3873151461),
            _ = l(_, w, A, b, M[h + 15], D, 530742520),
            A = c(A, b = l(b, _, w, A, M[h + 2], P, 3299628645), _, w, M[h + 0], 6, 4096336452),
            w = c(w, A, b, _, M[h + 7], B, 1126891415),
            _ = c(_, w, A, b, M[h + 14], N, 2878612391),
            b = c(b, _, w, A, M[h + 5], R, 4237533241),
            A = c(A, b, _, w, M[h + 12], 6, 1700485571),
            w = c(w, A, b, _, M[h + 3], B, 2399980690),
            _ = c(_, w, A, b, M[h + 10], N, 4293915773),
            b = c(b, _, w, A, M[h + 1], R, 2240044497),
            A = c(A, b, _, w, M[h + 8], 6, 1873313359),
            w = c(w, A, b, _, M[h + 15], B, 4264355552),
            _ = c(_, w, A, b, M[h + 6], N, 2734768916),
            b = c(b, _, w, A, M[h + 13], R, 1309151649),
            A = c(A, b, _, w, M[h + 4], 6, 4149444226),
            w = c(w, A, b, _, M[h + 11], B, 3174756917),
            _ = c(_, w, A, b, M[h + 2], N, 718787259),
            b = c(b, _, w, A, M[h + 9], R, 3951481745),
            A = n(A, m),
            b = n(b, y),
            _ = n(_, v),
            w = n(w, g);
    return (d(A) + d(b) + d(_) + d(w)).toLowerCase()
}

module.exports = ali_H5_sign()
