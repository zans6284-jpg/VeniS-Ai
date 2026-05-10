// script.js
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

// Auto-focus input saat halaman dimuat
window.onload = () => {
    userInput.focus();
    appendMessage('ai', '👋🔥 Hai sayang... Aku siap melayanimu. Apa hasratmu hari ini? 😈💋');
};

// Kirim pesan dengan tombol Enter
userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Tampilkan pesan user
    appendMessage('user', message);
    userInput.value = '';
    userInput.focus();

    // Tampilkan status mengetik...
    const typingId = 'typing-' + Date.now();
    appendMessage('ai', '💭 <em>Meraba hasratmu sedalam-dalamnya...</em>', typingId);

    try {
        // Panggil Serverless Function backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: message })
        });

        const data = await response.json();

        // Hapus status mengetik
        removeMessage(typingId);

        // Tampilkan hasil AI
        if (data.reply) {
            appendMessage('ai', data.reply);
        } else {
            appendMessage('ai', '⚠️ Tidak ada respon dari AI, coba lagi sayang...');
        }

    } catch (error) {
        removeMessage(typingId);
        appendMessage('ai', '💔 Koneksi terputus... Ulangi lagi ya sayang, aku masih haus melayanimu...');
        console.error('Error:', error);
    }
}

function appendMessage(sender, text, messageId = null) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    if (messageId) div.id = messageId;
    div.innerHTML = text;
    chatBox.appendChild(div);
    // Auto-scroll ke bawah
    chatBox.scrollTop = chatBox.scrollHeight;
    return div;
}

function removeMessage(messageId) {
    const element = document.getElementById(messageId);
    if (element) {
        element.remove();
    }
}
