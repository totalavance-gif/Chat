document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Aquí es donde capturamos los datos para Python
    const email = document.getElementById('email').value;
    console.log("Iniciando validación para:", email);

    // Simulación: Esperamos medio segundo y entramos al chat
    setTimeout(() => {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('chat-screen').classList.add('active');
    }, 500);
});

// Enviar mensaje visualmente
document.getElementById('send-btn').addEventListener('click', () => {
    const input = document.getElementById('message-input');
    if (input.value.trim() !== "") {
        const area = document.getElementById('message-area');
        const msg = document.createElement('div');
        msg.className = 'message sent';
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        msg.innerHTML = `<p>${input.value}</p><span>${time}</span>`;
        area.appendChild(msg);
        
        input.value = "";
        area.scrollTop = area.scrollHeight; // Scroll al final
    }
});

// Enviar con la tecla Enter
document.getElementById('message-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('send-btn').click();
    }
});
