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
    var pn = GLOBAL.page12;
    getlist({},{'identity':0 },{limit: pn, skip:((page-1)*pn)},callback)
}

proto.random = function (num,callback) {

   db.count(function (err,len) {
       if(len){
           var sk = Math.floor(Math.random()*(len-num));
           getlist({},{'identity':0 },{limit: num, skip:sk},function (err,resu) {
               if(resu)resu.counts = len;
               callback(err,resu.list)
           })
       }else {
            callback(null,[])
       }
   })
}


function getlist(query,where,limit,callback) {
    db.find(query,where,limit,function (err, cursor) {
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