async function sendMessage() {
    let input = document.getElementById("userInput");
    let message = input.value.trim();

    if (message === "") return;

    let chatbox = document.getElementById("chatbox");

    // Add user message
    let userMsg = document.createElement("div");
    userMsg.className = "user";
    userMsg.innerText = message;
    chatbox.appendChild(userMsg);

    input.value = "";
    scrollToBottom(); // Scroll after user message

    try {
        const response = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        // Add bot message
        let botMsg = document.createElement("div");
        botMsg.className = "bot";
        botMsg.innerText = data.reply;
        chatbox.appendChild(botMsg);

        scrollToBottom(); // Scroll after bot reply

    } catch (error) {
        let botMsg = document.createElement("div");
        botMsg.className = "bot";
        botMsg.innerText = "Server error. Please try again.";
        chatbox.appendChild(botMsg);
        scrollToBottom();
    }
}

// Helper to handle auto-scrolling
function scrollToBottom() {
    const chatbox = document.getElementById("chatbox");
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Enter key support
document.getElementById("userInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});