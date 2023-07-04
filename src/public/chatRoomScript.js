// **** init socket io client ****
// connect to socket io server
const socket = io();

// listens to message from server
socket.on("message", (msg) => {
    appendMessageToChatBox(msg);
    scrollToBottom();
});

socket.on("disconnect", () => {
    console.log("disconnect from server");
    socket.close();
});

// **** fucntion calls ****
let username = "";
(async () => {
    const [_, userInfo] = await Promise.all([getMessages(), getUserInfo()]);
    username = userInfo.username;
})();

// **** event listeners ****
// listen to chat form submit and send message to socket server
document.getElementById("chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();
    // do not send empty message
    if (message !== "") {
        const today = new Date();
        const messageBody = { username, message, timestamp: today };
        sendMessage(messageBody);
    }
});

// **** functions ****
async function getUserInfo() {
    const res = await fetch("/user/name");
    const data = await res.json();
    return data;
}
function sendMessage(messageValue) {
    socket.emit("message", messageValue);
}

// get all historical messages and append to chat-box
async function getMessages() {
    const res = await fetch("/messages");
    const result = await res.json();
    const messages = result.messages;
    if (messages.length > 0) {
        messages.forEach(message => {
            appendMessageToChatBox(message);
        });
        scrollToBottom();
    }
}

function appendMessageToChatBox(messageBody) {
    const { username, message, timestamp } = messageBody;
    const localTime = convertToLocalTime(timestamp);
    // once receive, should add to dom
    const parent = document.getElementById("chat-box");
    const messageBox = document.createElement("div");
    messageBox.classList.add("message-box");

    messageBox.innerHTML = `
        <div class="message-header">
            <div class="message-name">${username}</div>
            <div class="message-timestamp">${localTime}</div>
        </div>
        <div class="spacer-v-4"></div>
        <p class="message-content">${message}</p>
    `;
    parent.appendChild(messageBox);
}

function convertToLocalTime(time) {
    return new Date(time).toLocaleDateString([], { hour: "2-digit", minute: "2-digit" });
}

// make sure chat box scrollable area is always at bottom (latest message)
function scrollToBottom() {
    const chatBox = document.querySelector(".chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
}
