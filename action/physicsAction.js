/**
 * Created by Administrator on 2016/12/25.
 */
/**
 * Created by Administrator on 2016/12/10.
 */
var req ,res;
var proto = {};
var GLOBAL = require('thinkmv').global;
var db = GLOBAL.M("article");
var ArticleVO = GLOBAL.M("GameVO").ArticleVO;
module.exports = function(q,s){
    req = q;
    res = s;
    return proto;
}

proto.index = function(){
    res.render("./user/article")
}
proto.list = function (param) {
    var page = param.get.page||1;
    db.getCateList('physics',page,function (err,info) {
        res.render("./user/articlelist",{list:info.list,pages:info.len,page:page})
    })
}
