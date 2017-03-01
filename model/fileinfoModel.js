/**
 * Created by Administrator on 2017/2/16.
 */
var GLOBAL = require('thinkmv').global;
var db = null;
GLOBAL.db.getDBByTable('fileinfotable',function(err,table){
    if(err) throw err;
    db = table;
})

proto=module.exports={};

proto.match = function (list,callback) {
    // console.log(list)
    db.find({'name':{'$in':list}},{'_id':0},function (err,cursor) {
        cursor.toArray(callback)
    })
}

proto.findclass = function (cla,callback) {
    db.find({'classfy':cla},function (err,cursor) {
        cursor.toArray(callback)
    })
}

proto.page= function (page,callback) {
    page = page?page-1:0;
    ps = 12;
    db.find({},{limit: ps, skip:page*ps},function (err,cursor) {
        cursor.toArray(callback)
    })
}