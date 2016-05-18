var createXHR=(function(){
    if (window.XMLHttpRequest) {
        return function(){
            return new XMLHttpRequest();
        }
    };

    if (new ActiveXObject("Microsoft.XMLHTTP")) {
        return function(){
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    };


    if (new ActiveXObject("Msxml2.XMLHTTP")) {
        return function () {
            return new ActiveXObject("Msxml2.XMLHTTP");
        }
    };


    if (new ActiveXObject("Msxml3.XMLHTTP")) {
        return function(){
            return new ActiveXObject("Msxml3.XMLHTTP");
        }
    }
})();


var utils={
    toJSON:function(str){//把json字符串转化为对象
        return "JSON" in window?JSON.parse(str):eval("("+str+")");
    },



    ajax:function (url,callback){//callback是用户要做的事情
        var _this=this;//Ajax中的this是命名空间utils

        //加一个随机数，清除缓存
        if (url.indexOf("?")>-1){
            url+="&_="+Math.random();
        }else{
            url+="?_="+Math.random();
        }


        var xhr=createXHR();
        xhr.open("get",url);
        xhr.onreadystatechange=function(){
            if (this.readyState===4&&/^2\d{2}$/.test(this.status)){
                var val=this.responseText;//得到的是一个字符串，使用tojson转换成对象
                val=_this.toJSON(val);
                typeof callback==="function"?callback(val):null;
            }
        };
        xhr.send();
    }
};
