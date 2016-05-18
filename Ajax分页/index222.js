//分页实现的原理：
// 1）通过Ajax把我们相关的数据进行请求（把所有的内容获取到）total->总页数
// 2）计算一共要显示多少页 pageNum->每页显示的条数 totalPage=total/10整体向上取整 ->把分页中的数据绑定
// 3）默认把所有数据中第一页的数据展示在页面中
// 4）给实现分页的按钮绑定事件：根据当前应该展示的页数把内容区的数据进行替换。
var list=document.getElementById("list");
var page=document.getElementById("page");
var pageList=document.getElementById("pageList");


//一、首先通过Ajax把我们的数据获取到
var total= 0,totalPage= 0,pageNum=10,curPage=1;
list.style.height=pageNum*30+"px";
utils.ajax("data.txt",function(data){//function是请求之后要做的所有事情，包括bindPage（）、等
    //在这里要做好多事情，先在这里定义好要做的事情，然后到下边具体去做
    total=data.length;//获取总条数
    totalPage=Math.ceil(total/pageNum);
    //console.log(total,totalPage);

    bindPage();
    bindData(curPage,data);


    //四、利用事件委托实现分页切换
    page.onclick=function(e){
        e=e||window.event;
        var tar= e.target|| e.srcElement;

        //判断事件源
        if (tar.tagName.toLowerCase()==="li"){
            //说明点击的是分页的页码
            var page=Number(tar.innerHTML);
            curPage=page;
        }else if (tar.id==="first"){
            curPage=1;
        }else if (tar.id==="last"){
            curPage=totalPage;
        }else if (tar.id==="prev"){
            if (curPage===1){
                return;
            }
            curPage--;
        }else if (tar.id==="next"){
            if (curPage===totalPage){
                return;
            }
            curPage++;
        }else if (tar.id==="search"){
            return;
        }
        bindData(curPage,data);
        changeBg();
    };


    //给我们的文本框绑定keyup事件，如果按下的是enter键，我们实现切换
    var search=document.getElementById("search");
    search.onkeyup=function(e){
        e=e||window.event;
        if (e.keyCode===13){
            var val=this.value.replace(/^ +| +$/g,"");
            if (/^(\d|([1-9]\d+))$/.test(val)){
                if (val <1||val>totalPage){
                    this.value=totalPage;
                    val=totalPage;
                    console.log(val);
                }
                curPage=val;
                bindData(curPage,data);
                changeBg();
            }else{
                this.val="";
                this.focus();
            }
        }
    }
});

//二、动态绑定我们的分页的页码
function bindPage(){
    var str="";
    for (var i=1;i<=totalPage;i++){
        var c=i===curPage?str+="<li class='select'>"+i+"</li>":str+="<li>"+i+"</li>";

    }
    pageList.innerHTML=str;
}


//三、实现主要内容的绑定
//第一页 索引0~9
//第二页 索引10~19
//第三页 索引20~29
// 第n页 索引（n-1）*pageNum~n*pageNum-1..
function bindData(inPage,data){//inPage当前是第几页
    var startIndex=(inPage-1)*pageNum;
    var endIndex=inPage*pageNum-1;
    var str="";
    for (var i=startIndex;i<endIndex;i++){
        var cur=data[i];
        if (cur){
            var c=i%2===1?"even":null;
            str+="<li class='"+c+"' num='"+cur["num"]+"'>";
                for (var key in cur){
                    var val=key==="sex"?(cur[key]===1?"男":"女"):cur[key];
                    str+="<span>"+val+"</span>";
                }
            str+="</li>";
        }
    }
    list.innerHTML=str;
    //console.log(list);

//    给每一个li绑定点击事件
    var oLis=list.getElementsByTagName("li");
    for (var k=0;k<oLis.length;k++){
        oLis[k].onclick=function (){
            //window.open("detail.html");
            window.open("detail.html?num="+this.getAttribute("num"));
            //window.location.href="detail.html？num="+this.getAttribute("num");
            //
            //"http://www.baidu.com/"
            //window.location.href=xxxx:跳转到指定的页面,之前页面没了，在本窗口打开；
            // var url=window.location.href:获取本页面的URL地址；
            // window.open：跳转到指定页面，在新窗口打开页面。

        }
    }
}


//五、实现分页选中样式切换
function changeBg(){
    var oLis=pageList.getElementsByTagName("li");
    for (var i=0;i<oLis.length;i++){
        oLis[i].className=i===curPage-1?"select":null;
    }
}





//从从一个列表页面跳转到详细页，用的是一个详细页
//我们
