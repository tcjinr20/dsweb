/**
 * Created by Administrator on 2016/12/12.
 */
var GLOBAL = require("thinkmv").global;
// var multiparty = require("multiparty");
// var FILE = require('fs');
var req ,res,next;
var proto = {};
module.exports = function(q,s,n){
    req = q;res = s;next = n;
    return proto;
}

proto.uploading = function() {
    GLOBAL.upload(function(path){
        res.json({error:0,url:path});
    })
}