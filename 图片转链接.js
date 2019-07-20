"ui";

ui.layout(
    <vertical>
        <button id="calc" align="center">选择图片</button>
        <text id="text_test" paddingTop="10" textSize="19sp"></text>
    </vertical>
);


function pathToArray(dir) {
    current_dir_array = new Array();
    current_dir_array = ["返回上级目录"];
    files.listDir(dir.join("")).forEach((i) => {
        if (files.isDir(dir.join("") + i)) {
            current_dir_array.push(i + "/");
        } else if (files.isFile(dir.join("") + i)) {
            current_dir_array.push(i);
        }
    });
    return current_dir_array;
}

ui.calc.click(() => {
    var current_dir_array, dir = ["/", "sdcard", "/"]; //存储当前目录
    function file_select(select_index) {
        switch (select_index) {
            case undefined:
                break;
            case -1:
                return;
            case 0:
                if (dir.length > 3) {
                    dir.pop();
                }
                break;
            default:
                if (files.isFile(files.join(dir.join(""), current_dir_array[select_index]))) {
                    let file_name = (files.join(dir.join(""), current_dir_array[select_index]))
                    toast("开始上传"+file_name);
                    threads.start(function(){
                    let wsx=上传图片(file_name);
                    ui.run(() => {
                    ui.text_test.setText(wsx);});});
                    return;
                } else if (files.isDir(files.join(dir.join(""), current_dir_array[select_index]))) {
                    dir.push(current_dir_array[select_index])
                }

        };
        current_dir_array = pathToArray(dir)
        dialogs.select("文件选择", current_dir_array).then(n => {
            file_select(n)
        });
    };
    file_select();
});

ui.text_test.click(() =>{
        let xbj = ui.text_test.text();
    if (xbj) {
        setClip(xbj);
        toast("复制成功");
    }
});

function 上传图片(path) {
    var url = "http://pic.sogou.com/pic/upload_pic.jsp";
    var res = http.postMultipart(url, {
        "file": open(path),
    });
    var t = res.body.string();
    return t;
}
