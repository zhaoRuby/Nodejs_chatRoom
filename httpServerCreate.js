// build a http module
var http = require('http');
//解析URL網址
var url = require('url');
//處理檔案
var fs = require('fs');
//
var io = require('socket.io'); 


// build HTTP server
// 設handleRequest變數，接收HTTP的request和response
var server = http.createServer(function(request,response){
	console.log('Connection');  // SERVER端回應，表示有CLIENT端連上SERVER
	var path = url.parse(request.url).pathname; //解析網址中指定的路徑
	//__dirname 顯示目前執行js的路徑
	//以下為建立網頁ROUTER，當頁面過多程式碼過於繁雜可使用express模組
	switch (path) {
		case '/':
			//console.log(__dirname +"path"+ path);
			response.writeHead(200,{'Content-Type':'text/html'});
			response.write('hell world!');
			response.end();
			break;

		case '/socket.html':
			//console.log(__dirname +"path"+ path);
			// 用fs讀取socket.html這個檔案
			fs.readFile(__dirname + path, function(error,data){
				if(error){
					//console.log(error);
					response.writeHead(404);
					response.write('opps this doesnt exist - 404');
				}else{
					response.writeHead(200,{'Content-Type':'text/html'});
					response.write(data, 'utf8');
				}
				response.end();
			});
			break;

		default:
			response.writeHead(404);
			response.write('opps this doesnt exist 404');
			response.end();
			break;
	}
}); 


server.listen('8000','localhost',function(){ //設定聆聽的port
	console.log('HTTP伺服器在127.0.0.1:8000上運行中');
});
// 開啟Socket.IO 的listener，讓伺服器可以接收WebSocket連線
var server_io = io.listen(server); 
//server_io.set('log level',1);

// 將socketio內建的CONNECTION事件串起，當連線建立時即會啟動
// 事件資料為JSON格式
server_io.sockets.on('connection',function(socket){

	setInterval(function(){
		socket.emit('message',{'message': new Date()});
	},1000);
	
	//聆聽來自client_data事件
	socket.on('client_data', function(data){
		process.stdout.write(data.letter); //不會換行的console.log
	}); 
});
