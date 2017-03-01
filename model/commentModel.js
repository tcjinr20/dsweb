/**
 * Created by Administrator on 2017/2/26.
 */
var GLOBAL = require('thinkmv').global;
var db = null;
GLOBAL.db.getDBByTable('commenttable',function(err,table){
    if(err) throw err;
    db = table;
})
proto=module.exports={};

proto.findcomment = function (picid,callback) {
    if(picid){
        db.find({"picid":GLOBAL.ObjectID(picid)},function (err,cursor) {
            cursor.toArray(callback)
        })
    }else{
        callback(new Error('wrong'))
    }
}

proto.savecomment = function (id,con,authorid,callback) {
    if(!id || !con)
    {
        callback(new Error())
    }else{
        authorid = authorid||0;
        db.insertOne({"picid":GLOBAL.ObjectID(id),'content':con,"addtime":new Date().format("yyyy-MM-dd"),'author':authorid},callback)
    }
}

proto.delcomment = function () {
    
}

Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}