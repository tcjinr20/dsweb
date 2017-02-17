/**
 * Created by Administrator on 2017/2/2.
 */
var GLOBAL = require("thinkmv").global;
model = GLOBAL.M('classfy')
fmodel = GLOBAL.M('fileinfo')
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

proto.list =function (param) {
    model.pagelist(1,function (err,info) {
        if(info){
            keys = []
            for(var i = 0; i<info.list.length;i++){
                keys.push(info.list[i]['classfy'])
            }
            fmodel.match(keys,function (result) {
                res.render('./graph/list',{'list':result,len:info.len})
            })
        }
    })

}

proto.serach = function () {
    GLOBAL.upload(function (path,other) {
        path = GLOBAL.PATH(path)
        PLUG.search(path,function (err,resu) {
            res.send(resu)
        })
    })
}

proto.classfy = function (param) {
    if(param.get){
        fmodel.findclass(param.get.id,function (err,info) {
            res.render('./graph/classfy',{'list':info})
        })
    }
}

