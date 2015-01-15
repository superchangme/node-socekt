/**
 * Created by tom.chang on 2015/1/15.
 */
var http = require('http'),
    io = require('socket.io'),
    fs = require('fs');
var WS={

}
var Players=[]
var Round=0;
var Count=0;
var roundTimer;
var stoneMap=["石头","剪刀","布"]

/*
httpProxy.createProxyServer({target:'http://localhost:9000'}).listen(8000);
*/
// 虽然我们这里使用了同步的方法，那会阻塞 Node 的事件循环，但是这是合理的，因为 readFileSync() 在程序周期中只执行一次，而且更重要的是，同步方法能够避免异步方法所带来的“与 SocketIO 之间额外同步的问题”。当 HTML 文件读取完毕，而且服务器准备好之后，如此按照顺序去执行就能让客户端马上得到 HTML 内容。
/*
var sockFile = fs.readFileSync('socket.html');
*/

// Socket 服务器还是构建于 HTTP 服务器之上，因此先调用 http.createServer()
server = http.createServer();
server.on('request', function(req, res){
    // 一般 HTTP 输出的格式
    /*res.writeHead(200, {'content-type': 'text/html'});
    res.end(sockFile);*/
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write("Hello World!");
    res.end();
});

server.listen(8080);

var socket = io.listen(server); // 交由 Socket.io 接管

// Socket.io 真正的连接事件
socket.on('connection', function(client){
    console.log('Client connected');
    client.send('Welcome client ' + client.sessionId); // 向客户端发送文本
    client.on("gameStone",function(data){
        if(Players.length<=2){
            client.join("gameStone");
            Players.push({name:data.name});
            console.log(data.name+"玩家进入")
            if(Players.length==2){
                //ready
                nextRound();
            }else{
                client.emit('wait', "等待玩家进入");
            }
        }
    });

    client.on("chu",function(name,result){
        var other,player;

        for(var i in Players){
            if(Players[i].name==name){
                player=Players[i]
            }else{
                other=Players[i];
            }
        }
        player.result=result;
        Count++;
        console.log("回合"+Round+"玩家"+player.name+"出了"+stoneMap[player.result])
        if(Count==2){
            Count==0;
            nextRound();
            //1 石头 2剪子  3布
            socket.sockets.in("gameStone").emit('roundOver',getWinner());
        }
    });

    function nextRound(){
        setTimeout(function(){
            socket.sockets.in("gameStone").emit('ready',Players,++Round);
        },500);
        roundTimer=setTimeout(function(){
            getWinner();
        },5500);
    }
    function getWinner(){
        clearInterval(roundTimer);
        var winner,player,other;
        for(var i in Players){
            if(!other){
                other=Players[i]
            }
            if(!player){
                player=Players[i]
            }
        }
        if(other.result==player.result){
            winner=""
        }else if(other.result-player.result==1){
            winner=player.name;
        }else if(other.result-player.result==-1) {
            winner = other.name;
        }else if(other.result-player.result==2){
            winner=other.name;
        }else{
            winner=player.name;
        }
        Count==0;
        for(var name in Players){
            Players[name].result=null;
        }
        console.log("第"+Round+"局,获胜者是:"+winner)
        return winner;
    }
});
