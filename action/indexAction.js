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

proto.class = function () {
    res.render('./graph/class')
}

proto.classlist =function (param) {
    page = param.get['page']||1;
    model.pagelist(page,function (err,info) {

        if(info){
            keys = []
            for(var i = 0; i<info.list.length;i++){
                keys.push(info.list[i]['classfy'])
            }
            fmodel.match(keys,function (err,result) {
                if(err){
                    res.send('wrong')
                }else{
                    res.render('./graph/classlist',{'list':result,'curp':page})
                }
            })
        }
    })
}

proto.classpage = function (param) {
    page = param.get['page']||1;
    model.pagelist(page,function (err,info) {
        if(info){
            keys = []
            for(var i = 0; i<info.list.length;i++){
                keys.push(info.list[i]['classfy'])
            }
            fmodel.match(keys,function (err,result) {
                if(err){
                    res.send('wrong')
                }else{
                    res.render('./graph/classpage',{'list':result})
                }
            })
        }
    })
}

proto.page = function () {
    res.render('./graph/page');
}

proto.pagelist = function (param) {
    if(param.get){
        var page = param.get.page||1;
        fmodel.page(page,function (err,resu) {
            res.render('./graph/pagelist',{'list':resu,'curp':page})
        })
    }
}
proto.pagepage = function (param) {
    if(param.get){
        var page = param.get.page||1;
        fmodel.page(page,function (err,resu) {
            res.render('./graph/pagepage',{'list':resu,'curp':page})
        })
    }
}

proto.random = function () {
    model.random(GLOBAL.page12,function (err,info) {
        if(info){
            keys = []
            for(var i = 0; i<info.length;i++){
                keys.push(info[i]['classfy'])
            }
            fmodel.match(keys,function (err,result) {
                if(err){
                    res.send('wrong')
                }else{
                    res.render('./graph/random',{'list':result})
                }
            })
        }
    });
}
proto.getMax = function () {
    model.count()
    res.send(1)
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
        var p=param.get.page||1;
        fmodel.findclass(param.get.id,p,function (err,info) {
            res.render('./graph/classfy',{'list':info,'pid':param.get.id})
        })
    }
}

proto.classfypage = function (param) {
    if(param.get&&param.get.pid&&param.get.page){
        var p=param.get.page||1;
        fmodel.findclass(param.get.pid,p,function (err,info) {
            res.render('./graph/classfyitem',{'list':info})
        })
    }
}

