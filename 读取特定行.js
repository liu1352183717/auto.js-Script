importClass('java.io.File');
importClass('java.io.IOException');
importClass('java.io.RandomAccessFile');
importClass('java.util.ArrayList');
importClass('java.util.List');

numRead = 10
filePath = "/storage/emulated/0/SoGame/log/2018-07-05/1.playstation.log"
// filePath="/sdcard/123.txt"
ascu = android.os.SystemClock.uptimeMillis;

//调用读取方法，定义文件以及读取行数

// /**
//  * 读取文件最后N行
//  * 根据换行符判断当前的行数，
//  * 使用统计来判断当前读取第N行
//  * PS:输出的List是倒叙，需要对List反转输出
//  * @param file 待文件
//  * @param numRead 读取的行数
//  * @return List<String>
//  */
function readLastNLine(file, numRead) {
    // 定义结果集
    result = new ArrayList();
    //行数统计
    count = 0;
    // 排除不可读状态
    if (!file.exists() || file.isDirectory() || !file.canRead()) {
        log("!file.exists()=", !file.exists())
        log("file.isDirectory()=", file.isDirectory())
        log("!file.canRead()", !file.canRead())
        return null;
    }
    // 使用随机读取
    fileRead = null;
    try {
        //使用读模式
        fileRead = new RandomAccessFile(file, "r");
        //读取文件长度
        length = fileRead.length();
        //如果是0，代表是空文件，直接返回空结果
        if (length == 0) {
            return result;
        } else {
            //初始化游标
            pos = length - 10;
            while (pos > 0) {
                pos--;
                //开始读取
                fileRead.seek(pos);
                //如果读取到/n代表是读取到一行
                if (fileRead.readByte() == '/n') {
                    //使用readLine获取当前行
                    line = fileRead.readLine();
                    //保存结果
                    result.add(line);

                    //打印当前行
                    System.out.println(line);

                    //行数统计，如果到达了numRead指定的行数，就跳出循环
                    count++;
                    if (count == numRead) {
                        break;
                    }
                }
            }
            if (pos == 0) {
                fileRead.seek(0);
                result.add(fileRead.readLine());
            }
        }
    } catch (e) {
        log(e)
    } finally {
        if (fileRead != null) {
            try {
                //关闭资源
                fileRead.close();
            } catch (e) {
                log(e.stack)
            }
        }
    }
    return result;
}


startTime = ascu()
tenLineContent = readLastNLine(new File(filePath), numRead)
endTime = ascu()
spendTime = endTime - startTime
log("读取10行花费时间=", spendTime)
log(tenLineContent)