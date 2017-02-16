/**
 * Created by Administrator on 2017/2/8.
 */
var GLOBAL = require('thinkmv').global;
var db = null;
delay = 1000
GLOBAL.db.getDBByTable('spystatustable',function(err,table){
    if(err) throw err;
    db = table;
})

proto=module.exports={};
proto.setrun = function (status, callback) {
    status = status?1:0
    db.findOne({'type':'spy'},function (err,resu) {
        operate(resu,'spy',status,callback)
    })
}

proto.isrun = function (back) {
    db.findOne({'type':'spy'},function (err,res) {
        if(res){
            back(res)
        }else{
            back(new Error('wrong in spy'))
        }
    })
}

proto.setAnalysis = function (status,callback) {
    status = status?1:0
    db.findOne({'type':'analysis'},function (err,resu) {
        operate(resu,'analysis',status,callback)
    })
}

proto.isAnalysising = function (callback) {
    db.findOne({'type':'analysis'},function (err,res) {
        if(res){
            callback(res)
        }else{
            callback(new Error('wrong in spy'))
        }
    })
}

proto.getAllplug = function (callback) {
    db.find({},function (err,cursor) {
        cursor.toArray(function (err, items) {
            callback(err, items)
        })
    })
}

function operate(info,type,status,callback) {
    var time = new Date().getTime()
    if(info){
        if(info['running'] == status)
        {
            callback(new Error('重复操作'))
        }else if(time-info['opentime'] < delay){
            callback(new Error('频繁操作'))
        }else {
            db.updateOne({_id:info['_id']},{$set:{'running':status,'opentime':time,'pretime':info['opentime']}})
            info['pretime'] =info['opentime']
            info['opentime'] = time
            callback(info)
        }
    }else{
        an={'type':type,'running':status,'opentime':time,'pretime':time}
        db.insertOne(an)
        callback(an)
    }
}


