const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let participants = []; // 참여자 목록을 저장할 배열

app.use(express.static(__dirname + '/public'));

// 클라이언트 요청에 대해 index.html 파일 제공
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 클라이언트 연결 시
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // 클라이언트가 'set username' 이벤트를 보낼 때
    socket.on('set username', (userName) => {
        socket.userName = userName; // 사용자 이름 저장
        participants.push(userName); // 참여자 목록에 이름 추가
        
        // 새로 연결된 클라이언트에게 모든 참여자 목록을 보내기
        io.emit('update participants', participants);
    });

    // 채팅 메시지 처리
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // 모든 클라이언트에게 메시지 방송
    });

    // 클라이언트가 연결 종료 시
    socket.on('disconnect', () => {
        console.log('A user disconnected: '+socket.userName);
        participants = participants.filter(user => user !== socket.userName);
        io.emit('update participants', participants); // 참여자 목록 업데이트
    });
});

// 서버 실행
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// server.listen(3000, () => {
//     console.log('Server running on http://localhost:3000');
// });
