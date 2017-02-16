/**
 * Created by Administrator on 2016/12/30.
 */
var http = require('http')
var fs = require('fs')

var options = {
    host:'localhost',
    port:'3000',
    path:'/',
    method:'GET'
}

var writeStream = fs.createWriteStream('file.mp4')

var passedLength = 0;
var lastSize = 0;
var startTime = Date.now();
var totalSize = 0;

var req = http.request(options, function(res){
    console.log('STATUS' + res.statusCode)

    totalSize = res.headers['content-length'];
    console.log(totalSize);

    // console.log('HEADERS' + JSON.stringify(res.headers))
    // res.setEncoding('utf8')

    res.on('data', function(chunk){
        //  console.log('BODY' + chunk);
        passedLength += chunk.length;
        writeStream.write(chunk);
    })

    res.on('end', function(){
        writeStream.end();
        console.log('xx');
    })
})

req.end();
var out = process.stdout;

setTimeout(function show() {
    var percent = Math.ceil((passedLength / totalSize) * 100);
    var size = Math.ceil(passedLength / 1000000);
    var diff = size - lastSize;
    lastSize = size;
    // out.clearLine();
    // out.cursorTo(0);
    out.write('已完成' + size + 'MB, ' + percent + '%, 速度：' + diff * 2 + 'MB/s');
    if (passedLength < totalSize) {
        setTimeout(show, 50);
    } else {
        var endTime = Date.now();
        console.log();
        console.log('共用时：' + (endTime - startTime) / 1000 + '秒。');
    }
}, 50);