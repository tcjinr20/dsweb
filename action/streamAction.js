/**
 * Created by Administrator on 2017/1/9.
 */
var sock = require('thinkmv').global.SOCK();
var request;
var respone;
var proto=module.exports=function (req,res,next) {
    request=req;
    respone=res;
    sock.start();
    return proto;
};


proto.index = function (param) {
    respone.render('./stream/index');
}
proto.getcam = function (param) {
   var keys = Object.keys(sock.bokes);
    respone.render('./stream/lookcam',{list:keys});
}

proto.cam = function() {
    respone.render('./stream/webcam')
}

proto.audior =function () {
    var keys = Object.keys(sock.bokes);
    respone.render('./stream/audiorev',{list:keys});
}
proto.audios = function () {

    respone.render('./stream/audiosend');
}

proto.create=function () {
    respone.render('./stream/createsound');
}
