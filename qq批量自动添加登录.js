path="/storage/emulated/0/脚本/qq号.txt";
file = open(path, "r")
a=file.readlines();
for(i0=0;i0<a.length;i0++){
a0=a[i0].split(";");
bounds (0,253,1080,385).findOne().setText(a0[0]);           
for(i=0;i<=1;i++){
bounds (0,386,1080,518).findOne().setText(a0[1]);
}
bounds(45,563,1035,695).findOne().click();
}
    
    