var encode_version = 'sojson.v4';
var __0x1219d = ['Yj5h', 'YT1i', 'ZW5k', 'bG9n', 'YT5i'];
(function(_0x521845, _0x318a50) {
    var _0x4234bd = function(_0x228617) {
        while (--_0x228617) {
            _0x521845['push'](_0x521845['shift']());
        }
    };
    _0x4234bd(++_0x318a50);
}(__0x1219d, 0x184));
var _0x7d5e = function(_0x2d46f2, _0x3fe8ff) {
    _0x2d46f2 = _0x2d46f2 - 0x0;
    var _0x123963 = __0x1219d[_0x2d46f2];
    if (_0x7d5e['initialized'] === undefined) {
        (function() {
            var _0x229c38 = typeof window !== 'undefined' ? window : typeof process === 'object' && typeof require === 'function' && typeof global === 'object' ? global : this;
            var _0x2de71a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            _0x229c38['atob'] || (_0x229c38['atob'] = function(_0x404eb4) {
                var _0x5a6661 = String(_0x404eb4)['replace'](/=+$/, '');
                for (var _0x21f017 = 0x0, _0x38eb01, _0x2d1477, _0x259a1f = 0x0, _0x522987 = ''; _0x2d1477 = _0x5a6661['charAt'](_0x259a1f++); ~_0x2d1477 && (_0x38eb01 = _0x21f017 % 0x4 ? _0x38eb01 * 0x40 + _0x2d1477 : _0x2d1477, _0x21f017++ % 0x4) ? _0x522987 += String['fromCharCode'](0xff & _0x38eb01 >> (-0x2 * _0x21f017 & 0x6)) : 0x0) {
                    _0x2d1477 = _0x2de71a['indexOf'](_0x2d1477);
                }
                return _0x522987;
            });
        }());
        _0x7d5e['base64DecodeUnicode'] = function(_0x5d8e01) {
            var _0x1fa3ba = atob(_0x5d8e01);
            var _0x4dc7de = [];
            for (var _0x4056d3 = 0x0, _0x1bbe0e = _0x1fa3ba['length']; _0x4056d3 < _0x1bbe0e; _0x4056d3++) {
                _0x4dc7de += '%' + ('00' + _0x1fa3ba['charCodeAt'](_0x4056d3)['toString'](0x10))['slice'](-0x2);
            }
            return decodeURIComponent(_0x4dc7de);
        };
        _0x7d5e['data'] = {};
        _0x7d5e['initialized'] = !![];
    }
    var _0x384e71 = _0x7d5e['data'][_0x2d46f2];
    if (_0x384e71 === undefined) {
        _0x123963 = _0x7d5e['base64DecodeUnicode'](_0x123963);
        _0x7d5e['data'][_0x2d46f2] = _0x123963;
    } else {
        _0x123963 = _0x384e71;
    }
    return _0x123963;
};
var a = random(0x0, 0xa);
var b = random(0x0, 0xa);
if (a > b) {
    console[_0x7d5e('0x0')](_0x7d5e('0x1'));
} else if (b > a) {
    console[_0x7d5e('0x0')](_0x7d5e('0x2'));
} else {
    console[_0x7d5e('0x0')](_0x7d5e('0x3'));
}
console[_0x7d5e('0x0')](_0x7d5e('0x4'));;
encode_version = 'sojson.v4';