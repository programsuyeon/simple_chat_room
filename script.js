const nameContainer = document.getElementById('name-container');
const chatContainer = document.getElementById('chat-container');
const chatHeader = document.getElementById('chat-header');
const startChatButton = document.getElementById('start-chat');
const nameInput = document.getElementById('name-input');
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const participantContainer = document.getElementById('participant-container');
const participantList = document.getElementById('participant-list');
let userName = '';

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
    const myName = document.getElementById('my-name');
    myName.innerHTML = '<strong>🙍🏻‍♀️ '+userName+'</strong>';
    //participantList.appendChild(myName);

    input.focus();
};

//1.버튼 클릭시 채팅 시작 이벤트 연결
startChatButton.addEventListener('click', startChat);

//2. 엔터 키 누를시 채팅 시작 이벤트 연결
nameInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        startChat();
    }
});

// 채팅 메시지 전송 처리
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const message = input.value;
    if (message.trim() === '') return;

    const newMessage = document.createElement('p');
    newMessage.innerHTML = `<strong>${userName}:</strong> ${message}`;
    chatMessages.appendChild(newMessage);
    input.value = '';

    // 스크롤을 아래로 자동 이동
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//초기 상태 설정
window.onload = function() {
    nameInput.focus();
    chatContainer.style.display = 'none';
    participantContainer.style.display = 'none';
}