var http = require('http')
var fs = require('fs')
var url = require('url')

//console.log(Object.keys(http))
var port = process.env.PORT || 8888;

var server = http.createServer(function (request, response) {

    var temp = url.parse(request.url, true)
    var path = temp.pathname
    var query = temp.query
    var method = request.method

    //从这里开始看，上面不要看
    if (method === "GET") {
        if (path === '/') {  // 如果用户请求的是 / 路径
            var string = fs.readFileSync('./index.html')
            response.setHeader('Content-Type', 'text/html;charset=utf-8')
            response.end(string)
        } else if (path === '/style.css') {
            var string = fs.readFileSync('./style.css')
            response.setHeader('Content-Type', 'text/css')
            response.end(string)
        } else if (path === '/main.js') {
            var string = fs.readFileSync('./main.js')
            response.setHeader('Content-Type', 'application/javascript')
            response.end(string)
        } else {
            response.statusCode = 404
            response.setHeader('Content-Type', 'text/html;charset=utf-8')
            response.end('找不到对应的路径，你需要自行修改 index.js')
        }
    } else {
        if (path === '/xxx') {
            response.setHeader('Content-Type', 'text/html;charset=utf-8')
            //第38行-44行获取响应内容
            let body = [];
            request.on('error', (err) => {
                console.error(err);
            }).on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                let parts = body.split('&')
                let username = parts[0].split('=')[1]
                let password = parts[1].split('=')[1]
                //收集错误信息
                let error = {}
                //后端验证
                if(username.trim() === ''){
                    error['username'] = '账户名不能为空'
                }else if(username !== 'lzc'){
                  error['username'] = '用户名不存在'
                }else if(username === 'lzc'){
                    if(password === ''){
                      error['password'] = '密码不能为空'
                    }else if(password !== '1314'){
                       error['password'] = '密码错误'
                    }
                }
                if(password === ''){
                    error['password'] = '密码不能为空'
                }else if(password !== '1314'){
                    error['password'] = '密码错误'
                }
                // Object.keys(对象).length获取对象的长度
                if(Object.keys(error).length > 0){
                    response.statusCode = 412
                    //{error:error}是为了方便前端识别这是个错误
                    let string = JSON.stringify({error:error})
                    response.end(string)
                }else{
                    response.statusCode = 200
                    response.end('Hello AJAX')
                }
                // At this point, we have the headers, method, url and body, and can now
                // do whatever we need to in order to respond to this request.
            });
        }else{  //请求的路径部队
            response.statusCode = 404
           response.setHeader('Content-Type','text/html;charset=utf-8')
           response.end('路径不对')
        }
    }


    // 代码结束，下面不要看
    console.log(method + ' ' + request.url)
})

server.listen(port)
console.log('监听 ' + port + ' 成功，请用浏览器打开 http://localhost:' + port)
