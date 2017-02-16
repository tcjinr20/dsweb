/**
 * Created by Administrator on 2016/12/14.
 */
var GLOBAL = require("thinkmv").global;
var db = GLOBAL.M("article");

var req ,res;
var proto = {};
module.exports = function(q,s){
    req = q;
    res = s;
    return proto;
}

proto.index = function(){
    res.render("./user/article");
}

proto.add = function (param) {
    var p = param.post;
    if(p){
        db.createArticle(p,function (err,info) {
            res.redirect('/user/article/?href=exdit&id='+info._id);
        })
    }else{
        GLOBAL.M('cate').getList(0,function (err,info) {
            res.render("./user/articleadd",{cates:info.list});
        })
    }
}

proto.exdit = function (param) {
    var userid = GLOBAL.getMarker("_id");
    if(!userid)res.send("没有登录")
    var p = param.get;
    if(p){
        db.getArticle(p.id,function (err,info) {
            if(err){
                res.send('读取文章错误')
            }else{
                GLOBAL.M('cate').getList(0,function (err,cate) {
                    res.render("./user/articleexdit",{cates:cate.list,article:info});
                })
                // res.render('./user/articleexdit',info);
            }
        })
    }else if(p=param.post){
        db.exditArticle(p.id,p,function (err,info) {
            if(err){
                res.send('文章修改错误')
            }else{
                res.redirect('/user/article/?href=exdit&id='+p.id);
            }
        })
    }else{
        res.send('参数错误')
    }
}

proto.del = function (param) {
    var userid = GLOBAL.getMarker("_id");
    if(!userid)res.send("没有登录");
    var p = param.get;
    if(p){
        db.delArticle(p.id,function (err,info) {
            if(err){
                res.send('操作错误')
            }else{
                res.redirect('/user/article/?href=list')
            }
        })
    }else{
        res.send('参数错误')
    }
}

proto.read = function(param){
    var p = param.get;
    if(p){
        db.getArticle(p.id,function (err,info) {
            if(err){
                res.send('读取文章错误')
            }else{
                res.render('./user/articleid',info);
            }
        })
    }else{
        res.send('参数错误')
    }
}

proto.list = function (param) {
    var page = 0;
    if(param.get)
        page = param.get.page||1;
    db.getList(page,function (err,info) {
        res.render("./user/articlelist",{list:info.list,pages:info.len,page:page})
    })
}


