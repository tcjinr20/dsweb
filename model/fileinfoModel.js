/**
 * Created by Administrator on 2017/2/16.
 */
var GLOBAL = require('thinkmv').global;
var db = null;
GLOBAL.db.getDBByTable('fileinfotable',function(err,table){
    if(err) throw err;
    db = table;
})
var pages = GLOBAL.page12;
proto=module.exports={};

proto.match = function (list,callback) {
    // console.log(list)
    db.find({'name':{'$in':list}},{'_id':0},function (err,cursor) {
        cursor.toArray(callback)
    })
}

proto.findclass = function (cla,page,callback) {
    page = page?page-1:0;
    db.find({'classfy':cla},{limit: pages, skip:page*pages},function (err,cursor) {
        cursor.toArray(callback)
    })
}

proto.page= function (page,callback) {
    page = page?page-1:0;
    db.find({},{limit: pages, skip:page*pages},function (err,cursor) {
        cursor.toArray(callback)
    })
}

proto.count = function (callback) {
    db.count();
}

proto.find = function (pid,callback) {
    if(pid){
        db.findOne({"_id":GLOBAL.ObjectID(pid)},callback)
    }else{
        callback(new Error('id is null'))
    }
}