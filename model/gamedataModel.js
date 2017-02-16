/**
 * Created by Administrator on 2017/1/6.
 */
var GLOBAL = require('thinkmv').global;
var GamePerson = GLOBAL.M('GameVO').GamePerson;
var GameVO = GLOBAL.M('GameVO').GameVO;
var user = GLOBAL.M('login');
var db = null;
GLOBAL.db.getDBByTable('gamedatatable',function(err,table){
    if(err) throw err;
    db = table;
})
var proto = module.exports = {};
//保存游戏数据
proto.setData = function (data,callback) {
    if(!data.gameid || !data.userid){
        if(callback)callback(new Error("缺少参数 gameid"))
        return;
    }
    var userid = GLOBAL.getMarker("_id");
    var gameid = Number(data.gameid);
    delete data._id;
    db.update({userid:userid,gameid:data.gameid},{$set:data},true,callback);
}
//获取游戏数据
proto.getData = function (gameid,userid,callback) {

    db.findOne({userid:userid,gameid:gameid},callback);
}

proto.initData = function(data,callback){
    db.insertOne(data,callback)
}