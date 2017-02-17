var GLOBAL = require("thinkmv").global;
var article = GLOBAL.M('article')
var req ,res,next;
var proto = {};
module.exports = function(q,s,n){
    req = q;res = s;next = n;

    return proto;
}

proto.index = function(param) {
    var con =param.get.to||'index';
    con = './indexfold/'+con;
    article.getCateList('index',1,function (err,result) {
        res.render('index',{list:result.list,len:result.len,content:con});
    })
}
