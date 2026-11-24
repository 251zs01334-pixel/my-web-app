'use strict';
const http=require('node:http');
const port=process.env.PORT||8000;
const server=http.createServer((req,res)=>{
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
  res.end('<h1>サーバーサイドWebアプリ 稼働中</h1><p>パス: '+req.url+'</p>');
});
server.listen(port,()=>console.info('Listening on http://localhost:'+port));
