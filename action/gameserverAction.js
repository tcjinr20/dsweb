/**
 * Created by Administrator on 2016/12/22.
 */
var GLOBAL = require("thinkmv").global;
var game = GLOBAL.M('gamedata');
var req ,res,next;
var proto = {};
var userid = 0;
module.exports = function(q,s,n){
    req = q;res = s;next = n;
    return proto;
}

proto.index = function(param) {
    userid = GLOBAL.getMarker("_id");
    if(!userid){
        return res.json({message:"没有登录"});
    }
    var get = param.get;
    if(get){
        method['get_'+get.fun].call(method,get);
    }
    var post = param.post;
    if(post){
        method['post_'+post.fun].call(method,post);
    }
}
var method = {};
method.get_person = function (param) {
    game.getData(param.gameid,userid, function (err, info) {
        if (err) {
            res.json(err);
        } else {
            var ret = {status: 1, result: info};
            res.json(ret);
        }
    });
}

method.post_person = function (param) {
    try{
        var data = JSON.parse(param.data);
    }catch (e){
        res.send("json 格式错误");
        return;
    }

    data.userid = userid;
    if(data.gameid){
        game.setData(data,function (err,info) {
            if(err){
                res.json(err)
            }else{
                res.json({status: 1, message: "成功保存"})
            }
        });
    }else{
        res.send({status:0,message:"参数错误"});
    }

}