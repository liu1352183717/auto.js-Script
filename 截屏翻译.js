importClass(android.graphics.BitmapFactory);
importClass(android.graphics.drawable.BitmapDrawable);
importClass(android.graphics.Bitmap);
importClass(android.graphics.Paint);
importClass(android.graphics.Color);
importClass(android.widget.RelativeLayout);
importClass(android.widget.RelativeLayout.LayoutParams);
var adjustFloaty,controlFloaty,textFloaty;
var adjustXStart=0,adjustYStart=0;
var adjustXEnd=0,adjustYEnd=0;
var adjusting=false;
var debug=true;
var btn_downtime,btn_x,btn_y;
var save_path="/sdcard/0000/";
var cliped=false;
var already=false;

//百度SDK　http://ai.baidu.com/docs#/OCR-API/e1bd77f3
//源语言 可选 CHN_ENG、ENG、POR、FRE、GER、ITA、SPA、RUS、JAP、KOR
var source_lng="CHN_ENG";

var API_KEY="L3zSSw0QGeSASNUNWdMuTbjk";
var SECRET_KEY="2lSH3fIGbS4Vk4GHX9Zu2cULVUVb92pC";
var token;
init();
function drawArea(){
    //toastLog(adjustXStart+","+adjustYStart+","+adjustXEnd+","+adjustYEnd);
    var bmp=Bitmap.createBitmap(adjustFloaty.getWidth(),adjustFloaty.getHeight(),Bitmap.Config.ARGB_8888);
    var canvas=new Canvas(bmp);
    var paint =new Paint();
    paint.setColor(Color.RED);
    paint.setAlpha(255);//透明度0-255
    paint.setStyle(Paint.Style.STROKE);//设置为描边 Paint.Style.FILL Paint.Style.FILL_AND_STROKE
    paint.setStrokeWidth(5);
    canvas.drawRect(adjustXStart,adjustYStart,adjustXEnd,adjustYEnd,paint);
    setBackgroundBitmap(bmp,adjustFloaty.ff);
    //bmp.recycle();
};
function setBackgroundBitmap(bmp,view){
    view.setBackgroundDrawable(new BitmapDrawable(bmp));
}
function setBackgroundColor(color,view) {
    ui.run(function(){
        view.setBackgroundColor(color);}
    )
}

function init() {
    token=getAccessToken(API_KEY,SECRET_KEY);
    if(!requestScreenCapture()){
        toast("请求截图权限失败,无法继续运行!");
        exit();
    }
    if(debug){
        files.ensureDir(save_path);
    }
    events.observeKey();
    initFloaty();
    //btn1_onClick();
}

function btn1_onClick(){
    //toast("click");
    if(adjusting){
        if(!(adjustXStart==0||adjustYStart==0||adjustXEnd==0||adjustYEnd==0))
            already=true;
        setBackgroundColor(colors.argb(0,0,0,0),adjustFloaty.rl);
        adjustFloaty.setTouchable(false);
        adjusting=false;
        return;
    }else{
        already=false;
        setBackgroundColor(colors.argb(200,0,0,0),adjustFloaty.rl);
        adjustFloaty.setTouchable(true);
        adjusting=true;
        return;
    }
}
function initFloaty(){
    if(adjustFloaty!=null){
        adjustFloaty.close();//关闭悬浮窗避免悬浮窗重叠
    }
    adjustFloaty = floaty.rawWindow(
        <RelativeLayout id="rl" w="*" h="*">
            <frame id="ff" w="*" h="*"></frame>
        </RelativeLayout>
    );
    controlFloaty=floaty.rawWindow(
        <LinearLayout w="auto" h="auto">
            <vertical>
                <button textSize="10sp" margin="0" w="auto" h="auto" id="btn1" text="框选区域"></button>
                <button textSize="10sp" id="btn2" text="翻译语言"></button>
                <button textSize="10sp" id="btn3" text="▲▲▲ 收缩"></button>
            </vertical>
        </LinearLayout>
    );
    textFloaty=floaty.rawWindow(
        <linear gravity="center" background="#22000000">
            <text id="show" w="auto" textColor="#FF0000" text="这里会显示翻译的文字" layout_gravity="center"></text>
        </linear>
    );
    setBackgroundColor(colors.argb(0,0,0,0),adjustFloaty.rl);//透明度0-1
    controlFloaty.setPosition(20,100);
    adjustFloaty.setSize(-1, -1);
    adjustFloaty.setTouchable(false);
    controlFloaty.btn1.setOnTouchListener(function(view,event){
        switch(event.getAction()){
            case event.ACTION_DOWN://按下手指
                btn_x=parseInt(event.getRawX());
                btn_y=parseInt(event.getRawY());
                return true;
            case event.ACTION_MOVE://移动
                var x=parseInt(event.getRawX()-controlFloaty.btn1.getWidth()/2);
                var y=parseInt(event.getRawY()-controlFloaty.btn1.getHeight()/2);
                controlFloaty.setPosition(x,y);
                return true;
            case event.ACTION_UP://松开
                var x=parseInt(event.getRawX());
                var y=parseInt(event.getRawY());
                if(Math.abs(x-btn_x)<=5&&Math.abs(y-btn_y)<=5)
                {
                    btn1_onClick();
                }
                return true;
        }
    });
    adjustFloaty.ff.setOnTouchListener(function(view,event){
        switch(event.getAction()){
            case event.ACTION_DOWN:
                adjustXStart=parseInt(event.getRawX());
                adjustYStart=parseInt(event.getRawY());
                return true;
            case event.ACTION_MOVE:
                adjustXEnd=parseInt(event.getRawX());
                adjustYEnd=parseInt(event.getRawY());
                drawArea();
                return true;
            case event.ACTION_UP:
                return true;
        }
    })

    //setBackgroundColor(colors.argb(180, 0, 0, 0),adjustFloaty.rl);
    events.onKeyDown("volume_up",function(event){
        adjustFloaty.close();
        adjusting=false;
    });
}
function textInCenter(){
    var x,y;
    x=device.height/2-textFloaty.getWidth()/2;
    y=0;
    textFloaty.setPosition(x,y);
}
function translate(){
    if(already==false||adjusting){
        ui.run(
            function(){
                textFloaty.show.setText("未框选区域");
            });
        return;
    }
    var img=screenshot();
    if(!img)
        return;
    var text=ocr(img);
    ui.run(
        function(){
            textFloaty.show.setText(text);
        }
    );
}
function screenshot(){
    var img;
    if(already==false||adjusting)
        return;
    do{
        img=captureScreen();
    }while(!img);
    if(!already){
        return;
    }
    var p=images.clip(img,adjustXStart,adjustYStart,adjustXEnd-adjustXStart,adjustYEnd-adjustYStart);//裁剪图片
    //toast("切图");
    if(debug){
        images.save(p,save_path+getName());
    }
    return p;
}
function getName(){
    var date=new Date();
    var str=date.getHours()+"H"+date.getMinutes()+"M"+date.getSeconds()+"S"+date.getMilliseconds()+".jpg";
    return str;
}
function getAccessToken(api_key,secret_key){
    var url="https://aip.baidubce.com/oauth/2.0/token?";
    var params={
        "grant_type":"client_credentials",
        "client_id":api_key,
        "client_secret":secret_key
    }
    for(var key in params){
        url+=key+"="+params[key]+"&";
    }
    var res=http.get(url);
    var json=res.body.json();
    return json.access_token;
}
function ocr(image){
    var url="https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token="+token;
    var img_base64=images.toBase64(image,"jpg",100);
    var params={
        "image":img_base64
    }
    var res=http.post(url,params,{
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        }
    });
    var json=res.body.json();
    var text="";
    for(var i=0;i<json.words_result.length;i++){
        text+=json.words_result[i].words;
    }
    log("text="+text);
    return text;
}
//注解:setInterval不可删除，否则将不能保持悬浮窗存在
//setInterval(()=>{});//可使用空函数代替
setInterval(() => {
    textInCenter();
    translate();
}, 50);