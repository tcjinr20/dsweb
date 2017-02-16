/**
 * Created by Administrator on 2016/12/25.
 */
var GLOBAL = require('thinkmv').global;
var LabelVO = GLOBAL.M('GameVO').LabelVO;
var db = null;
GLOBAL.db.getDBByTable('catetable',function(err,table){
    if(err) throw err;
    db = table;
})
var proto = module.exports = {};

proto.addCate = function (param,callback) {
    var vo =new LabelVO(param);
    db.findOne({name:vo.name},function (err,info) {
        if(err){

        }else if(info){
            callback(null,info);
            return
        }
        db.insertOne(vo,callback);
    })
}

proto.delCate = function (name,back) {
    db.remove({name:name},back);
}

proto.updateCate = function (name,param,back) {
    db.updateOne({name:name},{$set:param},back)
}

proto.getCate=function (name,callback) {
    db.findOne({name:name},callback)
}

proto.getList = function (page,callback) {
    var pn = GLOBAL.pageNUM;
    var where = page<=0?{}:{limit: pn, skip:((page-1)*pn)}
    db.find({},where,function (err, cursor) {
        if (err &&!cursor) {
            callback(err,null);
            return
        }
        var result ={};
        db.count(function (err,rl) {
            if(err)throw err;
            result.len = rl;
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