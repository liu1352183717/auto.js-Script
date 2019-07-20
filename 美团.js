"ui";
//toast("本软件只适用于学习交流，请勿用于商业用途");
var cangku = storages.create("INFOR_1");
//cangku.clear();
ui.layout(
    <scroll>
    <vertical padding="16">
         <text text="注意：以下为必填项，不填则会出错" textColor="#00ff00" textSize="10sp"/>

         <text text="最大取货距离(公里)(必填)" textColor="black" textSize="8sp" marginTop="1"/>
         <input id="zdqhjl" text="532" textSize="8sp" hint="例如：0.9"/>

         <text text="最大送货距离(公里)(必填)" textColor="black" textSize="8sp" marginTop="1"/>
         <input id="zdshjl" textSize="8sp" text="1200" hint="例如：1.2"/>
         
         <text text="最低价格(元)(必填)" textColor="black" textSize="8sp" marginTop="1"/>
         <input id="zdjg"  textSize="8sp" hint="例如：5.5"/>
         
         <text text="最少剩余时间(分钟)(必填)" textColor="black" textSize="8sp" marginTop="1"/>
         <input id="sysj" inputType="number"  textSize="8sp" hint="例如：30"/>

         <text text="抢到多少单后退出(必填)" textColor="black" textSize="8sp" marginTop="1"/>
         <input id="qdtc" inputType="number"  textSize="8sp" hint="例如：99999999"/>

         <text text="刷新频率（毫秒）(必填)" textColor="black" textSize="8sp" marginTop="1"/>
         <input id="sxsj" inputType="number"  textSize="8sp" hint="建议不小于680"/>

         <text text="抢单模式（测试者假抢(点取消)：0  ,客户真抢(点确定)：1）(必填)     已停用" textColor="black" textSize="8sp" marginTop="1"/>
         <input id="qdms" inputType="none" textSize="8sp" text="1" hint="只能0或1哟"/>
         
         <text text="注意：以下为选填项，不填则表示满足上面条件就抢单" textColor="#00ff00" textSize="10sp"/>

         <text text="屏蔽商家关键字，不会抢包含关键字的商家，中间以/隔开(可选)" textColor="black" textSize="8sp"  marginTop="1"/>
         <input id="pbsj" textSize="8sp" text="" hint="如：A/B/C"/>
         
         <text text="商家和地址选取，只会抢包含你关键字的商家和地址，中间以/隔开(可选)" textColor="black" textSize="8sp" marginTop="1"/>
         <input id="sjdz"  textSize="8sp" text="" hint="如：D/E/F"/>
         
         <text text="送餐地址关键字，只会抢包含你关键字的送餐地址，中间以/隔开(可选)" textColor="black" textSize="8sp" marginTop="1"/>
         <input id="scdz" textSize="8sp" text="" hint="如：G/H/I"/>

         <button id="ok" text="确定" w="auto" style="Widget.AppCompat.Button.Colored"/>
    </vertical>
    </scroll>
);

ui.zdqhjl.setText(cangku.get("zdqhjl", ""));
ui.sxsj.setText(cangku.get("sxsj", ""));
ui.zdshjl.setText(cangku.get("zdshjl", ""));
ui.qdms.setText(cangku.get("qdms", "1"));
ui.pbsj.setText(cangku.get("pbsj", ""));
ui.sjdz.setText(cangku.get("sjdz", ""));
ui.scdz.setText(cangku.get("scdz", ""));
ui.zdjg.setText(cangku.get("zdjg", ""));
ui.sysj.setText(cangku.get("sysj", ""));
ui.qdtc.setText(cangku.get("qdtc", ""));

ui.ok.click(() => {
    var zdqhjl = ui.zdqhjl.text();
    var sxsj = ui.sxsj.text();
    var zdshjl = ui.zdshjl.text();
    var qdms = ui.qdms.text();
    var pbsj = ui.pbsj.text();
    var sjdz = ui.sjdz.text();
    var scdz = ui.scdz.text();
    cangku.put("zdqhjl", zdqhjl);
    cangku.put("sxsj", sxsj);
    cangku.put("zdshjl", zdshjl);
    cangku.put("qdms", qdms);
    cangku.put("pbsj", pbsj);
    cangku.put("sjdz", sjdz);
    cangku.put("scdz", scdz);
    cangku.put("zdjg", ui.zdjg.text());
    cangku.put("sysj", ui.sysj.text());
    cangku.put("qdtc", ui.qdtc.text());
    toast("设置已保存");
    ui.finish();
    engines.execScriptFile("众包.js");
}); //麻烦