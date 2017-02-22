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

proto.more = function () {
    res.render('./graph/more')
}

proto.random = function () {
    model.random(12,function (err,info) {
        if(info){
            keys = []
            for(var i = 0; i<info.list.length;i++){
                keys.push(info.list[i]['classfy'])
            }
            fmodel.match(keys,function (result) {
                res.render('./graph/random',{'list':result})
            })
        }
    });
}

proto.list =function (param) {
    page = param.get['page']||1;
    model.pagelist(page,function (err,info) {
        if(info){
            keys = []
            for(var i = 0; i<info.list.length;i++){
                keys.push(info.list[i]['classfy'])
            }
            fmodel.match(keys,function (result) {
                res.render('./graph/list',{'list':result,allp:info.len,'curp':page})
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

