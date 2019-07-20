var sh = new Shell;
//开飞行模式
sh.exec("su -c 'settings put global airplane_mode_on 1; am broadcast -a android.intent.action.AIRPLANE_MODE --ez state false'")
   

//关飞行模式
    sh.exec("su -c 'settings put global airplane_mode_on 0; am broadcast -a android.intent.action.AIRPLANE_MODE --ez state false'")
