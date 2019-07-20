/*
@Author:VocPython
@Data:Oct,18 2018

	*表示不稳定或尚未完善
	#表示已移除或使用新方案替代

debug-1_Oct,18 2018
    添加 自动取色
    添加 通过console选择球色（console控制）
    优化 取色速度
    修复 偶尔获取台外坐标的bug
    *[Debug]添加 自瞄(debug)
    *优化 多线程寻色
    #添加 console实时交互
    #添加 若干bug
    #添加 悬浮窗
    #优化 简化交互操作
    
debug-2_Oct,19 2018
    添加 弹出菜单式交互
    优化 彩球坐标算法
    修复 偶尔截屏失败的bug
    修复 部分机型自瞄无效的bug   
    *添加 辅助线
    #优化 对16:9屏幕的支持
	
debug-3_Oct,19 2018
    添加 手动定点
    移除 console控制（低效）
    *添加 悬浮窗快捷操作
    *优化 辅助线精度
    *优化 辅助线不再使用httpImg
    *[Debug] Float Button
    *辅助线旋转
    *辅助线位置

debug-4_Oct,20 2018
	优化 优化彩球坐标算法
	优化 取彩球坐标时可视化

BilliardDrawing powered by VocPython

*/


/*
	目前需要解决的问题{  
		(按重要程度排序)
		1.区域截屏 防止取屏幕外颜色(致命错误)
		2.画布透明 以用于绘制函数(后续判断障碍球)
		3.判断障碍球 识别球体碰撞
		4.碰撞反弹判定
		5.按分值大小来判断击打某彩球
		6.预判击球后白球的落脚点 并计算下一杆打法
	}
*/

//"ui";
"auto";
setScreenMetrics(1080, 2160);//屏幕分辨率

//颜色代码
const main = 0xfff4da;
const red = 0xc23629;
const yellow = 0xe9d618;
const green = 0x0a825f;
const brown = 0x5f3c26;
const blue = 0x2a4982;
const pink = 0xf58db2;
const black = 0x12171a;

const ballRadius = 21; //球半径

//球台边缘坐标 已经和小球半径相加 以便于计算反弹
const left_x = 315;  //左边缘  实际值293
const top_y = 215;   //上边缘
const right_x = 0;   //右边缘
const bottom_y = 0;  //下边缘


launcher();



//控制台交互模式 考虑废弃使用新方案替代
/*console.show();
log("Loading...");
createFloaty();

console.setSize(100, 1000);  //设置悬浮控制台窗口大小
*/
/*
do {
    log("Input color codes.");
    
        log("1.findBall");
        log("2.findColor");
        
    var cmd = console.rawInput();
    if(cmd = "findBall"){
        log("FindColorCodes");
        var cmdColor = console.rawInput();
        findBall(cmdColor);
    }
    
} while (cmd != "exit");
*/

	//主方法
function launcher(){
    toast("Everything is ready！");

	//旧版控制台交互的方法
    /*var clickStart = console.rawInput(); //console接受到的数据
    if (clickStart != "exit") {}
		//选择菜单
				dialogs.select(title, 0, 1, 2, 3);
	*/
	
        var menuSelect = dialogs.select("Select Menu", "锁袋", "自瞄(尚未完善)", "主球反弹辅助线", "调试模式", "*全自动模式(实验性功能 非AI)","5","6","反馈BUG");
        if (menuSelect == -1) {} //退出时执行的代码
		if (menuSelect == 0) {
			toast("暂未开放");
		}
        if (menuSelect == 1) {
            toast("锁色自瞄");
            log("colorSelect Load");
            var colorSelect = dialogs.select("Balls Select Menu", "Red", "Yellow", "Green", "Brown", "Blue", "pink", "black", "*假装失误(实验性功能)");

            if (colorSelect == 0) {
                toast("red");
                log("scanRed");
                click(findBall(red));
            }
            if (colorSelect == 1) {
                toast("yellow");
                click(findBall(yellow));
            }
			if (colorSelect == 2){
				toast("green");
				click(findBall(green));
			}
			if (colorSelect == 3){
				toast("brown");
				click(findBall(brown));
			}
			if (colorSelect == 4){
				toast("blue");
				click(findBall(blue));
			}
			if (colorSelect == 5){
				toast("pink");
				click(findBall(pink));
			}
			if (colorSelect == 6){
				toast("black");
				click(findBall(black));
			}
			if (colorSelect == 7){
				toast("");
				//click(findBall());
			}
        }
        if (menuSelect == 2) {
            toast("测试功能 暂不开放")
            createLine();
        }
        if (menuSelect == 3) {
            console.show();
        }
		if (menuSelect == 4) {
			//显示一个弹出式通知
			alert("vip功能")
			
			//启动方法
			//autoAll();
		}
		if (menuSelect == 8) {
			//反馈BUG
		}
}


//用于获取触屏坐标的方法 以便自定义击球
//暂未完善
function getClick() {
    
    requestScreenCapture();
    console.show();
    events.observeTouch();
    events.setTouchEventTimeout(30);
    events.on("touch", function(point) {
        log("(" + point.x + ", " + point.y + ")");
		
		return(point.x, point.y);
    });
}

//悬浮直线方法 传入坐标与旋转角度
function createLine(x, y, z) {
    log("执行createLine方法");

    var line = floaty.rawWindow(
        <frame h="*" w="*">
            <button h="10" w="10" id="line" rotation="45"  text="" bg="#ffff0000" />
        </frame>
    );
	log("已创建rawWindows 'line'");
    //设置悬浮窗位置
    line.setPosition(300, 500);
	log("line.setPositon" + "(" + x +", " + y + ")");
	
    //设置不可触摸（传输触摸数据到下层）
    line.setTouchable(false);
    log("line.setTouchable = 1");
    log("createLine successful !");

    setTimeout(() => {
        line.close();
    }, 5000);
}

//寻找球坐标并click
function findBall(colorCode) {
	
    log("执行findBall方法");
    if (!requestScreenCapture()) {
        toast("啊哦 出现了一个致命错误(e-rs)");
		log("requestScreen failed")
        exit();
    }
    log("请求Screen成功");
    sleep(200); //延时200ms以防止部分设备截屏速度过慢

    var img	= captureScreen();
    var point = findColor(img, colorCode);
	
    log("开始寻色");
    sleep(100); //别让手机太累了
    if (point) {
        log("寻色完成");
        log("x = " + point.x + ", y = " + point.y + "  颜色代码：" + colorCode);
        //反馈坐标
        //createLine();
        sleep(300);
        
            //创建悬浮红点指示器
            var mark = floaty.rawWindow(
            <frame h="10" w="10">
                <button h="10" w="10" id="line" rotation="45"  text="" bg="#ffff6699" />
            </frame>
				);
        mark.setPosition(point.x-5, point.y-5)
		
		log("模拟准星");
		
		sleep(1000);
        click(point.x, point.y);
        log("模拟瞄准")
		
        setTimeout(() => {
            mark.close();
        }, 5000);
    
    } else {
        toast("啊哦 出现了一个错误 请截屏反馈给开发者(e-fc)");
    }
}

//计算球碰撞到边框的反弹
function bound(boundAngle) {
	
}

//计算主球与球的碰撞
function collision(collision) {
	
}