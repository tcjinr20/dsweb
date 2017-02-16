/**
 * Created by Administrator on 2016/12/16.
 */
var GLOBAL = require("thinkmv").global;
var GamePerson = GLOBAL.M('GameVO').GamePerson;
var db = GLOBAL.M('game');
var req ,res,next;
var proto = {};
module.exports = function(q,s,n){
    req = q;res = s;next = n;
    return proto;
}

proto.index = function() {
    res.render('game');
}
//游戏列表
proto.list = function (param) {
    db.pagegame(1,function (err,info) {
        res.render('gamelist',{gamelist:info.list})
    });
}

proto.play = function (param) {
    var p = param.get;
    db.getgame(p.id,function (err,game) {
        game.url = game.path+"/"+game.mainhtml;
        res.render('playgame',game);
    });
}
//开始游戏
proto.game = function (param) {
    res.render('playcontent');
}
// 添加游戏应用
proto.addgame = function(param){
    var p = param.post;
    var gp = new GamePerson();
    gp.user = param.user;
    db.insert('gameper',gp);
}
