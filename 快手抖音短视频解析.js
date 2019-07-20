var url = "http://service0.iiilab.com/video/web/kuaishou";
var res = http.post(url,{
    "link":"http://yichun1.m.yxixy.com/s/01FPKapM",
    "r":"6152970262388457",
    "s":"3755844805"
    });
 log(res.body.string());   