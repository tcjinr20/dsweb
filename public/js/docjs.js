/**
 * Created by Administrator on 2017/1/14.
 */

var urls="/spy/reget"+window.location.search;
$.ajax({ url:urls ,dataType:'text',success:function (d) {
    //console.log(d);
    //var dd = $('<div></div>').html(d).html();
    var sou = $(d);
    for(var i = 0;i<sou.length;i++){
        if(sou[i].nodeType==1) {
            var nn = sou[i].nodeName.toLowerCase();
            if(nn=='div'){
                //console.log($(sou[i]).find('script').remove());
                $('body').append(sou[i])
            }else{

                if(nn=='link' && sou[i].type=='text/css')
                {
//                   $('head').append(sou[i]);
                }
            }
        }
    }
}})
var pre = null;
var old = '';
window.addEventListener('mousemove',function (e) {
    if(ready){
        return;
    }
    if(pre){
        pre.style.border=old;
    }

    old=e.target.style.border;
    e.target.style.border = '1px red solid';
    pre = e.target;
})
var ready = false;
window.onclick = function () {
    ready =!ready;
}

$('getall').click(function (e) {
    if(!ready){
        alert("点击红框，再提取");
    }else{

        $()
    }

})