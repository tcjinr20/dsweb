/**
 * Created by Administrator on 2017/2/7.
 */
exe = require('child_process').exec
var FILE = require('fs')

module.exports={
    search:function (path,callback){
        var codep = __dirname + '/py/dsimg/search.py'
        var proc = exe("python "+codep+' -f '+path)
        var data = ''
        var err = ''
        proc.stdout.on('data', function(d) {
            // console.log('stdout: ' + d);
            // callback(null,data.toString())
            data+=d
        });

        proc.stderr.on('data', function(msg) {
            // callback(new Error(msg))
            // console.log('stderr: ' + data);
            err+=msg
        });
        proc.on("close",function(code, signal) {
            if (code == 0){
                callback(null,data)
                data=''
            }else{
                callback(new Error(err),null)
            }
        })
    },
    spider:function (callback) {
        var codep = __dirname + '/py/spy/index.py'
        var proc = exe("python "+codep)
        var err = ''
        var msg =''
        proc.stdout.on('data', function(data) {
            msg+=data
            // callback(null,data.toString())
        });

        proc.stderr.on('data', function(msg) {
            err+=msg
        });
        proc.on("close",function(code, signal) {
            if(callback)callback(new Error(err),msg)
        })
    },
    analysis:function (callback) {
        var codep = __dirname + '/py/dsimg/index.py -d'
        var proc = exe("python "+codep)
        var err = ''
        var msg =''
        proc.stdout.on('data', function(data) {
            msg+=data
            // callback(null,data.toString())
        });

        proc.stderr.on('data', function(msg) {
            err+=msg
            // callback(new Error(msg))
        });
        proc.on("close",function(code, signal) {
            if(callback){
                callback(new Error(err),msg)
            }
        })
    }
}