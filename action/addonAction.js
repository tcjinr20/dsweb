/**
 * Created by Administrator on 2017/1/2.
 */
var GLOBAL = require("thinkmv").global;
var article = GLOBAL.M('article');
var db = GLOBAL.M("article");
var req ,res,next;
var proto = {};
module.exports = function(q,s,n){
    req = q;res = s;next = n;
    return proto;
}

proto.ajax = function(param) {
    var p = param.post;
    if(p){
        var arts=JSON.parse(p.arts);
        var list = [];
        for(var i = 0;i<arts.length;i++){
            var ol=arts[i];
            if(ol){
                ol.cate = '转载';
                list.push(ol);
            }
        }
         article.createByArray(list,function (err,info) {
             if(err){res.send("error")}
            else
             {
                 res.send("ok");
             }
         });
    }
}

proto.index = function () {
    res.render('addon')
}
proto.list = function (param) {
    var page = param.get.page||1;
    db.getCateList('addon',page,function (err,info) {
        res.render("addonlist",{list:info.list,pages:info.len,page:page})
    })
}
