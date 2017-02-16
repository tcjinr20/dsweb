/**
 * Created by Administrator on 2016/12/26.
 */
var GLOBAL = require('thinkmv').global;
var db = null;
GLOBAL.db.getDBByTable('optiontable',function(err,table){
    if(err) throw err;
    db = table;
    db.findOne({}, function (err, result) {
        if (result) option = result;
        else db.insert({});
    })
})
var option = {};
proto= module.exports= {};

proto.get = function (key,callback) {
    if(Object.hasOwnProperty(option,key))
        callback(null,option[key]);
    else{
        var f={};
        f[key]=1;
        db.find({},f,function (err,info) {
            option[key]=info;
            callback(null,info);
        })
    }
}

proto.set = function (key,value,callback) {
    option[key] = value;
    var f = {};
    f[key]=value;
    db.updateOne({},{$set:f},callback);
}

proto.flush = function (callback) {
 db.updateOne({},{$set:option},callback)
}