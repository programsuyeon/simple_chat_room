const nameContainer = document.getElementById('name-container');
const chatContainer = document.getElementById('chat-container');
const startChatButton = document.getElementById('start-chat');
const nameInput = document.getElementById('name-input');
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const participantContainer = document.getElementById('participant-container');
const participantList = document.getElementById('participant-list');
let userName = '';

//Socket.IO 클라이언트 초기화
const socket = io();

//사용자가 이름을 입력하고 채팅 시작
function startChat() {
    userName = nameInput.value.trim();
    if (userName === '') {
        alert('이름을 입력해주세요');
        return;
    }
    
    // 이름 입력 화면 숨기고 채팅 화면 보이기
    nameContainer.style.display = 'none';
    chatContainer.style.display = 'block';
    participantContainer.style.display = 'block';

    //입력된 이름을 참여자 리스트에 추가
    // const myName = document.getElementById('my-name');
    // myName.innerHTML = '<strong>🙍🏻‍♀️ ' + userName + '</strong>';
    
    // 채팅 시작 시 'set username' 이벤트를 서버에 전송
    socket.emit('set username', userName);

    //채팅 입력 필드에 포커스 주기
    input.focus();
};

//1.버튼 클릭시 채팅 시작 이벤트 연결
startChatButton.addEventListener('click', startChat);

//2. 엔터 키 누를시 채팅 시작 이벤트 연결
nameInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        console.log("엔터키 눌림, startChat 호출");
        startChat();
    }
});

// 채팅 메시지 전송 처리
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const message = input.value;
    if (message.trim() === '') return;

    // 서버에 채팅 메세지 보내기
    socket.emit('chat message', `<strong>${userName}:</strong> ${message}`);
    input.value = '';
});

// 채팅 메시지 수신 처리
socket.on('chat message', function(msg){
    const newMessage = document.createElement('p');

    if (msg.startsWith("<strong>"+userName)) {
        newMessage.style.color = '#007bff';
    }
    newMessage.innerHTML = msg;
    chatMessages.appendChild(newMessage);

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// 참여자 목록 업데이트
socket.on('update participants', function(participants){
    participantList.innerHTML = ''; // 기존 목록 지우기
    participants.forEach(function(participant) {
        const participantItem = document.createElement('li');

        if(participant === userName) {
            participantItem.innerHTML = `<strong>🙍🏻‍♀️ ${participant}</strong>`;
        } else {
            participantItem.innerHTML = participant;
        }

        participantList.appendChild(participantItem);
    });
});

//초기 상태 설정
window.onload = function() {
    nameInput.focus();
    chatContainer.style.display = 'none';
    participantContainer.style.display = 'none';
}
