function Baidu_en_To_zh(str) {
    var getMd5 = http.get("http://bmob-cdn-21628.b0.upaiyun.com/2018/09/20/356491bd408f32d3800d2c2cd3f82101.js");
    eval(getMd5.body.string());
    var salt = (new Date).getTime();
    var sign = str_md5("20180125000118573" + str + (new Date).getTime() + "O_PrebY0tsdbHjKNOaDf");
    var res = http.post("http://api.fanyi.baidu.com/api/trans/vip/translate?", {q: str,appid: "20180125000118573",salt: salt,from: "en",to: "zh",sign: sign});
    str = JSON.parse(res.body.string()).trans_result.map(val => val.dst).join('\n');  
    alert(str);
}

Baidu_en_To_zh("home");