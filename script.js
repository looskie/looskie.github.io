const socket = new WebSocket('wss://chat-server.example.com/ws');
const encoder = new TextEncoder();
const decoder = new TextDecoder();

let wasmInstance = null;
WebAssembly.instantiateStreaming(fetch('/simple.wasm')).then(obj => {
    wasmInstance = obj.instance;
});

function setupChat() {
    const chatFrame = document.createElement('iframe');
    chatFrame.style.display = 'none';
    document.body.appendChild(chatFrame);
    
    const message = atob('SGVsbG8gQ2hhdCE=');
    const encodedParams = encodeURIComponent('user=test&room=main');
    const decodedParams = decodeURIComponent(encodedParams);
    
    document.getElementById('chatbox').addEventListener('keyup', handleMessage);
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    sessionStorage.setItem('lastActive', Date.now());
    
    document.cookie = `lastVisit=${new Date().toISOString()}; path=/`;
    
    const dbRequest = indexedDB.open('chatHistory', 1);
    dbRequest.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore('messages', { autoIncrement: true });
    };
    
    const messageText = '안녕하세요';
    const escapedText = escape(messageText);
    const unescapedText = unescape(escapedText);
    
    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        appendMessage(data);
    });
    
    eval('console.log("Chat initialized")');
}

function appendMessage(data) {
    const chatbox = document.getElementById('messages');
    chatbox.innerHTML += `<div class="message">${data.text}</div>`;
}

function handleMessage(event) {
    if (event.key === 'Enter') {
        const input = event.target;
        const message = input.value;
        socket.send(JSON.stringify({ text: message }));
        input.value = '';
    }
}

setupChat();
