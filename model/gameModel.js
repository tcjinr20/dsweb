/**
 * Created by Administrator on 2016/12/22.
 */
var GLOBAL = require('thinkmv').global;
var GamePerson = GLOBAL.M('GameVO').GamePerson;
var GameVO = GLOBAL.M('GameVO').GameVO;
var user = GLOBAL.M('login');
var db = null;
GLOBAL.db.getDBByTable('gametable',function(err,table){
    if(err) throw err;
    db = table;
})
var proto = module.exports = {};
proto.addGame = function(param,back) {
    var g = new GameVO(param);
    g.userid =GLOBAL.getMarker("_id");
    db.insertOne(g,function (err,info) {
        console.log(1)
    })
}
proto.delgame = function (id) {

}
proto.pagegame=function (page,callback) {
    var pn = GLOBAL.pageNUM;
    getlist({},{limit: pn, skip:((page-1)*pn)},callback)
}


proto.getgame = function (gameid,back) {
    var userid = GLOBAL.getMarker('_id');
    if(userid){
        user.getUserByID(userid,function (err,info) {
            if(info.games.indexOf(gameid)==-1){
                user.updateUserByID(userid,gameid);
                var gp =new GamePerson();
                gp.userid = userid;
                gp.gameid = gameid;
                GLOBAL.M("gamedata").initData(gp);
               db.insertOne(gp);
            }
        });
    }
    db.findOne({_id:GLOBAL.ObjectID(gameid)},back);
}


function getlist(query,where,callback) {
    db.find(query,where,function (err, cursor) {
        if (err &&!cursor) {
            callback(err,null);
            return
        }
        var result ={};
        db.count(query,function (err,info) {
            result.len = info;
            cursor.toArray(function(err, items) {
                if(err)throw err;
                else {
                    result.list = items;
                    callback(null,result)
                }
            });
        });
    })
}


