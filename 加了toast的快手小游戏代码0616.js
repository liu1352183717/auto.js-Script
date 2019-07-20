auto();
//请求截图
if (!requestScreenCapture()) {
    toast("请求截图失败");
    exit();
}
//==================脚本主控制区======================================
gameName = "连连看";
//gameName = "拯救萌宠"
// gameName = "消砖块"




packageName = "com.kwai.sogame";
imgPath = "/sdcard/快手小游戏截图/";
files.ensureDir(imgPath);

// pageInfo=[
//     ["黄色小指头",391,12,447,87,"某游戏"],
//     ["最近对战",605,205,978,301,"主页"],
//     ["已对",481,937,570,990,"pk结果"],
//     ["打字",186,1724,272,1787,"聊天"]
// ]



while (1) {
    errorTime = 1
    let page = whichPage();
    log("\n当前界面=", page)
    // exit()
    switch (page) {
        case "某游戏":
            gamePlay(gameName)
          //  toastLog(1);
            break;
        case "主页":
            gameOpen(gameName)
         //   toastLog(2);
            break;
        case "pk结果":
            gameResult()
          //  toastLog(3);
            break;
        case "聊天":
            chatInterface()
          //  toastLog(4);
            break;
        default:
            if (currentPackage() == packageName) {
                sleep(1000);
                errorTime = errorTime + 1
                if (errorTime > 10) {
                    appOpen(packageName)
                    errorTime = 1
                }
                break;
            } else {

                toastLog("当前包名不是快手小游戏\n当前包名是", "=" + currentPackage() + "=", "包名长度=", currentPackage().length)
                sleep(2000)
                appOpen(packageName)
            }
    }
}


function gamePlay(gameName) {
    switch (gameName) {
        case "消砖块":
            xiaoZhuanKuai()
            break;
        case "连连看":
            lianLianKan()
            break;
        case "拯救萌宠":
            zhengJiuMengChong()
            break;
        default:
            toastLog(gameName, "游戏名字你写错了,没有这个游戏的脚本")
            alert()
    }
}

function gameResult() {
    //在pk页,按两次back返回主页
    //按一次是聊天
    //按二次是主页
    back()
    sleep(2000)
    for (let i = 0; i < 3; i++) {
        if (whichPage() == "聊天") {
            toastLog("从pk页返回到了聊天页")
            //点击左上角箭头,返回主页
            back()
            sleep(2000)
        } else if (whichPage() == "主页") {
            toastLog("从pk页返回到了聊天页又返回到了主页")
            sleep(2000)
            return true;
        } else if (whichPage() == "某游戏") {
            return;
        }





    }
    toastLog("从pk页返回主页异常")
    alert()
    return false;
}

function chatInterface() {
    //在聊天页,按一次back返回主页
    back()
    sleep(2000)
    for (let i = 0; i < 3; i++) {
        if (whichPage() == "聊天") {
            toastLog("从聊天页返回到了主页失败,准备点击下一次back键")
            back()
            sleep(2000)
        } else if (whichPage() == "主页") {
            toastLog("从聊天页返回到了主页")

            return true;
        } else if (whichPage() == "某游戏") {
            return;
        }
    }
    toastLog("从聊天页返回主页异常")
    alert()
    return false;
}

function appOpen(packageName) {
    toast("启动快手小游戏")
    sleep(2000)
    if (currentPackage() == packageName) {

    } else {
        launch(packageName);
        sleep(1000);
    }
    for (let i = 0; i < 15; i++) {

        if (whichPage() == "主页") {
            return true;
        } else {
            sleep(1000);
        }
    }


    toastLog("快手小游戏启动异常")
    alert()
    return false;
}


function gameOpen(gameName) {
    if (whichPage() == "主页") {

        let imgSmall = images.read(imgPath + gameName + ".png");
        let p = findImage(captureScreen(), imgSmall);
        if (p) {
            toastLog("找到了游戏", gameName, "开始点击它")
            press(p.x, p.y, 50);
            sleep(3000)
            return true;
        } else {
            toastLog("没找到游戏", gameName, "下滑屏幕");
            // 下滑()
            sleep(2000)


            let imgSmall = images.read(imgPath + "最近对战" + ".png");

            for (let i = 0; i < 10; i++) {
                let p = findImage(captureScreen(), imgSmall, {
                    region: [652, 213, 273, 76],
                    threshold: 0.8
                });
                if (p) {
                    break;
                } else {
                    toastLog("下滑", i + 1, "次", "没找到右上角最近对战图片");

                    下滑()
                }
            }











        }
        for (let i = 0; i < 10; i++) {
            let p = findImage(captureScreen(), imgSmall);
            if (p) {
                toastLog("找到了游戏", gameName, "开始点击它")

                press(p.x, p.y, 50);
                sleep(3000)
                return true;
            } else {
                toastLog("上滑", i, "次", "没找到右上角最近对战图片");

                上滑()
            }
        }
        toastLog("没找到游戏", gameName, "脚本停止运行");
        alert()
        return false;
    } else {
        toastLog("现在不在主页,不能打开任何游戏")
        sleep(2000)
    }
    return false;
}


function alert() {
    device.vibrate(2000);
    sleep(1000);
    device.vibrate(2000);
    exit();
}



function whichPage() {
    // 左上角有最近对战,说明在主页
    //顶部中间有一个黄色的小指头,说明在某个游戏界面
    //中间有一个 已对,说明在游戏pk结果页面
    //底部有戳这里打字说明在聊天页面
    pageInfo = [
        ["黄色小指头", 391, 12, 447, 87, "某游戏"],
        ["对战", 290, 73, 422, 150, "主页"],
        ["已对", 481, 937, 570, 990, "pk结果"],
        ["打字", 186, 1724, 272, 1787, "聊天"]
    ]

    for (let i = 0; i < pageInfo.length; i++) {
        let imgSmall = images.read(imgPath + pageInfo[i][0] + ".png");
        //截图并找图
        let p = findImage(captureScreen(), imgSmall, {
            region: [pageInfo[i][1], pageInfo[i][2], pageInfo[i][3] - pageInfo[i][1], pageInfo[i][4] - pageInfo[i][2]],
            threshold: 0.6
        });
        if (p) {
            // log("\n当前页面======",pageInfo[i][5]);
            // log("i=",i)
            log("pageInfo[i][5]=",pageInfo[i][5])
            return pageInfo[i][5]
        } else {
            // log("\n当前页面XXXXXX",pageInfo[i][5]);
        }

    }
    return "脚本不认识这个界面";


}

function 上滑() {
    var x1 = 700,
        y1 = 1600,
        x2 = 1000,
        y2 = 630,
        duration = 1000;
    swipe(x1, y1, x2, y2, duration)
    sleep(1000)
}

function 下滑() {
    //快速下滑
    var x1 = 700,
        y1 = 800,
        x2 = 500,
        y2 = 1630,
        duration = 300;
    swipe(x1, y1, x2, y2, duration)
    sleep(1000)
}








//==================以下是游戏运行是的脚本===========================================
function xiaoZhuanKuai() {
    intervalTime = 1;
    press(132, 1552, intervalTime);
    press(391, 1587, intervalTime);
    press(665, 1599, intervalTime);
    press(962, 1552, intervalTime);
}

function zhengJiuMengChong() {
    Threshold = 3
    let img = captureScreen();
    sleep(30);
    let targetCoordinatesArray = coordinateAnalysisAndExtract(img);
    ////log(targetCoordinatesArray);
    coordinatesClick(targetCoordinatesArray);
    targetCoordinatesArray = coordinateAnalysisAndExtractRight(img);
    ////log(targetCoordinatesArray);
    coordinatesClick(targetCoordinatesArray);
    targetCoordinatesArray = coordinateAnalysisAndExtractDown(img);
    ////log(targetCoordinatesArray);
    coordinatesClick(targetCoordinatesArray);
    //增加点击火箭筒
    rocketClick(img);
    sleep(80);


}


//-------以下是拯救萌宠使用的小函数----------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

function rocketClick(img) {
    var rocket = images.read(imgPath + "火箭筒.png");
    //截图并找图
    var p = findImage(img, rocket, {
        region: [52, 482, 950, 1145],
        threshold: 0.8
    });
    if (p) {
        ////log("找到火箭筒啦: " + p);
        click(p.x, p.y);
    }
}

function coordinatesClick(targetCoordinatesArray) {
    for (j = 0, len = targetCoordinatesArray.length; j < len; j++) {
        x = targetCoordinatesArray[j][0];
        y = targetCoordinatesArray[j][1];
        click(x, y);
        // press(500, 1000, 1200);
    }
}

function coordinateAnalysisAndExtractDown(img) {
    //分析提取图片中相邻色块颜色相同的坐标
    //只分析色块的右方和下方,如果右边或者下边颜色一样,那么就记录这个坐标
    //起点坐标是137,538
    //终点坐标是1027,1597
    var xStart = 137,
        yStart = 1530,
        xEnd = 1027,
        yEnd = 1597,
        //色块上下间距120
        //色块左右间距126
        SpacingLeftAndRight = 124,
        SpacingUpAndDown = 122,

        // 横排8个竖排9个
        //最后一排不需要考虑,在第8排的时候,就已经检测过第9排了.
        //横排竖排都一样,最后一排都不需要考虑
        HorizontalNumber = 8;


    var targetCoordinatesArray = new Array()
    // 从左往右,从上到下.
    for (var i = 1; i <= HorizontalNumber - 1; i++) {

        //获取在点(x, y)处的颜色
        // ////log(xStart+(i-1)*SpacingLeftAndRight, yStart+(j-1)*SpacingUpAndDown);
        var ColorMainColorBlock = images.pixel(img, xStart + (i - 1) * SpacingLeftAndRight, yStart);
        var ColorRightColorBlock = images.pixel(img, xStart + i * SpacingLeftAndRight, yStart);
        var ColorDownColorBlock = images.pixel(img, xStart + (i - 1) * SpacingLeftAndRight, yStart);
        threshold = Threshold;
        if (colors.isSimilar(ColorMainColorBlock, ColorRightColorBlock, threshold)) {
            var targetCoordinates = new Array(xStart + (i - 1) * SpacingLeftAndRight, yStart)
            targetCoordinatesArray.push(targetCoordinates)
        }

    }
    return targetCoordinatesArray;
}



//边上的色块
function coordinateAnalysisAndExtractRight(img) {
    //分析提取图片中相邻色块颜色相同的坐标
    //只分析色块的右方和下方,如果右边或者下边颜色一样,那么就记录这个坐标
    //起点坐标是137,538
    //终点坐标是1027,1597
    var xStart = 1008,
        yStart = 547,
        xEnd = 1027,
        yEnd = 1597;
    //色块上下间距120
    //色块左右间距126
    SpacingLeftAndRight = 124,
        SpacingUpAndDown = 122,

        // 横排8个竖排9个
        //最后一排不需要考虑,在第8排的时候,就已经检测过第9排了.
        //横排竖排都一样,最后一排都不需要考虑
        VerticalNumber = 9;

    var targetCoordinatesArray = new Array()
    // 从左往右,从上到下.

    for (var j = 1; j <= VerticalNumber - 1; j++) {
        //获取在点(x, y)处的颜色
        // ////log(xStart+(i-1)*SpacingLeftAndRight, yStart+(j-1)*SpacingUpAndDown);
        var ColorMainColorBlock = images.pixel(img, xStart, yStart + (j - 1) * SpacingUpAndDown);
        var ColorDownColorBlock = images.pixel(img, xStart, yStart + j * SpacingUpAndDown);
        threshold = Threshold;
        if (colors.isSimilar(ColorMainColorBlock, ColorDownColorBlock, threshold)) {
            var targetCoordinates = new Array(xStart, yStart + (j - 1) * SpacingUpAndDown)
            targetCoordinatesArray.push(targetCoordinates)
        }
    }

    return targetCoordinatesArray;
}






function coordinateAnalysisAndExtract(img) {
    //分析提取图片中相邻色块颜色相同的坐标
    //只分析色块的右方和下方,如果右边或者下边颜色一样,那么就记录这个坐标
    //起点坐标是137,538
    //终点坐标是1027,1597
    var xStart = 137,
        yStart = 542,
        xEnd = 1027,
        yEnd = 1597,
        //色块上下间距122
        //色块左右间距124
        SpacingLeftAndRight = 124,
        SpacingUpAndDown = 122,

        // 横排8个竖排9个
        //最后一排不需要考虑,在第8排的时候,就已经检测过第9排了.
        //横排竖排都一样,最后一排都不需要考虑
        HorizontalNumber = 8,
        VerticalNumber = 9;

    var targetCoordinatesArray = new Array()
    // 从左往右,从上到下.
    for (var i = 1; i <= HorizontalNumber - 1; i++) {
        for (var j = 1; j <= VerticalNumber - 1; j++) {
            //获取在点(x, y)处的颜色
            // ////log(xStart+(i-1)*SpacingLeftAndRight, yStart+(j-1)*SpacingUpAndDown);
            var ColorMainColorBlock = images.pixel(img, xStart + (i - 1) * SpacingLeftAndRight, yStart + (j - 1) * SpacingUpAndDown);
            var ColorRightColorBlock = images.pixel(img, xStart + i * SpacingLeftAndRight, yStart + (j - 1) * SpacingUpAndDown);
            var ColorDownColorBlock = images.pixel(img, xStart + (i - 1) * SpacingLeftAndRight, yStart + j * SpacingUpAndDown);
            threshold = Threshold;
            if (colors.isSimilar(ColorMainColorBlock, ColorRightColorBlock, threshold) || colors.isSimilar(ColorMainColorBlock, ColorDownColorBlock, threshold)) {
                var targetCoordinates = new Array(xStart + (i - 1) * SpacingLeftAndRight, yStart + (j - 1) * SpacingUpAndDown)
                targetCoordinatesArray.push(targetCoordinates)
            }
        }
    }
    return targetCoordinatesArray;
}













//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------























































































function lianLianKan() {


    // let imgBackground=[images.read("/sdcard/js截图3/背景1.png"),images.read("/sdcard/js截图3/背景2.png"),images.read("/sdcard/js截图3/背景3.png")];
    imgBackground = [images.read(imgPath + "背景1.png")];
    //行列数目
    rowsNumber = 10;
    columnsNumber = 7;
    //=============================================================================
    //=========================连连看控制中心=============================================
    //=============================================================================


    //图片仓库,用来存放识别出来的图片信息
    warehouse = [];
    planePicture = new Array(); //先声明一维
    for (let k = 0; k < rowsNumber + 2; k++) { //一维长度为i,i为变量，可以根据实际情况改变
        planePicture[k] = new Array(); //声明二维，每一个一维数组里面的一个元素都是一个数组；
        for (let j = 0; j < columnsNumber + 2; j++) { //一维数组里面每个元素数组可以包含的数量p，p也是一个变量；
            planePicture[k][j] = false; //这里将变量初始化，我这边统一初始化为空，后面在用所需的值覆盖里面的值
        }
    }
    // ////log(planePicture.length)
    // ////log(planePicture)
    // exit()
    // 第一个和最后一个图片坐标
    imgFistCenterCoordinate = [114, 472];
    imgLastCenterCoordinate = [966, 1753];
    //图片宽高
    imgWidthHeight = [76, 50]
    imgWidthHeight2 = [38, 25]
    // 图片的左右和上下间隔距离
    SpacingLeftAndRight = Math.round((imgLastCenterCoordinate[0] - imgFistCenterCoordinate[0]) / (columnsNumber - 1));
    SpacingUpAndDown = Math.round((imgLastCenterCoordinate[1] - imgFistCenterCoordinate[1]) / (rowsNumber - 1));

    // 将图片整理到仓库
    warehouseReorganize();
    //遍历仓库中的图片
    lenWarehouse = warehouse.length;

    kk = 1

    for (let j = 0; j < lenWarehouse; j++) {
        // ////log("第",j,"个图片组\n");
        let lenimgs = warehouse[j].length;
        if (lenimgs > 30) {
            return;
        }
        for (let k1 = 0; k1 < lenimgs; k1++) {
            for (let k2 = k1 + 1; k2 < lenimgs; k2++) {
                ////log("当前对比的图片是\n",warehouse[j][k1], warehouse[j][k2],"\n以上是当前对比的两张图片");
                // sleep(10);
                if (warehouse[j][k1].imgEntity == false || warehouse[j][k2].imgEntity == false) {
                    break;
                }
                ////log(j,"号组图片数量=",warehouse[j].length,"   \n正在判断的两张图片行列号码是: ",rowExtract(warehouse[j][k1]),columnExtract(warehouse[j][k1]),rowExtract(warehouse[j][k2]),columnExtract(warehouse[j][k2]))
                let result = penApple(warehouse[j][k1], warehouse[j][k2]);
                if (result) {
                    //销毁点击过的对象
                    //第几个图片组
                    //那两个图片
                    //设置属性为空,而不是删除对象,否则造成索引错误
                    warehouse[j][k1].imgEntity = false
                    warehouse[j][k2].imgEntity = false
                    //删除之前数组内容
                    // 直接移除,而不是改变属性
                    ////log(warehouse[j],warehouse[j].length)
                    // warehouse[j].splice(k1,1);
                    // warehouse[j].splice(k2-1,1);
                    ////log("已销毁",j,k1)
                    ////log("已销毁",j,k2)
                    //删除之后数组内容
                    ////log(warehouse[j],warehouse[j].length)

                }
                // if(kk==7){exit()}
                kk = kk + 1
                ////log("两张图片对比完毕");
            }
        }
    }
    ////log("一次图片消除动作结束")
    ////log(warehouse)

}











































































//=============================================================================
//=========以下大部分是连连看用的小函数=====================================================
//=============================================================================


function penApple(p1, p2) {
    // if(!(rowExtract(p1)==10 && columnExtract(p1)==2 && rowExtract(p2)==10 && columnExtract(p2)==7)){return;}
    ////log(p1,p2)
    // ////log("penApple")
    if (is2ImgThoroughfare(p1, p2)) {
        //log("可以连接", rowExtract(p1),columnExtract(p1),"--",rowExtract(p2),columnExtract(p2));
        // exit();
        imgDestroy(p1, p2);
        return true;
    } else if (is2ImgThoroughfareUpDownLeftRight(p1, p2)) {
        //log("可以连接上下左右", rowExtract(p1),columnExtract(p1),"--",rowExtract(p2),columnExtract(p2));
        // exit();

        imgDestroy(p1, p2);
        return true;

    } else if (is2ImgThoroughfareZ(p1, p2)) {
        //log("可以连接ZZZ", rowExtract(p1),columnExtract(p1),"--",rowExtract(p2),columnExtract(p2));
        // exit();

        imgDestroy(p1, p2);
        return true;

    } else if (is2ImgThoroughfareZ1(p1, p2)) {
        //log("可以连接ZZZ1", rowExtract(p1),columnExtract(p1),"--",rowExtract(p2),columnExtract(p2));
        // exit();

        imgDestroy(p1, p2);
        return true;

    } else if (is2ImgThoroughfareZ2(p1, p2)) {
        //log("可以连接ZZZ2", rowExtract(p1),columnExtract(p1),"--",rowExtract(p2),columnExtract(p2));
        // exit();

        imgDestroy(p1, p2);
        return true;

    } else if (is2ImgThoroughfareZ3(p1, p2)) {
        //log("可以连接ZZZ3", rowExtract(p1),columnExtract(p1),"--",rowExtract(p2),columnExtract(p2));
        // exit();

        imgDestroy(p1, p2);
        return true;

    } else {
        //不能连
        //log("不能连接", rowExtract(p1),columnExtract(p1),"--",rowExtract(p2),columnExtract(p2));
        return false;

    }
}
//图片有两个属性,行列和图片实体
function ImgUnit(imgEntity, imgRowAndcolumn) {
    this.imgEntity = imgEntity;
    this.imgRowAndcolumn = imgRowAndcolumn;
}


//仓库中的格式
//仓库是一个列表,每个列表是一个图片对象组
//每个图片对象组包含两个属性  图片和行列
// imgDiscern = new ImgUnit(imgEntity, imgRowAndcolumn);
function is2ImgThoroughfare(p1, p2) {
    ////log(p1,p2)

    // =============不打印不想关的图片信息================================
    // if(!(rowExtract(p2)==2 && columnExtract(p2)==4)){return;}
    ////log("这里是is2ImgThoroughfare(p1, p2)")
    ////log(p1,p2)
    // =====================================================


    ////log("is2ImgThoroughfare(p1, p2)传入的参数是",p1,p2)
    //只需要返回是否能连接,不需要点击
    //开始搜索前对p1,p2排序，使p2尽可能的在p1的右下方。
    //这样做可以简化算法
    if (rowExtract(p1) > rowExtract(p2)) {
        let tp = p1;
        p1 = p2;
        p2 = tp;
    } else if (rowExtract(p1) == rowExtract(p2)) {
        if (columnExtract(p1) > columnExtract(p2)) {
            let tp = p1;
            p1 = p2;
            p2 = tp;
        }
    }
    ////log(p1,p2)


    //判断两个图片能不能连通
    // 一般都两种方法
    // 一个是枚举
    // 一个是递归(DFS(深度优先搜索))
    //这里我们用枚举
    // 第一种两个图片在同一行
    // 两个图片挨着
    // 两个图片不挨着

    // 第二种两个图片在同一列
    // 两个图片挨着
    // 两个图片不挨着

    // 第三种两个图片既不在同一行也不在同一列

    // 我们一个一个来看
    //=================可爱的分割线===============================================
    // 第一种两个图片在同一行
    ////log("同一行====================",onlineX(p1, p2))
    if (onlineX(p1, p2)) {
        ////log("266行出入的应该是同一行,if(onlineX(p1, p2))参数是",p1,p2)
        // 两个图片挨着
        if (p1NextToP2("onlineX", p1, p2)) {
            ////log("132行p1,p2在一起",p1,p2)
            return true;
        } else if (obstacleIsThereBetweenP1AndP2("onlineX", p1, p2)) {
            ////log("272行图片中有障碍物else if (obstacleIsThereBetweenP1AndP2(onlineX, p1, p2)",p1,p2)
            // exit()
            // p1,p2中间有障碍物
            //那么p1的下面p3是不是空的?
            //如果p3是空的,那么p2的下面p4是不是空的,
            //如果p4是空的,那么p1的下面p3和p2的下面p4能不能连接?
            //如果p3和p4可以连接,那么p1和p2就能连接

            //行列数目
            // let rowsNumber = 10;
            // let columnsNumber = 7;
            ////log("开始for循环",(rowsNumber - rowExtract(p1)))
            for (let k = 1; k <= (rowsNumber - rowExtract(p1)) + 1; k++) {
                ////log("135行的参数p1,p2是",p1,p2,"k=",k);
                let p3 = imgEntityExtractFromRowAndcolumn(rowExtract(p1) + k, columnExtract(p1));
                let p4 = imgEntityExtractFromRowAndcolumn(rowExtract(p2) + k, columnExtract(p2));




                if (!isImgBackground(p3) || !isImgBackground(p4)) {
                    ////log("下路不通")
                    // 下路不通
                    ////log("同在一行下路不通",p1,p2)
                    // exit()
                    break;
                } else {
                    ////log("进入到这里了")
                    let p3new = new ImgUnit(p3, [rowExtract(p1) + k, columnExtract(p1)]);
                    let p4new = new ImgUnit(p4, [rowExtract(p2) + k, columnExtract(p2)]);
                    // 判断p3p4是否可以连接

                    ////log("obstacleIsThereBetweenP1AndP2(onlineX, p3new, p4new)",obstacleIsThereBetweenP1AndP2("onlineX", p3new, p4new))


                    if (!obstacleIsThereBetweenP1AndP2("onlineX", p3new, p4new)) {
                        ////log("同在一行下路连通",p1,p2)
                        // exit()
                        return true;
                    }
                }
            }
            ////log("下路不通开始测试上路")
            //如果下路不通,那么尝试上路
            for (let k = 1; k <= rowExtract(p1); k++) {
                ////log("175行p3p4为空",rowExtract(p1) - k, columnExtract(p1),rowExtract(p2) - k, columnExtract(p2))
                // exit()
                let p3 = imgEntityExtractFromRowAndcolumn(rowExtract(p1) - k, columnExtract(p1));
                let p4 = imgEntityExtractFromRowAndcolumn(rowExtract(p2) - k, columnExtract(p2));
                if (!isImgBackground(p3) || !isImgBackground(p4)) {
                    //上路不通
                    ////log("同在一行上路不通",p1,p2)
                    // exit()

                    break;
                } else {
                    ////log("185行p3p4为空",rowExtract(p1) - k, columnExtract(p1),rowExtract(p2) - k, columnExtract(p2))
                    // exit()
                    let p3new = new ImgUnit(p3, [rowExtract(p1) - k, columnExtract(p1)]);
                    let p4new = new ImgUnit(p4, [rowExtract(p2) - k, columnExtract(p2)]);
                    // 判断p3p4是否可以连接
                    if (!obstacleIsThereBetweenP1AndP2("onlineX", p3new, p4new)) {
                        ////log("同在一行上路连通",p1,p2)
                        // exit()
                        return true;
                    } else {
                        ////log("196行p3p4不能连接",p3new, p4new)
                    }
                }
            }
            return false;
        } else {
            // p1,p2中间没有障碍物
            ////log("同在一行p1,p2中间没有障碍物,可以直接连接",p1,p2)
            // exit()
            return true;
        }
    }
    // 第二种两个图片在同一列
    if (onlineY(p1, p2)) {
        // if(!(rowExtract(p1)==4 && columnExtract(p1)==6 && rowExtract(p2)==7 && columnExtract(p2)==6)){return;}

        ////log("281行同一列onlineY(p1, p2)",p1,p2)
        // 两个图片挨着
        if (p1NextToP2("onlineY", p1, p2)) {
            ////log("两个图片挨着")

            return true;
        } else if (obstacleIsThereBetweenP1AndP2("onlineY", p1, p2)) {
            ////log("两个图片中间有障碍物")

            // p1,p2中间有障碍物
            //那么p1的下面p3是不是空的?
            //如果p3是空的,那么p2的下面p4是不是空的,
            //如果p4是空的,那么p1的下面p3和p2的下面p4能不能连接?
            //如果p3和p4可以连接,那么p1和p2就能连接

            //行列数目
            // let rowsNumber = 10;
            // let columnsNumber = 7;
            for (let k = 1; k <= (columnsNumber - columnExtract(p1)); k++) {

                let p3 = imgEntityExtractFromRowAndcolumn(rowExtract(p1), columnExtract(p1) + k);
                let p4 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p2) + k);
                if (!isImgBackground(p3) || !isImgBackground(p4)) {
                    ////log("239行同一列右路不通")
                    //右路不通
                    break;
                } else {
                    let p3new = new ImgUnit(p3, [rowExtract(p1), columnExtract(p1) + k]);
                    let p4new = new ImgUnit(p4, [rowExtract(p2), columnExtract(p2) + k]);
                    // 判断p3p4是否可以连接
                    if (!obstacleIsThereBetweenP1AndP2("onlineY", p3new, p4new)) {
                        return true;
                    }
                }
            }
            //如果右路不通,那么尝试左路
            // for (let k = (columnsNumber-1); k >= 1; k--){
            for (let k = 1; k <= columnExtract(p1); k++) {

                let p3 = imgEntityExtractFromRowAndcolumn(rowExtract(p1), columnExtract(p1) - k);
                let p4 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p2) - k);
                if (!isImgBackground(p3) || !isImgBackground(p4)) {
                    //右路不通
                    ////log("259行同一列左路不通")

                    break;
                } else {
                    ////log("263行------------")

                    let p3new = new ImgUnit(p3, [rowExtract(p1), columnExtract(p1) - k]);
                    let p4new = new ImgUnit(p4, [rowExtract(p2), columnExtract(p2) - k]);
                    // 判断p3p4是否可以连接
                    ////log("刚才268行传入的参数是p3new,p4new",p3new,p4new)
                    if (!obstacleIsThereBetweenP1AndP2("onlineY", p3new, p4new)) {
                        ////log("270行没有障碍物")
                        return true;
                    } else {
                        ////log("273行有障碍物")

                    }
                }
            }
            return false;
        } else {
            // p1,p2中间没有障碍物
            ////log("两个图片中间没有障碍物")
            return true;
        }
    }
    return false;
}




//=======================重要的代码三行分割线===========================================
// is2ImgThoroughfare(p1, p2)
//==============================================================================================
//=======================同一行列不存在的==============================================================
// 第三种两个图片不在同一列,也不在同一行
// 那么就有上下左右四个方向的连法
function is2ImgThoroughfareUpDownLeftRight(p1, p2) {



    ////log("is2ImgThoroughfareUpDownLeftRight(p1,p2)的参数是",p1,p2)
    //只需要返回是否能连接,不需要点击
    //开始搜索前对p1,p2排序，使p2尽可能的在p1的右下方。
    //这样做可以简化算法
    if (rowExtract(p1) > rowExtract(p2)) {
        let tp = p1;
        p1 = p2;
        p2 = tp;
    } else if (rowExtract(p1) == rowExtract(p2)) {
        if (columnExtract(p1) > columnExtract(p2)) {
            let tp = p1;
            p1 = p2;
            p2 = tp;
        }
    }




    if (columnExtract(p1) < columnExtract(p2)) {
        ////log("p1在左边p2在右边")
        //第一种,从上面开始
        // p1在左上角p2在右下角
        // let p3=imgEntityExtractFromRowAndcolumn(rowExtract(p1),columnExtract(p1)+k);
        // let p4=imgEntityExtractFromRowAndcolumn(rowExtract(p2),columnExtract(p2)+k);
        //p1与p3联系,p2与p4联系
        // for (let k = (rowExtract(p2)-rowExtract(p1)); k >= 1; k--){
        // for (let k = 1; k <= (rowExtract(p2)-rowExtract(p1)); k++){
        // 首先看p2的上面一格p4是不是空的
        let p4Freestyle1 = imgEntityExtractFromRowAndcolumn(rowExtract(p2) - 1, columnExtract(p2));
        ////log("p2上面一格是不是背景:",isImgBackground(p4Freestyle1))
        if (!isImgBackground(p4Freestyle1)) {
            ////log("上路不通1")
            //上路不通
        } else {
            //不仅分左右,上下也要分
            //p1在p2上边
            if (rowExtract(p1) < rowExtract(p2)) {
                ////log("p1高")
                let p4Freestyle2 = imgEntityExtractFromRowAndcolumn(rowExtract(p1), columnExtract(p2));

                if (!isImgBackground(p4Freestyle2)) {
                    ////log("上路不通2")
                    //上路不通
                } else {
                    let p4Freestyle2New = new ImgUnit(p4Freestyle2, [rowExtract(p1), columnExtract(p2)]);

                    if (is2ImgThoroughfare(p4Freestyle2New, p2) && is2ImgThoroughfare(p4Freestyle2New, p1)) {
                        if (!obstacleIsThereBetweenP1AndP2("onlineY", p4Freestyle2New, p2) || !obstacleIsThereBetweenP1AndP2("onlineX", p4Freestyle2New, p1)) {
                            return true;
                        }
                    }

                }
            } else {
                //p1在p2下边
                let p4Freestyle2 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p1));
                if (!isImgBackground(p4Freestyle2)) {
                    ////log("上路不通3")

                    //上路不通
                } else {
                    let p4Freestyle2New = new ImgUnit(p4Freestyle2, [rowExtract(p2), columnExtract(p1)]);

                    if (is2ImgThoroughfare(p4Freestyle2New, p2) && is2ImgThoroughfare(p4Freestyle2New, p1)) {
                        if (!obstacleIsThereBetweenP1AndP2("onlineX", p4Freestyle2New, p2) || !obstacleIsThereBetweenP1AndP2("onlineY", p4Freestyle2New, p1)) {
                            return true;
                        }
                    }

                }

            }
        }
        //下路
        ////log("开始判断下路")
        p4Freestyle1 = imgEntityExtractFromRowAndcolumn(rowExtract(p2) + 1, columnExtract(p2));


        if (!isImgBackground(p4Freestyle1)) {
            ////log("下路不通")
            //下路不通
        } else {
            if (rowExtract(p1) < rowExtract(p2)) {
                ////log("p1在p2上面666")
                p4Freestyle2 = imgEntityExtractFromRowAndcolumn(rowExtract(p1), columnExtract(p2));

                ////log(rowExtract(p2), columnExtract(p1))
                if (!isImgBackground(p4Freestyle2)) {
                    ////log("下路不通")

                    //下路不通
                } else {
                    let p4Freestyle2New = new ImgUnit(p4Freestyle2, [rowExtract(p1), columnExtract(p2)]);

                    if (is2ImgThoroughfare(p4Freestyle2New, p2) && is2ImgThoroughfare(p4Freestyle2New, p1)) {
                        if (!obstacleIsThereBetweenP1AndP2("onlineY", p4Freestyle2New, p2) || !obstacleIsThereBetweenP1AndP2("onlineX", p4Freestyle2New, p1)) {
                            return true;
                        }
                    }
                }
            } else {
                p4Freestyle2 = imgEntityExtractFromRowAndcolumn(rowExtract(p1), columnExtract(p2));
                if (!isImgBackground(p4Freestyle2)) {
                    ////log("下路不通")

                    //下路不通
                } else {
                    let p4Freestyle2New = new ImgUnit(p4Freestyle2, [rowExtract(p1), columnExtract(p2)]);

                    if (is2ImgThoroughfare(p4Freestyle2New, p2) && is2ImgThoroughfare(p4Freestyle2New, p1)) {
                        if (!obstacleIsThereBetweenP1AndP2("onlineY", p4Freestyle2New, p2) || !obstacleIsThereBetweenP1AndP2("onlineX", p4Freestyle2New, p1)) {
                            return true;
                        }
                    }
                }
            }
        }
        //左路
        ////log("开始判断左路")

        p4Freestyle1 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p2) - 1);
        if (!isImgBackground(p4Freestyle1)) {
            ////log("左路不通")
            //左路不通
        } else {
            if (rowExtract(p1) < rowExtract(p2)) {
                ////log("左路p1在上面p2在下面")
                ////log(rowExtract(p2), columnExtract(p1))
                p4Freestyle2 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p1));
                if (!isImgBackground(p4Freestyle2)) {
                    ////log("左路不通")

                    //下路不通
                } else {

                    ////log("========",rowExtract(p2), columnExtract(p1))
                    let p4Freestyle2New = new ImgUnit(p4Freestyle2, [rowExtract(p2), columnExtract(p1)]);

                    if (is2ImgThoroughfare(p4Freestyle2New, p2) && is2ImgThoroughfare(p4Freestyle2New, p1)) {
                        ////log("======通通通==========")
                        if (!obstacleIsThereBetweenP1AndP2("onlineX", p4Freestyle2New, p2) || !obstacleIsThereBetweenP1AndP2("onlineY", p4Freestyle2New, p1)) {
                            return true;
                        }
                    }
                }
            } else {
                p4Freestyle2 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p1));
                if (!isImgBackground(p4Freestyle2)) {
                    ////log("左路不通")

                    //下路不通
                } else {
                    let p4Freestyle2New = new ImgUnit(p4Freestyle2, [rowExtract(p2), columnExtract(p1)]);

                    if (is2ImgThoroughfare(p4Freestyle2New, p2) && is2ImgThoroughfare(p4Freestyle2New, p1)) {
                        if (!obstacleIsThereBetweenP1AndP2("onlineX", p4Freestyle2New, p2) || !obstacleIsThereBetweenP1AndP2("onlineY", p4Freestyle2New, p1)) {
                            return true;
                        }
                    }
                }
            }
        }
        //右路
        ////log("开始判断右路")

        p4Freestyle1 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p2) + 1);
        if (!isImgBackground(p4Freestyle1)) {
            ////log("右路不通")
            //下路不通
        } else {
            if (rowExtract(p1) < rowExtract(p2)) {

                p4Freestyle2 = imgEntityExtractFromRowAndcolumn(rowExtract(p1), columnExtract(p2));
                if (!isImgBackground(p4Freestyle2)) {
                    ////log("右路不通")

                    //下路不通
                } else {
                    let p4Freestyle2New = new ImgUnit(p4Freestyle2, [rowExtract(p1), columnExtract(p2)]);

                    if (is2ImgThoroughfare(p4Freestyle2New, p2) && is2ImgThoroughfare(p4Freestyle2New, p1)) {
                        if (!obstacleIsThereBetweenP1AndP2("onlineY", p4Freestyle2New, p2) || !obstacleIsThereBetweenP1AndP2("onlineX", p4Freestyle2New, p1)) {
                            return true;
                        }
                    }
                }
            } else {
                p4Freestyle2 = imgEntityExtractFromRowAndcolumn(rowExtract(p1), columnExtract(p2));
                if (!isImgBackground(p4Freestyle2)) {
                    ////log("右路不通")

                    //下路不通
                } else {
                    let p4Freestyle2New = new ImgUnit(p4Freestyle2, [rowExtract(p1), columnExtract(p2)]);

                    if (is2ImgThoroughfare(p4Freestyle2New, p2) && is2ImgThoroughfare(p4Freestyle2New, p1)) {
                        if (!obstacleIsThereBetweenP1AndP2("onlineY", p4Freestyle2New, p2) || !obstacleIsThereBetweenP1AndP2("onlineX", p4Freestyle2New, p1)) {
                            return true;
                        }
                    }
                }
            }
        }
    }

    if (columnExtract(p1) > columnExtract(p2)) {

        ////log("p1在右  p2在左")
        //第一种,从上面开始
        // p1在左上角p2在右下角
        // let p3=imgEntityExtractFromRowAndcolumn(rowExtract(p1),columnExtract(p1)+k);
        // let p4=imgEntityExtractFromRowAndcolumn(rowExtract(p2),columnExtract(p2)+k);
        //p1与p3联系,p2与p4联系
        // for (let k = (rowExtract(p2)-rowExtract(p1)); k >= 1; k--){
        // for (let k = 1; k <= (rowExtract(p2)-rowExtract(p1)); k++){
        // 首先看p2的上面一格p4是不是空的

        ////log("开始判断上路")
        let p4Freestyle1 = imgEntityExtractFromRowAndcolumn(rowExtract(p2) - 1, columnExtract(p2));
        ////log(p2)
        if (!isImgBackground(p4Freestyle1)) {
            ////log("上路不通666")
            //上路不通
        } else {
            if (rowExtract(p1) < rowExtract(p2)) {



                let p4Freestyle2 = imgEntityExtractFromRowAndcolumn(rowExtract(p1), columnExtract(p2));
                if (!isImgBackground(p4Freestyle2)) {
                    //上路不通
                } else {

                    let p4Freestyle2New = new ImgUnit(p4Freestyle2, [rowExtract(p1), columnExtract(p2)]);

                    if (is2ImgThoroughfare(p4Freestyle2New, p2) && is2ImgThoroughfare(p4Freestyle2New, p1)) {
                        ////log("进入这里了")
                        ////log(p1,p2,p4Freestyle2New)



                        ////log(obstacleIsThereBetweenP1AndP2("onlineX",p4Freestyle2New, p1))
                        ////log(obstacleIsThereBetweenP1AndP2("onlineY",p4Freestyle2New, p2))



                        if (!obstacleIsThereBetweenP1AndP2("onlineY", p4Freestyle2New, p2) || !obstacleIsThereBetweenP1AndP2("onlineX", p4Freestyle2New, p1)) {
                            return true;
                        }
                    }
                }
            } else {
                let p4Freestyle2 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p1));
                if (!isImgBackground(p4Freestyle2)) {
                    //上路不通
                } else {
                    let p4Freestyle2New = new ImgUnit(p4Freestyle2, [rowExtract(p2), columnExtract(p1)]);

                    if (is2ImgThoroughfare(p4Freestyle2New, p2) && is2ImgThoroughfare(p4Freestyle2New, p1)) {
                        if (!obstacleIsThereBetweenP1AndP2("onlineX", p4Freestyle2New, p2) || !obstacleIsThereBetweenP1AndP2("onlineY", p4Freestyle2New, p1)) {
                            return true;
                        }
                    }
                }
            }
        }
        //下路
        ////log("开始判断下路")

        p4Freestyle1 = imgEntityExtractFromRowAndcolumn(rowExtract(p2) + 1, columnExtract(p2));
        if (!isImgBackground(p4Freestyle1)) {
            //下路不通
        } else {
            if (rowExtract(p1) < rowExtract(p2)) {

                p4Freestyle2 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p1));
                if (!isImgBackground(p4Freestyle2)) {
                    //下路不通
                } else {
                    let p4Freestyle2New = new ImgUnit(p4Freestyle2, [rowExtract(p2), columnExtract(p1)]);

                    if (is2ImgThoroughfare(p4Freestyle2New, p2) && is2ImgThoroughfare(p4Freestyle2New, p1)) {
                        if (!obstacleIsThereBetweenP1AndP2("onlineX", p4Freestyle2New, p2) || !obstacleIsThereBetweenP1AndP2("onlineY", p4Freestyle2New, p1)) {
                            return true;
                        }
                    }
                }
            } else {
                p4Freestyle2 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p1));
                if (!isImgBackground(p4Freestyle2)) {
                    //下路不通
                } else {
                    let p4Freestyle2New = new ImgUnit(p4Freestyle2, [rowExtract(p1), columnExtract(p2)]);

                    if (is2ImgThoroughfare(p4Freestyle2New, p2) && is2ImgThoroughfare(p4Freestyle2New, p1)) {
                        if (!obstacleIsThereBetweenP1AndP2("onlineY", p4Freestyle2New, p2) || !obstacleIsThereBetweenP1AndP2("onlineX", p4Freestyle2New, p1)) {
                            return true;
                        }
                    }
                }
            }
        }
        //左路
        ////log("开始判断左路")

        p4Freestyle1 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p2) - 1);
        if (!isImgBackground(p4Freestyle1)) {
            //下路不通
        } else {
            ////log("1111111================")
            if (rowExtract(p1) < rowExtract(p2)) {
                ////log("p1在上p2在下")
                p4Freestyle2 = imgEntityExtractFromRowAndcolumn(rowExtract(p1), columnExtract(p2));
                if (!isImgBackground(p4Freestyle2)) {
                    ////log("左路不通666666666666666")
                    //左路不通
                } else {
                    // ////log("左路通了666666666666666")

                    let p4Freestyle2New = new ImgUnit(p4Freestyle2, [rowExtract(p1), columnExtract(p2)]);

                    if (is2ImgThoroughfare(p4Freestyle2New, p2) && is2ImgThoroughfare(p4Freestyle2New, p1)) {
                        //两两之间可以连接,但必须有一个是直接连接
                        //也就是说其中一个两两之间没有障碍物
                        //或者第一组或者第二组

                        if (!obstacleIsThereBetweenP1AndP2("onlineY", p4Freestyle2New, p2) || !obstacleIsThereBetweenP1AndP2("onlineX", p4Freestyle2New, p1)) {
                            return true;
                        }




                    }
                }
            } else {
                p4Freestyle2 = imgEntityExtractFromRowAndcolumn(rowExtract(p1), columnExtract(p2));
                if (!isImgBackground(p4Freestyle2)) {
                    //下路不通
                } else {
                    let p4Freestyle2New = new ImgUnit(p4Freestyle2, [rowExtract(p1), columnExtract(p2)]);

                    if (is2ImgThoroughfare(p4Freestyle2New, p2) && is2ImgThoroughfare(p4Freestyle2New, p1)) {
                        if (!obstacleIsThereBetweenP1AndP2("onlineY", p4Freestyle2New, p2) || !obstacleIsThereBetweenP1AndP2("onlineX", p4Freestyle2New, p1)) {
                            return true;
                        }
                    }
                }

            }
        }
        //右路
        ////log("开始判断右路")

        p4Freestyle1 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p2) + 1);
        if (!isImgBackground(p4Freestyle1)) {
            //下路不通
        } else {
            if (rowExtract(p1) < rowExtract(p2)) {
                ////log("p1在上p2在下")
                p4Freestyle2 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p1));
                if (!isImgBackground(p4Freestyle2)) {
                    //下路不通
                } else {
                    ////log("进入这里了")
                    let p4Freestyle2New = new ImgUnit(p4Freestyle2, [rowExtract(p2), columnExtract(p1)]);

                    ////log(is2ImgThoroughfare(p4Freestyle2New, p1))
                    ////log(is2ImgThoroughfare(p4Freestyle2New, p2))


                    if (is2ImgThoroughfare(p4Freestyle2New, p2) && is2ImgThoroughfare(p4Freestyle2New, p1)) {
                        if (!obstacleIsThereBetweenP1AndP2("onlineX", p4Freestyle2New, p2) || !obstacleIsThereBetweenP1AndP2("onlineY", p4Freestyle2New, p1)) {
                            return true;
                        }
                    }
                }
            } else {
                p4Freestyle2 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p1));
                if (!isImgBackground(p4Freestyle2)) {
                    //下路不通
                } else {
                    let p4Freestyle2New = new ImgUnit(p4Freestyle2, [rowExtract(p2), columnExtract(p1)]);

                    if (is2ImgThoroughfare(p4Freestyle2New, p2) && is2ImgThoroughfare(p4Freestyle2New, p1)) {
                        if (!obstacleIsThereBetweenP1AndP2("onlineX", p4Freestyle2New, p2) || !obstacleIsThereBetweenP1AndP2("onlineY", p4Freestyle2New, p1)) {
                            return true;
                        }
                    }
                }


            }
        }
    }
    return false;
}



// 最后一种z形连接


function is2ImgThoroughfareZ(p1, p2) {
    // 形状p1在上p2在下
    //
    // 已经确定值适用于该种图形
    // __
    //   |__
    ////log("910行===is2ImgThoroughfareZ(p1, p2)的参数是",p1,p2)
    //只需要返回是否能连接,不需要点击
    //开始搜索前对p1,p2排序，使p2尽可能的在p1的右下方。
    //这样做可以简化算法
    if (rowExtract(p1) > rowExtract(p2)) {
        let tp = p1;
        p1 = p2;
        p2 = tp;
    } else if (rowExtract(p1) == rowExtract(p2)) {
        if (columnExtract(p1) > columnExtract(p2)) {
            let tp = p1;
            p1 = p2;
            p2 = tp;
        }
    }
    ////log("p1在p2的左边")
    ////log("p3",rowExtract(p1), columnExtract(p1) + 1)
    ////log("p4",rowExtract(p2), columnExtract(p2) - 1)
    let p3 = imgEntityExtractFromRowAndcolumn(rowExtract(p1), columnExtract(p1) + 1);
    let p4 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p2) - 1);



    if (!isImgBackground(p3) || !isImgBackground(p4)) {
        //不能Z形连接
        return false;
    } else {
        // 判断p3p4和p5是否可以直连
        //p3和p5不能有障碍物
        //p4和p5不能有障碍物
        //循环次数为p2-p1-3
        let cycleTimes = columnExtract(p2) - columnExtract(p1)
        for (let k = 1; k < cycleTimes; k++) {

            let p3 = imgEntityExtractFromRowAndcolumn(rowExtract(p1), columnExtract(p1) + k);
            let p3new = new ImgUnit(p3, [rowExtract(p1), columnExtract(p1) + k]);
            let p4new = new ImgUnit(p4, [rowExtract(p2), columnExtract(p2) - 1]);
            if (!obstacleIsThereBetweenP1AndP2WithSelf(p3new, p4new)) {
                return true;
            }



            let p5 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p3new));
            let p5new = new ImgUnit(p5, [rowExtract(p2), columnExtract(p3new)]);



            if (isImgBackground(p3) && isImgBackground(p5)) {

                if (obstacleIsThereBetweenP1AndP2("onlineY", p3new, p5new) || obstacleIsThereBetweenP1AndP2("onlineX", p4new, p5new)) {

                } else {
                    return true;
                }

            } else {
                return false;
            }



        }
        return false;


    }

}









function is2ImgThoroughfareZ1(p1, p2) {
    ////log("is2ImgThoroughfareZ1(p1, p2) ",p1,p2)
    // 形状p1在上p2在下
    //
    // __|ˉˉˉ
    ////log("910行===is2ImgThoroughfareZ(p1, p2)的参数是",p1,p2)
    //只需要返回是否能连接,不需要点击
    //开始搜索前对p1,p2排序，使p2尽可能的在p1的右下方。
    //这样做可以简化算法
    if (rowExtract(p1) > rowExtract(p2)) {
        let tp = p1;
        p1 = p2;
        p2 = tp;
    } else if (rowExtract(p1) == rowExtract(p2)) {
        if (columnExtract(p1) > columnExtract(p2)) {
            let tp = p1;
            p1 = p2;
            p2 = tp;
        }
    }
    ////log("p1在p2的左边")
    ////log("p3",rowExtract(p1), columnExtract(p1) + 1)
    ////log("p4",rowExtract(p2), columnExtract(p2) - 1)
    let p3 = imgEntityExtractFromRowAndcolumn(rowExtract(p1), columnExtract(p1) - 1);
    let p4 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p2) + 1);

    if (!isImgBackground(p3) || !isImgBackground(p4)) {
        // ////log("进入if")
        //不能Z形连接
        return false;
    } else {
        ////log("进入else")

        // 判断p3p4和p5是否可以直连
        //p3和p5不能有障碍物
        //p4和p5不能有障碍物
        //循环次数为p2-p1-3
        let cycleTimes = rowExtract(p2) - rowExtract(p1)
        ////log("cycleTimes=",cycleTimes)
        for (let k = 1; k < cycleTimes; k++) {
            ////log("kkkkkk=========",k)
            let p3 = imgEntityExtractFromRowAndcolumn(rowExtract(p1), columnExtract(p1) - k);
            let p3new = new ImgUnit(p3, [rowExtract(p1), columnExtract(p1) - k]);
            let p4new = new ImgUnit(p4, [rowExtract(p2), columnExtract(p2) + 1]);
            if (!obstacleIsThereBetweenP1AndP2WithSelf(p3new, p4new)) {
                return true;
            }
            let p5 = imgEntityExtractFromRowAndcolumn(rowExtract(p2), columnExtract(p3new));
            let p5new = new ImgUnit(p5, [rowExtract(p2), columnExtract(p3new)]);



            if (isImgBackground(p3) && isImgBackground(p5)) {
                ////log("进入if666")
                ////log(p3new, p5new)
                if (obstacleIsThereBetweenP1AndP2("onlineY", p3new, p5new) || obstacleIsThereBetweenP1AndP2("onlineX", p4new, p5new)) {
                    ////log("进入if6688888888886")

                } else {
                    ////log("进else6688888888886")

                    return true;
                }

            } else {
                ////log("进入else666")

                return false;
            }



        }
        return false;


    }

}









// 最后一种z形连接
function is2ImgThoroughfareZ2(p1, p2) {
    ////log(p1,p2)
    // 形状p1在上p2在下
    // |__
    //    |
    ////log("910行===is2ImgThoroughfareZ(p1, p2)的参数是",p1,p2)
    //只需要返回是否能连接,不需要点击
    //开始搜索前对p1,p2排序，使p2尽可能的在p1的右下方。
    //这样做可以简化算法
    if (rowExtract(p1) > rowExtract(p2)) {
        let tp = p1;
        p1 = p2;
        p2 = tp;
    } else if (rowExtract(p1) == rowExtract(p2)) {
        if (columnExtract(p1) > columnExtract(p2)) {
            let tp = p1;
            p1 = p2;
            p2 = tp;
        }
    }
    ////log("p1在p2的左边")
    ////log("p3",rowExtract(p1), columnExtract(p1) + 1)
    ////log("p4",rowExtract(p2), columnExtract(p2) - 1)
    let p3 = imgEntityExtractFromRowAndcolumn(rowExtract(p1) + 1, columnExtract(p1));
    let p4 = imgEntityExtractFromRowAndcolumn(rowExtract(p2) - 1, columnExtract(p2));

    if (!isImgBackground(p3) || !isImgBackground(p4)) {
        ////log("p3或者p4不是背景")
        //不能Z形连接
        return false;
    } else {
        ////log("p3p4都是背景")

        // 判断p3p4和p5是否可以直连
        //p3和p5不能有障碍物
        //p4和p5不能有障碍物
        //循环次数为p2-p1-3
        let cycleTimes = rowExtract(p2) - rowExtract(p1)
        ////log("循环次数=",cycleTimes)
        for (let k = 1; k < cycleTimes; k++) {

            let p3 = imgEntityExtractFromRowAndcolumn(rowExtract(p1) + k, columnExtract(p1));
            let p3new = new ImgUnit(p3, [rowExtract(p1) + k, columnExtract(p1)]);
            let p4new = new ImgUnit(p4, [rowExtract(p2) - 1, columnExtract(p2)]);
            if (!obstacleIsThereBetweenP1AndP2WithSelf(p3new, p4new)) {
                return true;
            }
            let p5 = imgEntityExtractFromRowAndcolumn(rowExtract(p3new), columnExtract(p2));
            let p5new = new ImgUnit(p5, [rowExtract(p3new), columnExtract(p4new)]);



            if (isImgBackground(p3) && isImgBackground(p5)) {

                if (obstacleIsThereBetweenP1AndP2("onlineX", p3new, p5new) || obstacleIsThereBetweenP1AndP2("onlineY", p4new, p5new)) {

                } else {
                    return true;
                }

            } else {
                return false;
            }



        }
        return false;



    }

}
// 最后一种z形连接
function is2ImgThoroughfareZ3(p1, p2) {
    //     __|
    //    |


    ////log("1066行is2ImgThoroughfareZ3(p1, p2) ",p1,p2)
    ////log("395行===is2ImgThoroughfareZ(p1, p2)的参数是",p1,p2)
    //只需要返回是否能连接,不需要点击
    //开始搜索前对p1,p2排序，使p2尽可能的在p1的右下方。
    //这样做可以简化算法
    if (rowExtract(p1) > rowExtract(p2)) {
        let tp = p1;
        p1 = p2;
        p2 = tp;
    } else if (rowExtract(p1) == rowExtract(p2)) {
        if (columnExtract(p1) > columnExtract(p2)) {
            let tp = p1;
            p1 = p2;
            p2 = tp;
        }
    }
    ////log("ZZZ中判断的p1,p2是",p1,p2)
    // ////log("希望是3 2  1 6")

    let p3 = imgEntityExtractFromRowAndcolumn(rowExtract(p1) + 1, columnExtract(p1));
    let p4 = imgEntityExtractFromRowAndcolumn(rowExtract(p2) - 1, columnExtract(p2));
    if (!isImgBackground(p3) || !isImgBackground(p4)) {
        //不能Z形连接
        return false;
    } else {
        // 判断p3p4和p5是否可以直连
        //p3和p5不能有障碍物
        //p4和p5不能有障碍物
        //循环次数为p2-p1-3
        let cycleTimes = rowExtract(p2) - rowExtract(p1)
        ////log("循环次数=",cycleTimes)
        for (let k = 1; k < cycleTimes; k++) {




            ////log("rowExtract(p1)=",rowExtract(p1))
            ////log("k=",k)
            ////log("let p3 = imgEntityExtractFromRowAndcolumn(rowExtract(p1)+1+k, columnExtract(p1));",rowExtract(p1)+1+k, columnExtract(p1))


            let p3 = imgEntityExtractFromRowAndcolumn(rowExtract(p1) + k, columnExtract(p1));
            let p3new = new ImgUnit(p3, [rowExtract(p1) + k, columnExtract(p1)]);
            let p4new = new ImgUnit(p4, [rowExtract(p2) - 1, columnExtract(p2)]);

            if (!obstacleIsThereBetweenP1AndP2WithSelf(p3new, p4new)) {
                return true;
            }
            let p5 = imgEntityExtractFromRowAndcolumn(rowExtract(p3new), columnExtract(p2));
            let p5new = new ImgUnit(p5, [rowExtract(p3new), columnExtract(p2)]);



            if (isImgBackground(p3) && isImgBackground(p5)) {

                if (obstacleIsThereBetweenP1AndP2("onlineX", p3new, p5new) || obstacleIsThereBetweenP1AndP2("onlineY", p4new, p5new)) {

                } else {
                    return true;
                }

            } else {
                return false;
            }



        }
        return false;



    }
}





//==============================================================================================
//================小小的专一函数===========================================
//有没有障碍物
//有返回true
//没有返回false
//默认有障碍物true
function obstacleIsThereBetweenP1AndP2(xy, p1, p2) {
    // if(!(rowExtract(p1)==2 && columnExtract(p1)==1 && rowExtract(p2)==2 && columnExtract(p2)==4)){return;}

    ////log("obstacleIsThereBetweenP1AndP2(xy,p1, p2)传入参数是\n",xy,p1,p2);
    // exit()
    //两个图片中间有没有障碍物,默认有障碍物(return true;)
    if (xy == "onlineX") {
        ////log("834行同一行\n",p1,p2)
        // exit()
        let i = columnExtract(p1) > columnExtract(p2) ? columnExtract(p2) : columnExtract(p1);
        i = i + 1;
        ////log("i=",i)
        let max = columnExtract(p1) > columnExtract(p2) ? columnExtract(p1) : columnExtract(p2);
        ////log("max=",max)

        ////log("p1=======================",p1)
        for (; i < max; i++) {
            let p = {
                x: rowExtract(p1),
                y: i
            };
            ////log("期望2 2       2  3 ")
            ////log("849行i,p.x,p.y",i,p.x,p.y,isImgBackground(imgEntityExtractFromRowAndcolumn(p.x, p.y)))



            if (!isImgBackground(imgEntityExtractFromRowAndcolumn(p.x, p.y))) {
                ////log("433行有障碍物")
                return true;
            } else {
                ////log("436行没有障碍物")
            }
        }
        ////log("i == max",i , max)
        if (i == max) {
            ////log("607行同一行可以连通,没有障碍物\n",p1,p2)
            // exit()
            return false;
        }

    } else if (xy == "onlineY") {
        ////log("877行同一列\n",p1,p2)

        let i = rowExtract(p1) > rowExtract(p2) ? rowExtract(p2) : rowExtract(p1);
        i = i + 1;
        let max = rowExtract(p1) > rowExtract(p2) ? rowExtract(p1) : rowExtract(p2);
        for (; i < max; i++) {
            let p = {
                x: i,
                y: columnExtract(p1)
            };
            if (!isImgBackground(imgEntityExtractFromRowAndcolumn(p.x, p.y))) {
                return true;
            }
        }
        if (i == max) {
            return false;
        }
    } else {
        ////log("obstacleIsThereBetweenP1AndP2函数传入参数错误!");
        exit();
    }
    return true;

}








function obstacleIsThereBetweenP1AndP2WithSelf(p1, p2) {
    //开始搜索前对p1,p2排序，使p2尽可能的在p1的右下方。
    //这样做可以简化算法
    if (rowExtract(p1) > rowExtract(p2)) {
        let tp = p1;
        p1 = p2;
        p2 = tp;
    } else if (rowExtract(p1) == rowExtract(p2)) {
        if (columnExtract(p1) > columnExtract(p2)) {
            let tp = p1;
            p1 = p2;
            p2 = tp;
        }
    }
    //两个都必须是背景才有可能返回false
    //如果都是背景并且挨着那么返回false
    //默认返回true
    let p1Img = imgEntityExtract(p1)
    let p2Img = imgEntityExtract(p2)

    if (isImgBackground(p1Img) && isImgBackground(p2Img)) {

        // 同一行挨着
        if (rowExtract(p1) == rowExtract(p2) && columnExtract(p2) - columnExtract(p1) == 1) {
            return false

        }




        // 同一列挨着
        if (columnExtract(p1) == columnExtract(p2) && rowExtract(p2) - rowExtract(p1) == 1) {
            return false

        }

    }






    return true;


    // // if(!(rowExtract(p1)==2 && columnExtract(p1)==1 && rowExtract(p2)==2 && columnExtract(p2)==4)){return;}

    // ////log("obstacleIsThereBetweenP1AndP2(xy,p1, p2)传入参数是\n",xy,p1,p2);
    // // exit()
    // //两个图片中间有没有障碍物,默认有障碍物(return true;)
    // if (xy == "onlineX") {
    //     ////log("834行同一行\n",p1,p2)
    //     // exit()
    //     let i = columnExtract(p1) > columnExtract(p2) ? columnExtract(p2) : columnExtract(p1);
    //     i = i + 1;
    //     ////log("i=",i)
    //     let max = columnExtract(p1) > columnExtract(p2) ? columnExtract(p1) : columnExtract(p2);
    //     ////log("max=",max)

    //     ////log("p1=======================",p1)
    //     for (; i < max; i++) {
    //         let p = {
    //             x: rowExtract(p1),
    //             y: i
    //         };
    //         ////log("期望2 2       2  3 ")
    //         ////log("849行i,p.x,p.y",i,p.x,p.y,isImgBackground(imgEntityExtractFromRowAndcolumn(p.x, p.y)))



    //         if (!isImgBackground(imgEntityExtractFromRowAndcolumn(p.x, p.y))) {
    //             ////log("433行有障碍物")
    //             return true;
    //         }else{
    //             ////log("436行没有障碍物")
    //         }
    //     }
    //     ////log("i == max",i , max)
    //     if (i == max) {
    //         ////log("607行同一行可以连通,没有障碍物\n",p1,p2)
    //         // exit()
    //         return false;
    //     }

    // } else if (xy == "onlineY") {
    //     ////log("877行同一列\n",p1,p2)

    //     let i = rowExtract(p1) > rowExtract(p2) ? rowExtract(p2) : rowExtract(p1);
    //     i = i + 1;
    //     let max = rowExtract(p1) > rowExtract(p2) ? rowExtract(p1) : rowExtract(p2);
    //     for (; i < max; i++) {
    //         let p = {
    //             x: i,
    //             y: columnExtract(p1)
    //         };
    //         if (!isImgBackground(imgEntityExtractFromRowAndcolumn(p.x, p.y))) {
    //             return true;
    //         }
    //     }
    //     if (i == max) {
    //         return false;
    //     }
    // } else {
    //     ////log("obstacleIsThereBetweenP1AndP2函数传入参数错误!");
    //     exit();
    // }
    // return true;

}


















function imgEntityExtract(p) {
    return p.imgEntity;
}

function imgEntityExtractFromRowAndcolumn(row, column) {
    ////log("1222行imgEntityExtractFromRowAndcolumn(row,column)的参数是",row,column)
    ////log("planePicture.length=",planePicture.length)
    ////log("row, column",row, column)
    return planePicture[row][column];
}

function rowExtract(p) {
    ////log("556行传入的图片是",p)
    return p.imgRowAndcolumn[0];
}

function columnExtract(p) {
    return p.imgRowAndcolumn[1];
}

function imgDestroy(p1, p2) {
    // ////log("imgDestroy(p1, p2) 被调用");
    imgClickP1P2(p1, p2);
}

function imgClickP1P2(p1, p2) {
    let x1 = CoordinateFromImg(p1)[0];
    let y1 = CoordinateFromImg(p1)[1];
    let x2 = CoordinateFromImg(p2)[0];
    let y2 = CoordinateFromImg(p2)[1];
    let t = 1;
    // click(537,236);
    sleep(t);
    ////log("绝对坐标是******",x1,y1,x2,y2,"两张图片是\n",p1,p2);
    click(x1, y1);
    sleep(t);
    click(x2, y2);
    sleep(t);
}

//传入行列返回坐标
function CoordinateFromImg(p1) {
    let x1 = p1.imgRowAndcolumn[0];
    let y1 = p1.imgRowAndcolumn[1];
    let x = imgFistCenterCoordinate[0] + (y1 - 1) * SpacingLeftAndRight;
    let y = imgFistCenterCoordinate[1] + (x1 - 1) * SpacingUpAndDown;
    return [x, y];
}

function onlineX(p1, p2) {
    let y1 = p1.imgRowAndcolumn[0];
    let y2 = p2.imgRowAndcolumn[0];
    // let x1=p1.imgRowAndcolumn[0];
    // let y1=p1.imgRowAndcolumn[1];
    // let x2=p2.imgRowAndcolumn[0];
    // let y2=p2.imgRowAndcolumn[1];
    return y1 == y2;
}

function onlineY(p1, p2) {
    let x1 = p1.imgRowAndcolumn[1];
    let x2 = p2.imgRowAndcolumn[1];
    return x1 == x2;
}

function p1NextToP2(xy, p1, p2) {
    ////log("484行p1NextToP2(xy,p1, p2)的参数是\n",xy,p1, p2)
    let x1 = p1.imgRowAndcolumn[0];
    let y1 = p1.imgRowAndcolumn[1];
    let x2 = p2.imgRowAndcolumn[0];
    let y2 = p2.imgRowAndcolumn[1];
    if (xy == "onlineX") {

        let result = Math.abs(y1 - y2);
        ////log("491行的参数xy是",xy,"\n","result=",result,"x1=",x1,"x2=",x2)
        if (result == 1) {
            return true;
        }
    } else if (xy == "onlineY") {
        let result = Math.abs(x1 - x2);
        if (result == 1) {
            return true;
        }
    } else {
        ////log("p1NextToP2函数传入参数错误!");
        exit();
    }
    return false;
}
// isImgBackground(p)
//=====================================================================

function warehouseReorganize() {
    // 第一步 图片分类
    let imgCaptureScreen = captureScreen();
    sleep(50);
    for (let j = 1; j <= rowsNumber; j++) {
        for (let k = 1; k <= columnsNumber; k++) {
            // ////log(j, "行", k, "列");
            // 只保存有效图片(即非背景图片)
            let imgRowAndcolumn = [j, k];

            let screenshotRegion = [imgFistCenterCoordinate[0] + (k - 1) * SpacingLeftAndRight - imgWidthHeight2[0], imgFistCenterCoordinate[1] + (j - 1) * SpacingUpAndDown - imgWidthHeight2[1], imgWidthHeight[0], imgWidthHeight[1]];
            let imgEntity = images.clip(imgCaptureScreen, screenshotRegion[0], screenshotRegion[1], screenshotRegion[2], screenshotRegion[3]);

            if (isImgBackground(imgEntity)) {
                // ////log("是背景图,跳出本次循环","行列===",j,k)
                continue;
            }
            planePicture[j][k] = imgEntity;
            imgDiscern = new ImgUnit(imgEntity, imgRowAndcolumn);
            if (warehouse.length == 0) {
                warehouse.push([]);
                warehouse[0].push(imgDiscern);
                imgSave(imgEntity);
            } else {
                let len = warehouse.length;
                let found = false;
                for (let j = 0; j < len; j++) {
                    let p1 = warehouse[j][0].imgEntity;
                    let p2 = imgEntity;
                    if (is2ImgSame(p1, p2)) {
                        warehouse[j].push(imgDiscern);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    warehouse.push([imgDiscern]);
                    imgSave(imgEntity);

                }
            }
        }
    }
    ////log("仓库中图片数量",warehouse.length);

}

function imgSave(p) {
    // // 保存连连看小图片
    // let sj = new Date().getTime();
    // let path = "/sdcard/js截图2/" + sj + ".png";
    // // ////log(p);
    // // ////log(path);
    // images.save(p, path);
    // // ////log("已保存小截图");
}










function is2ImgSame(p1, p2) {
    // ////log("p1=======",p1);
    // ////log("p2=======",p2);
    if (!p1 || !p2) {
        return false;
    }




    // p1包含p2
    //在p1中找p2
    //p2Smaller是30X30的p2
    let p2Smaller = images.clip(p2, 18, 10, 30, 30);
    let result = images.findImage(p1, p2Smaller);
    if (result == null) {
        return false;
    } else {
        return true;
    }
}


// 是否背景色图
function isImgBackground(p) {
    if (!p) {
        return true;
    }
    let len = imgBackground.length;
    for (let j = 0; j < len; j++) {
        let colorAndCoordinate = imgBackgroundFivePoint(imgBackground[j]);
        // ////log("五指山是:\n",colorAndCoordinate[0],"\n", colorAndCoordinate[1]);
        // ////log("557行isImgBackground方法","参数分别是",p, colorAndCoordinate[0], colorAndCoordinate[1]);
        let result = images.findMultiColors(p, colorAndCoordinate[0], colorAndCoordinate[1]);
        // ////log("第",j,"个背景图的判断结果是",result);
        if (result != null) {
            return true;
        }
    }
    return false;
}

function imgBackgroundFivePoint(p) {
    const pointFive = [
        [1, 1],
        [11, 1],
        [1, 11],
        [21, 11],
        [11, 21]
    ];
    const pointfour = [
        [10, 0],
        [0, 10],
        [20, 10],
        [10, 20]
    ];
    let pointColors = [];
    for (let j = 0; j < 5; j++) {
        pointColors[j] = images.pixel(p, pointFive[j][0], pointFive[j][1]);
    }
    let result = [];
    result[0] = pointColors[0];
    result[1] = [
        [pointfour[0][0], pointfour[0][1], pointColors[1]],
        [pointfour[1][0], pointfour[1][1], pointColors[2]],
        [pointfour[2][0], pointfour[2][1], pointColors[3]],
        [pointfour[3][0], pointfour[3][1], pointColors[4]]

    ];
    return result;
    // 返回这样的格式 第一个点到额颜色  和其余点的坐标和颜色
    // "#123456", [[10, 20, "#ffffff"], [30, 40, "#000000"]]
}