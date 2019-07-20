try{

/*
   判断短信中是否含有验证码并提取
   20151019.1444
   by firefly
   
   @基本思路：
             1.是否私人号码？
             2.是否中文/英文验证短信？（不同的关键词）
             3.验证码匹配
   参考： https://github.com/drakeet/SmsCodeHelper/blob/master/app/src/main/java/me/drakeet/inmessage/utils/SmsUtils.java

为适应短信弹窗项目作部分小修改 by QQ:32552732
*/

//定义关键词全局变量数组
var CPATCHAS_KEYWORD_CN = new Array("动态口令","随机码","代码","激活码","动态码","校验码","验证码","确认码","检验码","验证代码","激活代码","校验代码","动态代码","检验代码","确认代码","短信口令","动态密码","交易码","驗證碼","激活碼","動態碼","校驗碼","檢驗碼","驗證代碼","激活代碼","校驗代碼","確認代碼","動態代碼","檢驗代碼","上网密码","随机密码","短信密码");
var CPATCHAS_KEYWORD_EN = new Array("CODE","code");


// 判断字符串中时否包含中文
function isContainsChinese(str) {
    var regEx = new RegExp("[\u4e00-\u9fa5]");
    var flg = regEx.test(str);
    return (flg || (str.indexOf("【")>=0) || (str.indexOf("】")>=0) || (str.indexOf("。")>=0) );
}

// 判断是否是私人手机号码
function isPersonalMoblieNO(mobiles) {
    if(mobiles != null) {
        var regEx = new RegExp("^((13[0-9])|(15[^4,\\D])|(18[0,5-9]))\\d{8}$");
        var found = regEx.test(mobiles);
        return found;
    }
    return false;
}

//只有字母相似级别为0， 只有字母和数字可能级别为1, 只有数字可能级别为2.
function getLikelyLevel(str) {
    if(RegExp("^[0-9]*$").test(str)) {
        return 2;
    } else if(RegExp("^[a-zA-Z]*$").test(str)) {
        return 0;
    } else {
        return 1;
    }
}

// 根据验证码特征获取验证码字符串
function tryToGetCaptchas(str,isChinese) {
    var matches = new Array();
    if (isChinese){
        matches = str.match(/[a-zA-Z0-9\.]+/g);
    }
    else
    {
        matches = str.match(/[0-9\.]+/g);
    }
    var mostLikelyCaptchas = "";
    var currentLevel = -1; 
    for (var i=0;i<matches.length;i++){
        if(matches[i].length>3 && matches[i].length<8 && matches[i].indexOf(".")==-1){
            if(isNearToKeyWord(matches[i], str, isChinese)) {
                if(isChinese) {
                    if(currentLevel == -1) {
                        mostLikelyCaptchas = matches[i];
                    }
                    var level = getLikelyLevel(matches[i]);
                    if(level > currentLevel) {
                        mostLikelyCaptchas = matches[i];
                    }
                    currentLevel = level;
                } else {
                    return matches[i];
                }
            }
        }
    }
    return mostLikelyCaptchas;
}

//判断是否靠近关键词
function isNearToKeyWord(currentStr, content, isChinese) {
    var startPosition = 0;
    var endPosition = content.length - 1;
    //var magicNumber = 14; //魔数 ^_^
    var magicNumber = 20; //上面那个魔数不够大啊 (>﹏<)
    if (content.indexOf(currentStr) > magicNumber) {
        startPosition = content.indexOf(currentStr) - magicNumber;
    }
    if (content.indexOf(currentStr)  + currentStr.length + magicNumber < content.length - 1) {
        endPosition = content.indexOf(currentStr) + currentStr.length + magicNumber;
    }
    var isNearToKeyWord = false;
    var keywords = new Array();
    if (isChinese){
        keywords = CPATCHAS_KEYWORD_CN;
    }
    else{
        keywords = CPATCHAS_KEYWORD_EN;
    }
    for (var i = 0; i < keywords.length; i++) {
        if (content.substring(startPosition, endPosition).indexOf(keywords[i])>=0) {
            isNearToKeyWord = true;
            codename = keywords[i];
            break;
        }
    }
    return isNearToKeyWord;
}

// 根据关键词判断是否是验证短信
function isCaptchasMessage(content, isChinese) {
    var exp_arr = new Array();
    if (isChinese){
        exp_arr = CPATCH