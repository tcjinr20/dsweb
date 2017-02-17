/**
 * Created by Administrator on 2017/2/16.
 */
var GLOBAL = require('thinkmv').global;
var db = null;
GLOBAL.db.getDBByTable('classfytable',function(err,table){
    if(err) throw err;
    db = table;
})
proto=module.exports={};

proto.pagelist = function (page,callback) {
    var pn = 12;
    getlist({},{'identity':0 },{limit: pn, skip:((page-1)*pn)},callback)
}


function getlist(query,where,app,callback) {
    db.find(query,where,app,function (err, cursor) {
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