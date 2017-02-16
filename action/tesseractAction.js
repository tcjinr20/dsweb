/**
 * Created by Administrator on 2017/1/13.
 */

var path = require('path');

const exec = require('child_process').exec;
var request;
var respone;
var proto=module.exports=function (req,res,next) {
    request=req;
    respone=res;
    return proto;
};
proto.index = function (param){
    var s = path.join("public","cosmic.png");
    var o = path.join("public",'t');
    // var code = "tesseract "+s+" "+o+" -l chi_sim";
    var code  ="tesseract "+s+" "+o+" -l chi_sim";
    console.log(code)
    var sp = exec(code);

    sp.on('close', function(code) {
        console.log('closing code: ' + code);
    });
    sp.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });
    sp.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });
    respone.render('./tesseract/index');
}


