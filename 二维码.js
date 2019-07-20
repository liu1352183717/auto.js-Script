"ui";
var aad;
ui.layout(
    <frame background="#515155">
        <vertical align="top" margin="30">
            <text textSize="26sp" textStyle="bold">在下面输入内容：</text>
            
                <input id="num" layout_weight="1" bg="#ffffff" paddingLeft="10sp" hint="输入网址" alpha="0.5"/>
                <button h="55" id="ok" text="生成" />
           
            <img id="rounded_img" gravity="center" padding="10" src="http://www.autojs.org/assets/uploads/profile/1-profileavatar.jpeg" w="200" h="200" radius="20dp" scaleType="fitXY"/>
        </vertical>
    </frame>
);
ui.ok.click(function() {
    threads.start(function() {
        let sd = ui.num.text();
        if (sd) {
            ui.run(() => {
                aad=("http://mobile.qq.com/qrcode?url="+sd);
                ui.rounded_img.setSource(aad);
            });
        }
    });
});
ui.ok.on("long_click", () => {
    ui.num.setText("");
});
ui.rounded_img.on("click", () => {
    threads.start(function(){
    let name = (new Date).getTime();
    if(aad){
    files.writeBytes("/sdcard/" + name+".jpg", http.get(aad).body.bytes());
    toast("保存成功!");}
    });
 });   