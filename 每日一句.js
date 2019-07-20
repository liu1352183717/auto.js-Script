"ui";
ui.layout(
    <vertical padding="16" bg="#aa280800">
        <text id="te" textSize="18sp" h="200" bg="#FFD2D9FF"/>
        <horizontal gravity="center">
            <button id="next" text="刷新"/>
            <button id="click_me" text="复制" w="auto"/>
        </horizontal>
    </vertical>
);
var array = [];
每日一句();
ui.click_me.on("click", () => {
    toast("已经复制!!!");
    setClip(array);
});
ui.next.on("click", () => {
    每日一句();
});

ui.click_me.on("long_click", () => {
    ui.te.setText(array.toString());
});

function 每日一句() {
    var yi = threads.start(function() {
        array = [];
        var res = http.post("http://route.showapi.com/1211-1", {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            "showapi_appid": '79304',
            "showapi_sign": 'dc57036459004b369823957c97e01f14',
            "count": "1"
        });
        var html = res.body.json().showapi_res_body.data;
        array.push(html[0].english + "\n" + html[0].chinese + "\n\n");
        ui.te.setText(array.toString());
    });
    yi.join();
    yi.interrupt();
};