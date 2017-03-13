/**
 * Created by Administrator on 2017/3/12.
 */

var GLOBAL = require("thinkmv").global;
var fileinfo  = GLOBAL.M('fileinfo');
var req ,res,next;
var proto = {};

module.exports = function(q,s,n){
    req = q;res = s;next = n;
    return proto;
}

proto.index = function (param) {
    if(param.get){
        var aid = param.get.p;
        fileinfo.find(aid,function (err,info) {
            if(err){
                res.render('graph/piv',{vo:{}});
            }else{
                res.render('graph/piv',{vo:info});
            }
        })
    }
}