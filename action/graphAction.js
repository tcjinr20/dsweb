/**
 * Created by Administrator on 2017/2/2.
 */
var GLOBAL = require("thinkmv").global;

var article = GLOBAL.M('article')
var PLUG = GLOBAL.P()


var req ,res,next;
var proto = {};

module.exports = function(q,s,n){
    req = q;res = s;next = n;
    return proto;
}

proto.index = function(param) {
    res.render('./graph/index')
}

proto.test = function () {
    res.render('./graph/test')
}

proto.list =function (param) {
    res.render('./graph/list')
}

proto.serach = function () {
    GLOBAL.upload(function (path,other) {
        path = GLOBAL.PATH(path)
        PLUG.search(path,function (err,resu) {
            res.send(resu)
        })
    })
}

