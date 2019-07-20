"ui";
importClass(android.graphics.Bitmap);
importClass(android.util.DisplayMetrics);
var view = activity.getWindow().getDecorView();
   view.setDrawingCacheEnabled(true);
   view.buildDrawingCache();
   bmp = view.getDrawingCache();
   dm = new DisplayMetrics();
   activity.getWindowManager().getDefaultDisplay().getMetrics(dm);
   ret = Bitmap.createBitmap(bmp, 0, 0, dm.widthPixels, dm.heightPixels);
   view.destroyDrawingCache();
   
   
recordService=bider.getRecordService();
bimap=recordService.getBitmap();




