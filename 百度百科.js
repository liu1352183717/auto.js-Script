"ui";
//ui.statusBarColor("#ff555555");
ui.layout(
    <frame background="#ff555555">
        <vertical align="top" margin="0">
            <linear>
                <input id="inp" w="302" bg="#ffffff" h="45" hint="你想了解什么">汽车</input>
                <button h="55" w="60" id="ok" text="查看" />
            </linear>
            <input id="text" gravity="left" size="8" bg="#ffffff" w="358" h="566" margin="0 1" hint="网页代码区"/>
        </vertical>
    </frame>
);


ui.ok.click(function() {
    threads.start(function(){
        let text=ui.inp.text();
        var qwe=baike(text);
        ui.run(function(){
            ui.text.setText(qwe);
      });  
});
});

function baike(name){
let url = "https://wapbaike.baidu.com/item/";
let res = http.get(url + name);
let html = res.body.string();
html = cutstr(html, "<ul", "</ul>", 2, 90);
html = "mdijftux" + cutstr(html, "<li>", "</li>");
html = cutstr(html, "mdijftux", "<div", 1, 2);
log(html);
return html;
}



function cutstr(a, b, c, f, e) {
    a = a.split(b);
    var d = "";
    if (e < a.length && e != null) {} else {
        e = a.length;
    }
    if (f == null) {
        f = 1;
    }
    for (i = f; i < e; i++) {
        tmp = a[i].split(c);
        if (tmp.length > 1) {
            d += tmp[0];
        }
    }
    return d;
}