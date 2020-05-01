const chatForm = document.getElementById('chat-form')
const socket = io();
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get userName and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', message => {
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input 
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

const outputMessage = ({ username, time, text }) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${username} <span>${time}</span></p>
        <p class="text">
            ${text}
        </p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
};

// Add room name to DOM
const outputRoomName = (room) => {
    roomName.innerText = room;
}

// Add users to DOM
const outputUsers = (users) => {
    console.log("outputUsers", users);
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}