



function 获取应用名(app关键字) {
  importClass(android.content.pm.PackageManager)
  var uc应用 = []
  var ucapp = {}
  pm = context.getPackageManager();
  var 有的 = pm.getInstalledPackages(PackageManager.GET_SHARED_LIBRARY_FILES)
  有的 = pm.getInstalledPackages(PackageManager.GET_META_DATA)
  有的 = 有的 + ""
  有的 = 有的.replace(/PackageInfo[^ ]+ /g, "")
  有的 = 有的.replace(/[\}|\[|\]| ]/g, "")
  有的 = 有的.split(",")
  for (let i of 有的) {
      var packageInfo = pm.getPackageInfo(i, 0);
      var appName = packageInfo.applicationInfo.loadLabel(context.getPackageManager()).toString()
      //appName = app.getAppName(i)
      if (appName.match(app关键字)) {
          log(appName)
          log("包名:" + i)
          ucapp = {
              "包名": i,
              "名称": appName
          }
          uc应用.push(ucapp) 
      }
  }
  return uc应用
}






var circle = {};

circle.获取应用名 = 获取应用名

module.exports = circle;



[
  { '包名': 'dkmodel.dox.xtr', '名称': '火牛视频分身22' },
  { '包名': 'com.waqu.android.firebull', '名称': '火牛视频' },
  { '包名': 'dkmodel.uek.arz', '名称': '火牛视频分身33' },
  { '包名': 'dkmodel.bcq.dfs', '名称': '火牛视频分身1' },
  { '包名': 'dkmodel.vkv.mfr', '名称': '火牛视频分身55' },
  { '包名': 'dkmodel.cdb.cad', '名称': '火牛视频分身11' },
  { '包名': 'dkmodel.rnh.hlo', '名称': '火牛视频分身' },
  { '包名': 'dkmodel.mul.ggn', '名称': '火牛视频分身' }
]
