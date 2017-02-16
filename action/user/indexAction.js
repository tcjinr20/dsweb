/**
 * Created by Administrator on 2016/12/10.
 */
var req ,res;
var proto = {};
module.exports = function(q,s){
    req = q;
    res = s;
    return proto;
}

proto.index = function(){
    res.render("./user/index")
}
