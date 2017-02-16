/**
 * Created by Administrator on 2016/12/24.
 */
var GLOBAL = require('thinkmv').global;
var ArticleVO = GLOBAL.M("GameVO").ArticleVO;
var db = null;
GLOBAL.db.getDBByTable('articletable',function(err,table){
    if(err) throw err;
    db = table;
})
proto=module.exports={};

proto.getArticle= function (artid,callback) {
    db.findOne({_id:GLOBAL.ObjectID(artid)},callback)
}
proto.createByArray=function (array,callback) {
    var vos =[];
    array.forEach(function (e) {
        vos.push(new ArticleVO(e));
    })
    db.insert(vos,callback)
}
proto.createArticle= function (param,callback) {
    var vo = new ArticleVO(param);
    db.insertOne(vo,callback);
}

proto.exditArticle=function (artid,param,calback) {
    var vo = new ArticleVO(param);
    db.update({'_id':GLOBAL.ObjectID(artid)},vo,calback);
}

proto.delArticle = function (artid,callback) {
    db.remove({'_id':GLOBAL.ObjectID(artid)},callback);
}

proto.getList = function (page,callback) {
    var pn = GLOBAL.pageNUM;
    getlist({},{limit: pn, skip:((page-1)*pn)},callback)
}

proto.labellist = function (namearr,page,callback) {
    var pn = GLOBAL.pageNUM;
    getlist({"label":{$in:namearr}},{limit: pn, skip:((page-1)*pn)},callback)
}

proto.getCateList= function (catename,page,callback) {
    GLOBAL.M('cate').getCate(catename,function (err,info) {
        if(info){
            var pn = GLOBAL.pageNUM;
            getlist({'cate':info._id.toString()},{limit: pn, skip:((page-1)*pn)},callback)
        }else{
            callback(null,{list:[],len:0})
        }
    })
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
