
if(dialogs.confirm("是否分享？")){
app.startActivity({
    action: "android.intent.action.SEND",
    type: "text/*",
    extras: {
      "android.intent.extra.TEXT": getClip()
    },
    packageName: "com.tencent.mobileqq",
    className: "com.tencent.mobileqq.activity.JumpActivity"
});
};

id("listView1").findOne().scrollForward()



