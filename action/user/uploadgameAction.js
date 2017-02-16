/**
 * Created by Administrator on 2016/12/24.
 */
var GLOBAL = require('thinkmv').global;
var PATH = require("path");
var db = GLOBAL.M("game");
var req ,res;
var proto = {};
module.exports = function(q,s){
    req = q;
    res = s;
    return proto;
}

proto.index = function(){
    res.render("./user/uploadgame")
}
proto.list = function (param) {
    res.render('./user/uploadgamelist')
}

proto.upload = function (param) {
    if(param.post){
        GLOBAL.upload(function (path,fields) {
            var ks = Object.keys(fields);
            var pp ={};
            ks.forEach(function (k) {
                pp[k]=fields[k][0];
            });
            var topa = '/public/game/'+PATH.basename(path,'.zip');
            pp.path ="/game/"+PATH.basename(path,'.zip');
            db.addGame(pp);
            GLOBAL.unZip(path,topa);
        });
    }
    res.redirect('/game/')
}
