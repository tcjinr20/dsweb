var GLOBAL = require("thinkmv").global;
var model = GLOBAL.M("comment")
var req ,res,next;
var proto = {};
module.exports = function(q,s,n){
    req = q;res = s;next = n;
    return proto;
}
proto.comment = function (param) {
    if(param.get){
        model.findcomment(param.get.id,function (err,resu) {
            if(err || !resu){
                res.send('no comment')
            }else{
                res.render('graph/comment',{'comments':resu})
            }
        })
    }
}

proto.submit = function (param) {
    if(param.post){
        var po = param.post;
        model.savecomment(po.id,po.con,po.author,function (err,resu) {
            if(err){
                res.send(0)
            }else{
                res.render('graph/comment',{'comments':resu.ops})
            }
        });
    }
}




