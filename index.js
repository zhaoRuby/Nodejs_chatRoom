var express = require('express');
var app = express();
var onlineClient = 0;


var server = require('http').Server(app);
io = require('socket.io')(server);


app.use(express.static("."));

app.get('/',function(res,res){
	res.sendFile(__dirname + '/chatRoom/index.html');
});

// when connnect
io.on('connection',function(socket){
	onlineClient++;
	io.emit('onlineNumber',onlineClient);


	socket.on('disconnect',function(){
		//計算線上人數
		onlineClient = (onlineClient < 0) ? 0 : onlineClient=onlineClient-1;
		//傳送線上人數給前端
		io.emit('onlineNumber',onlineClient);
	});

	socket.on('msg',function(data){
		//console.log("USERNAME:"+data.userName+",MSG:"+data.msg);
		var now = new Date();
        var datetime = now.getFullYear()+'/'+(now.getMonth()+1)+'/'+now.getDate()+'/'+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
		var msg = "訊息："+datetime+"－"+ data.userName+"："+data.msg;
		io.emit('chatmsg',msg);
	});


});

server.listen(8000,function(){
	console.log('Server started. localhost:8000');
});