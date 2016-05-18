//分页实现的原理：
// 1）通过Ajax把我们相关的数据进行请求（把所有的内容获取到）total->总页数
// 2）计算一共要显示多少页 pageNum->每页显示的条数 totalPage=total/10整体向上取整 ->把分页中的数据绑定
// 3）默认把所有数据中第一页的数据展示在页面中
// 4）给实现分页的按钮绑定事件：根据当前应该展示的页数把内容区的数据进行替换。

//想要操作谁，就把谁获取到
var list=document.getElementById("list");
var page=document.getElementById("page");
var pageList=document.getElementById("pageList");

//一、首先通过Ajax把数据获取到
var total=0;//总条数
var totalPage=0;//总页数
var pageNum=10;//每一页多少条
var curPage=1;//当前默认是第一页

list.style.height=pageNum*30+"px";
utils.ajax("data.txt",function(data){
    total=data.length;
    totalPage=Math.ceil(total/pageNum);

    bindPage();
    bindData(curPage,data);
});

//二、动态绑定分页的页码
function bindPage(){
    var str="";
    for (var i=1;i<=totalPage;i++){
        var c=i===curPage?"select":null;
        str+="<li class="+c+">"+i+"</li>";
    }
    pageList.innerHTML=str;
}

//实现主要内容的绑定
//绑定第一页：json数据的索引0~9
//绑定第二页：索引10~19

function bindData(page,data){
    var startIndex=(page-1)*pageNum;
    var endIndex=page*pageNum-1;

    var str="";
    for (var i=startIndex;i<=endIndex;i++){
        var cur=data[i];
        if (cur){
            var c=i%2===1?"even":null;
            str+="<li class="+c+">";
            for (var key in cur){
                var val=key==="sex"?(cur[key]===1?"男":"女"):cur[key];
                str+="<span>"+cur[key]+"</span>"
            }
            str+="</li>";
        }
    }
    list.innerHTML=str;
}


//三、利用事件委托实现分页切换
page.onclick=function(e){
    e=e||window.event;

    var tar= e.target|| e.srcElement;
    if (tar.tagName.toLowerCase()==="li"){
        //点击的是分页的页码
        var page=Number(tar.innerHTML);
        curPage=page;
        bindData(page,data);
    }else if (tar.id==="first"){
        curPage=1;
        bindData(1,data);
    }else if (tar.id==="last"){
        curPage=totalPage;
        bindData(totalPage);
    }else if (cur.id==="prev"){
        if (curPage===1){return;}
        curPage--;
        bindData(curPage,data);
    }else if (tar.id==="next"){
        if (curPage===totalPage){return;}
        curPage++;
        bindData(curPage,data);
    }else if (tar.id==="search"){return};
    changeBga();
}

//实现分页实现选中样式切换
function changeBga(){
    var oLis=pageList.getElementsByTagName("li");
    for (var i=0;i<oLis.length;i++){
        oLis[i].className=i===curPage-1?"select":null
    }
}


//给文本框绑定keyup事件，如果按下的是enter键，我们实现切换
var search=document.getElementById("search");
search.onkeyup=function(e){
    e=e||window.event;
    if (e.keyCode===13){
        var val=this.value.replace(/(^ +)|( +$)/g,"");
        if (/^(\d|([1-9]\d+))$/.test(val)){
            if (val<1&&val>totalPage){
                this.value=totalPage;
                val=totalPage;
            }
            curPage=val;
            bindData(curPage,data);
            changeBga();
        }else{
            this.value="";
            this.focus();
        }
    }
}

