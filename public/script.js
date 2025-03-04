const socket = io();

function joinChat() {
    const username = document.getElementById('username').value.trim();
    socket.emit('join', username);
    document.getElementById('username-section').style.display = 'none';
    document.getElementById('chat-section').style.display = 'block';
    document.getElementById('message-input').focus();
}

document.getElementById('message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    if (message) {
        socket.emit('chat message', message);
        input.value = '';
    }
});

socket.on('chat message', (msg) => {
    const messages = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `
        <span class="username">${msg.username}</span>
        <span class="text">${msg.message}</span>
        <span class="timestamp">${new Date(msg.timestamp).toLocaleTimeString()}</span>
    `;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
});

socket.on('user joined', (msg) => {
    const messages = document.getElementById('messages');
    const joinDiv = document.createElement('div');
    joinDiv.className = 'message';
    joinDiv.style.color = '#28a745';
    joinDiv.textContent = msg;
    messages.appendChild(joinDiv);
    messages.scrollTop = messages.scrollHeight;
});

socket.on('user left', (msg) => {
    const messages = document.getElementById('messages');
    const leftDiv = document.createElement('div');
    leftDiv.className = 'message';
    leftDiv.style.color = '#dc3545';
    leftDiv.textContent = msg;
    messages.appendChild(leftDiv);
    messages.scrollTop = messages.scrollHeight;
});