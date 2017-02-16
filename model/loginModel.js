/**
 * Created by Administrator on 2016/12/9.
 */
var GLOBAL = require('thinkmv').global;
var db = null;
GLOBAL.db.getDBByTable('usertable',function(err,table){
    if(err) throw err;
    db = table;
    db.ensureIndex({username:1},{unique:true})
})
var proto=module.exports = {};
proto.addUser = function (param,callback) {
    db.findOne({'username': param.username}, function (err, result) {
        if (result == null) {
            var per = new Person();
            per.username = param.username;
            per.pass = param.pass;
            db.insertOne(per, function (err, info) {
                if (err) {
                    if (callback) callback(new Error("用户 写入错误"));
                } else {
                    if (callback) callback(null, per);
                }
            })
        } else {
            if (callback) callback(new Error("用户已经存在"));
        }
    })
}

proto.updateUserByID = function (id,data,callback) {
    db.update({_id:GLOBAL.ObjectID(id)},{$addToSet:{'games':data}});
}

proto.getUserByName=function(username,callback) {
    db.findOne({'username':username}, function (err, result) {
        if (result == null) {
            if (callback) callback(new Error("找不到用户"));
        } else {
            if (callback) callback(null, result);
        }
    })
}

proto.getUserByID = function (id,callback) {
    db.findOne({'_id':GLOBAL.ObjectID(id)}, function (err, result) {
        if (result == null) {
            if (callback) callback(new Error("找不到用户"));
        } else {
            if (callback) callback(null, result);
        }
    })
}

function Person(obj) {
    this.games=[];
    this._id = null;
    this.pass ='';
    this.username = '';
    if(obj){
        for(var s in this){
            this[s] = obj[s];
        }
    }
}