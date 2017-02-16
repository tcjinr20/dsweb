/**
 * Created by Administrator on 2016/12/14.
 */
//标签
var req ,res;
var proto = {};
var GLOBAL = require("thinkmv").global;
var db = GLOBAL.M('cate');
module.exports = function(q,s){
    req = q;
    res = s;
    return proto;
}

proto.index = function(){
    res.render("./user/cate")
}

proto.add = function (param) {
    var userid = GLOBAL.getMarker('_id');
    if(userid){
        var p = param.post;
        if(p)db.addCate(p,function (err,info) {
            res.redirect('/user/cate/');
        });

    }else{
        res.send('没有登录')
    }
}

proto.del = function (param) {
    var userid = GLOBAL.getMarker('_id');
    if(userid){
        var p = param.get;
        db.delCate(p.name);
        res.redirect('/user/cate/');
    }else{
        res.send('没有登录')
    }
}

proto.list = function (param) {
    var page = 0;
    if(param.get)
        page = param.get.page||1;
    db.getList(page,function (err,info) {
        res.render("./user/catelist",{list:info.list,pages:info.len,page:page})
    })
}
