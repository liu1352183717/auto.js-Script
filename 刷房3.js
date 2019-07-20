auto();
app.launchPackage("com.yy.huanju");
while (1) {
   var a= id("tv_my_room_entrance").text("进入我的房间").findOne();
   click(a.parent().bounds().centerX(),a.parent().bounds().centerY());
    id("topbar_right_child_layout").findOne().click();
   var b= id("txt_menu_item_content").text("退出房间").findOne();
   b.parent().click();
    sleep(400);
    click("退出");
    sleep(400);

}