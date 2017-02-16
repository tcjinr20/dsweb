/**
 * Created by Administrator on 2017/2/3.
 */
var GLOBAL = require("thinkmv").global;
var PLUG = GLOBAL.P()
var model = GLOBAL.M("spy")

var req ,res;
var proto = {};
module.exports = function(q,s){
    req = q;
    res = s;
    return proto;
}

proto.index = function(){
    res.render("./spider/index")
}

proto.list=function () {
    model.getAllplug(function (err,result) {
        if(!result || result.length<=0)
        {
            result = [{'type':'spy'},{'type':'analysis'},{'type':'translator'}]
        }
        res.render('./spider/list',{'list':result})
    })
}

proto.spy = function (param) {
    var p = param.post
    if(p){
        var status = p.statu>0?1:0
        model.setrun(status,function (info) {
            if (info instanceof Error){
                res.json({'status':0,'msg':info.message})
            }else{
                if(status == 1)
                    PLUG.spider(function (err,info) {
                        console.log(err.message,info)
                    })
                res.json(info)
            }
        })
    }else{
        res.send('wrong')
    }
}
proto.analysis = function(param) {
    var p = param.post
    if(p){
        var status = p.statu>0?1:0
        model.setAnalysis(status,function (info) {
            if(info instanceof Error){
                res.json({'status':0,'msg':info.message})
            }else{
                if(status == 1){
                    PLUG.analysis(function (err,info) {
                        console.log(err.message,info)
                    })
                }
                res.json(info)
            }
        })
    }else{
        res.send('wrong')
    }
}


