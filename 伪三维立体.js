"ui";
var h=100;
var ts="100px"
var text="伪三维效果";
var cs=155;
var m=2;

var str="ui.layout(<frame><frame margin='1px'>"
for(var i=0;i<h;i++){
    str=str+"<text textColor='"+colora(i+cs,m)+"'margin='"+i+"px'textSize='"+ts+"'text='"+text+"'/>";
}
str=str+"<text textColor='#aaaaaa'margin='"+i+"px'textSize='"+ts+"'text='"+text+"'/></frame></frame>);"
eval(str);

function colora(i,c){
    i=i.toString(16);
    if(i.length==1){
        i="0"+i;
        log("c");
    }
    if(c==1){
        return "#"+i+i+"00";
    }if(c==2){
        return "#00"+i+i;
    }if(c==3){
        return "#"+i+"00"+i;
    }
}

