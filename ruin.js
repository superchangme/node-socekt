/*
 var opt = {
 host:'10.200.0.254',
 port:'8080',
 method:'POST',//这里是发送的方法
 path:' https://www.google.com',     //这里是访问的路径
 headers:{
 //这里放期望发送出去的请求头
 }
 }
 */

//以下是接受数据的代码
/*
var body = '';
var req = http.request({path:"http://www.baidu.com"}, function(res) {
    console.log("Got response: " + res.statusCode);
    res.on('data',function(d){
        body += d;
    }).on('end', function(){
        console.log(res.headers)
        console.log(body)
    });

}).on('error', function(e) {
    console.log("Got error: " + e.message);
});
req.end();
*/


var https = require('https')
    ,req
    ,opt={
        host:'10.200.0.254'//代理服务器的IP
        ,port:8080//代理服务器的端口
        ,path:'http://www.googleapis.com/language/translate/v2?key=INSERT-YOUR-KEY&source=en&target=de&q=Hello%20world'//真实请求的url
    }
    ,body='';

req = https.get(opt,function(res){
    console.log("Got response: " + res.statusCode);
    res.on('data',function(d){
        body += d;
    }).on('end', function(){
        console.log(body)
    });
}).on('error', function(e) {
    console.log("Got error: " + e.message);
});