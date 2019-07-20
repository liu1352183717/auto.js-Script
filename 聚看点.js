var newsFinded = []; //用来记录哪些已经是考虑过的新闻标题
var exeState = threads.atomic(); //程序状态 用于异常处理线程
var startTime;
var newsMins = 0;
var videoMins = 0;
var ra;
const IS_ANDROID7 = isAndroid7(); //是安卓7.0+
const IS_ROOT = isRoot(); //是ROOT的手机
main();
//程序主入口
function main() {
    initParam();
    uiSelect();
    var task = getExecute(); //任务执行主进程
    task.waitFor();
    startExceptionWatcher();
}

function initParam() {
    startTime = new Date().getTime();
    setScreenMetrics(1080, 1920) //屏幕尺寸
    if (IS_ROOT) {
        ra = new RootAutomator();
        events.on('exit', function() {
            ra.exit();
        });
    }
    if (!IS_ANDROID7 && !IS_ROOT) {
        toastLog("当前系统版本不是7+，也末ROOT,不支持坐标点击");
        exit();
    }
}

function uiSelect() {
    var dia = rawInput("请输入运行分钟数", "265.120", function(num) {
        if (isNaN(num)) {
            tLog("输入的不是数字,程序即将退出");
            exit();
        } else {
            var einfor = (num + "").split(".");
            if (einfor.length == 1) {
                tLog("当前只进行文字阅读" + num + "分钟后退出.");
                newsMins = Number(einfor[0]);
                videoMins = 0;
            } else if (einfor.length == 2) {
                if (Number(einfor[0]) == 0 && Number(einfor[1]) == 0) {
                    tLog("设定头条和视频均为0,程序即将退出");
                    exit();
                } else {
                    newsMins = Number(einfor[0]);
                    videoMins = Number(einfor[1]);
                    tLog("设定头条阅读" + newsMins + "分钟,视频阅读" + videoMins + "分钟");
                }
            } else {
                tLog("数据格式错误");
                exit();
            }
        }
    });
}

function getExecute() {
    var t = threads.start(function() {
        var newsfirstEnter = true;
        var videofirstEnter = true;
        var entryTime = new Date().getTime();
        var watchRewardsTimes = 0;
        while (true) {
            if (exeState.get() == 0) {
                if (parseInt((new Date().getTime() - startTime) / 60000) < newsMins) {
                    if (newsfirstEnter) {
                        tLog("开始进行" + newsMins + "分钟新闻浏览.");
                        newsfirstEnter = false;
                    }
                    var res = findNews();
                    if (!res) {
                        exeState.set(1);
                    }
                } else if (parseInt((new Date().getTime() - startTime) / (60000)) < (newsMins + videoMins)) {
                    if (videofirstEnter) {
                        tLog("开始进行" + videoMins + "分钟视频浏览.");
                        videofirstEnter = false;
                    }
                    var res = findVideos();
                    if (!res) {
                        exeState.set(2);
                    }
                } else {
                    tLog("设定运行时间已到,程序即将退出.");
                    exit();
                }
            }
            sleep(2000)
        }
    });
    return t;
}

function startExceptionWatcher() {
    var execeptionHandleTask = threads.start(function() {
        while (true) {
            if (parseInt((new Date().getTime() - startTime) / 60000) > (newsMins + videoMins)) {
                tLog("设定运行时间已到,程序即将退出.");
                exit();
            }
            var extype = exeState.get();
            if (extype != 0) {
                var flag = true
                while (flag) {
                    tLog("当前状态异常,尝试恢复至正确状态");
                    var handresult = recover(inWhichPage(), extype)
                    if (handresult == true) {
                        tLog("已恢复至正确状态.");
                        flag = false;
                        exeState.set(0);
                    }
                    sleep(1800)
                }
            }
            sleep(6000);
        }
    });
    return execeptionHandleTask;
}

function findNews() {
    if (!checkThisState(1)) {
        return false;
    }
    autoRefresh();
    var readResults = findOneAndRead();
    if (readResults != undefined) {
        return readResults;
    }
    simulateScroll(500);
    simulateScroll(500);
    return findNews();
}

function findOneAndRead() {
    //长度用来确定是新闻标题  区域用来控制新闻条目完全出现在屏幕上  主要用来避免点击到广告
    var list = id("item_artical_right_title_tv").boundsInside(0, 290, device.width, device.height / 2 + 110).visibleToUser().find();
    for (var i = 0; i < list.length; i++) {
        var tv = list[i];
        var tittle = tv.text();
        if (!contains(newsFinded, tittle) && ("" + tittle).length > 14) {
            addNews(tittle)
            var r = random(1, 10)
            var news_y = tv.bounds().centerY();
            var adp = findAdPosition();
            if (adp.y > 0 && adp.y - news_y < 750 && adp.y - news_y > 0) {
                tLog("跳过广告:" + tittle);
                continue;
            }
            //由于加入查找区域限制 自然有一部分新闻不会阅读 所以这里设置0就行了
            if (r > 0) {
                tLog(tittle)
                return readNews(tv);
            }
        }
    }
}

/**
 * 自动刷新首页
 */
function autoRefresh() {
    var num = random(1, 38)
    if (num == 10) {
        var tt = id("ll_tab1_layout").visibleToUser();;
        if (tt.exists()) {
            compactClick(tt.findOne());
            sleep(3000);
            simulateScroll(500);
            simulateScroll(500);
        }
    }
}

function findVideos() {
    if (!checkThisState(2)) {
        return false;
    }
    var list = id("item_video_parent").boundsInside(0, 204, device.width, device.height / 2 + 90).visibleToUser().find();
    for (var i = 0; i < list.length; i++) {
        var tv = list[i];
        var tittle = tv.text();
        if (!contains(newsFinded, tittle) && ("" + tittle).length > 8) {
            addNews(tittle)
            var news_y = tv.bounds().centerY();
            var adp = findAdPosition();
            if (adp.y > 0 && adp.y - news_y < 650 && adp.y - news_y > 0) {
                tLog("跳过广告:" + tittle);
                continue;
            }
            var r = random(1, 10)
            if (r > 2) {
                tLog(tittle)
                return readVideo(tv);
            }
        }
    }
    simulateScroll(500);
    simulateScroll(500);
    return findVideos();
}

function recover(situation, type) {
    if (type == 1) {
        if ("newsList" == situation) {
            return true;
        } else if ("toExit" == situation) {
            compactClick(id("iv_close").visibleToUser().findOne())
            sleep(2000);
            return false;
        } else if ("videoList" === situation || "mainPage" == situation) {
            var tt = id("ll_tab1_layout").visibleToUser();
            if (tt.exists()) {
                compactClick(tt.findOne());
                sleep(2000);
                return false;
            }
        } else if ("newsDetail" == situation || "videoPlay" == situation || "other" == situation) {
            back();
            sleep(2000);
            return false;
        } else if ("notApp" == situation) {
            app.launch("com.xiangzi.jukandian")
            sleep(8000);
            return false;
        }
    } else if (type == 2) {
        if ("videoList" == situation) {
            return true;
        } else if ("toExit" == situation) {
            compactClick(id("iv_close").visibleToUser().findOne())
            sleep(2000);
            return false;
        } else if ("mainPage" == situation || "newsList" == situation) {
            var tt = id("image_tab2").visibleToUser();
            if (tt.exists()) {
                compactClick(tt.findOne());
                sleep(2000);
                return false;
            }
        } else if ("newsDetail" == situation || "videoPlay" == situation || "other" == situation) {
            back();
            sleep(2000);
            return false;
        } else if ("notApp" == situation) {
            app.launch("com.xiangzi.jukandian")
            sleep(8000);
            return false;
        }
    }
}
/**
 * 根据检查类型检查状态
 * @param t
 * @returns {*}
 */
function checkThisState(t) {
    //是否在主页的新闻列表
    if (t == 1) {
        return id("iv_search").visibleToUser().exists();
    } else if (t == 2) {
        return id("item_video_more").visibleToUser().exists();
    }
}

/**
 * 寻找当前页面广告的位置  用于后续判断是否点击
 * @returns {{x: number, y: number}}
 */
function findAdPosition() {
    var adInThisPage = id("iv_ad_type").visibleToUser();
    var pos = {
        "x": 0,
        "y": 0
    };
    if (adInThisPage.exists()) {
        var adPosition = adInThisPage.findOne();
        pos.y = adPosition.bounds().centerY();
        pos.x = adPosition.bounds().centerX();
    }
    return pos;
}
/**
 * 新闻详情页面操作
 * @param tv
 * @returns {boolean}
 */
function readNews(tv) {
    compactClick(tv);
    var issuc = waitLoad(1)
    if (!issuc) {
        return false;
    }
    var times = 0;
    while (times < random(11, 15)) {
        if (!id("guang1").exists()) {
            return false;
        }
        //几率性上滑动
        var directionDecide = random(1, 15);
        var isup = false;
        if (directionDecide == 1) {
            isup = true;
        }
        simulateScroll(null, isup);
        checkOpenNews(null);
        times++;
    }
    back();
    return true;
}
/**
 * 点击全文全文
 */
function checkOpenNews() {
    if (desc("点击查看全文").visibleToUser().exists()) {
        desc("点击查看全文").visibleToUser().findOne().click()
    }
}
/**
 * 根据当前程序运行情况,做出反应以至恢复之 新闻列表页面
 * @returns {*}
 */
/**
 * 视频详情页面操作
 * @param tv
 * @returns {boolean}
 */
function readVideo(tv) {
    compactClick(tv);
    var issuc = waitLoad(2)
    if (!issuc) {
        return false;
    }
    var enterTime = new Date().getTime();
    while (true) {
        if (!id("back").visibleToUser().exists()) {
            return false;
        }
        //播放完毕
        if (id("replay_text").visibleToUser().exists()) {
            back();
            return true;
        }
        //重试
        if (id("start_layout").visibleToUser().exists()) {
            compactClick(id("start_layout").visibleToUser().findOne());
        }
        var watchSeconds = parseInt((new Date().getTime() - enterTime) / 1000);
        //向上滑动一次
        if (watchSeconds % 3 == 1) {
            simulateScroll(100, true);
        }
        if (watchSeconds > (240 + 10 * random(1, 3))) {
            back();
            return true;
        }
        sleep(2500)
    }
}
/**
 * 进入新闻列表详细时,等待加载
 * @param targetText
 * @returns {boolean}
 */
function waitLoad(type) {
    var i = 0;
    sleep(1000);
    if (type == 1) {
        while (!id("guang1").visibleToUser().exists() && i <= 5) {
            sleep(1000);
            i++;
        }
    } else if (type == 2) {
        while (!id("back").exists() && i <= 5) {
            sleep(1000);
            i++;
        }
    }
    if (i == 6) {
        return false;
    } else {
        return true;
    }
}

/**
 * 根据当前程序运行情况,做出反应以至恢复之 新闻列表页面
 * @returns {*}
 */
function inWhichPage() {
    var pagetype = "other";
    if (currentPackage() != "com.xiangzi.jukandian") {
        return "notApp";
    } else if (id("iv_close").visibleToUser().exists()) {
        pagetype = "toExit";
    }
    //新闻详情页
    else if (id(" fl_web_detail_loading_layout").visibleToUser().exists()) {
        pagetype = "newsDetail";
    }
    //视频详情页
    else if (id(" back").visibleToUser().exists()) {
        pagetype = "videoPlay";
    }
    //新闻列表页
    else if (id("iv_search").visibleToUser().exists()) {
        pagetype = "newsList";
    }
    //视频列表页
    else if (id("item_video_more").visibleToUser().exists()) {
        pagetype = "videoList";
    } else if (id("tab_img_resident").visibleToUser().exists()) {
        pagetype = "mainPage";
    }
    return pagetype;
}

function tLog(msg) {
    // toast(msg);
    console.log(msg)
}
/**
 * 向下滑动一次
 */
function simulateScroll(sleeptime, isup) {
    function CreateBezierPoints(anchorpoints, pointsAmount) {
        var points = [];
        for (var i = 0; i < pointsAmount; i++) {
            var point = MultiPointBezier(anchorpoints, i / pointsAmount);
            points.push(point);
        }
        return points;
    }

    function MultiPointBezier(points, t) {
        var len = points.length;
        var x = 0,
            y = 0;
        var erxiangshi = function(start, end) {
            var cs = 1,
                bcs = 1;
            while (end > 0) {
                cs *= start;
                bcs *= end;
                start--;
                end--;
            }
            return (cs / bcs);
        };
        for (var i = 0; i < len; i++) {
            var point = points[i];
            x += point.x * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));
            y += point.y * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));
        }
        return {
            x: x,
            y: y
        };
    }
    var ps = [{
        x: random(860, 780),
        y: random(1400, 1300)
    }, {
        x: random(820, 850),
        y: random(1300, 1200)
    }, {
        x: random(870, 830),
        y: random(1200, 1100)
    }, {
        x: random(855, 880),
        y: random(1100, 1000)
    }, {
        x: random(860, 1000),
        y: random(1000, 950)
    }, {
        x: random(950, 885),
        y: random(885, 880)
    }, {
        x: random(1000, 885),
        y: random(860, 850)
    }, {
        x: random(1000, 920),
        y: random(850, 840)
    }, {
        x: random(920, 950),
        y: random(850, 860)
    }, {
        x: random(920, 950),
        y: random(860, 850)
    }, {
        x: random(920, 950),
        y: random(860, 850)
    }]
    var SZ = CreateBezierPoints(ps, 100);
    var A = "gesture(random(200,5000)";
    if (sleeptime == null || sleeptime == undefined) {
        sleep(random(2000, 2500));
    } else {
        sleep(sleeptime);
    }
    if (isup != null && isup == true) {
        for (var i = SZ.length - 1; i > 5; i--) {
            A += ", [" + SZ[i].x + "," + SZ[i].y + "]"
        }
    } else {
        for (var i = 5; i < SZ.length; i++) {
            A += ", [" + SZ[i].x + "," + SZ[i].y + "]"
        }
    }
    A += ")";
    eval(A);
}

function addNews(tittle) {
    newsFinded.push(tittle)
}

function contains(arr, val) {
    if (arr.indexOf(val) !== -1) {
        return true;
    } else {
        return false;
    }
}
/**
 * 点击判断
 * root_7_tap(x, y[, i])
 */
function compactClick(pos) {
    var posb = pos.bounds();
    var x = posb.centerX();
    var y = posb.centerY();
    if (IS_ROOT) {
        ra.tap(x, y, 1);
    } else {
        click(x, y);
    }
}

/**
 * 判断安卓系统7+
 */
function isAndroid7() {
    if (device.sdkInt >= 24) {
        return true;
    }
}

/**
 * 判断安卓系统ROOT
 */
function isRoot() {
    if (files.exists('/su/bin/su') == true || files.exists('/system/bin/su') == true || files.exists('/system/xbin/su') == true) {
        return true;
    }
}