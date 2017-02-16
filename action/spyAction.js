/**
 * Created by Administrator on 2017/1/14.
 */

var path = require('path');
var http = require('http');
var url = require('url');
const exec = require('child_process').exec;
var request;
var respone;
var proto=module.exports=function (req,res,next) {
    request=req;
    respone=res;
    return proto;
};
proto.index = function (param){

    respone.render('./spy/index');
}

proto.list = function (param) {

    respone.render('./spy/list')
}

proto.reget = function (param) {
    if(param.get && param.get.redirect){
        var upl = url.parse(param.get.redirect);
        if(upl.host =='')return;
        var uu = param.get.redirect;
        var req =http.request(uu,function (res) {
            res.setEncoding('utf8');
            var body = '';
            res.on('data',function (chunk) {
                body+=chunk;
            })
            res.on('end',function () {
                // body ="<base href="+upl.host+" _target>"+body;
                // body+="<script src='/js/docjs.js'></script>";
                respone.send(body);
            })
        });
        req.end();
    }
}