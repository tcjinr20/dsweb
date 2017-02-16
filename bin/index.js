var fs        = require('fs');
var tesseract = require('node-tesseract');

tesseract.process('../public/images/1.jpg',function (err,res) {
    console.log(err,res)
})