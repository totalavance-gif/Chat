// CONFIGURACIÓN: Reemplaza con tu URL de Railway si cambia
const RAILWAY_URL = "https://motor-python-production.up.railway.app";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginScreen = document.getElementById('login-screen');
    const chatScreen = document.getElementById('chat-screen');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const messageArea = document.getElementById('message-area');
    const displayName = document.getElementById('display-name');

    // 1. LÓGICA DE LOGIN
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('button');

        // Estado de carga
        submitBtn.innerText = "Validando en Motor Central...";
        submitBtn.disabled = true;

        try {
            const response = await fetch(`${RAILWAY_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.status === "success") {
                // ÉXITO: Guardamos el ID único en la memoria del navegador
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('username', data.username);

                // Transición de pantalla
                loginScreen.classList.remove('active');
                chatScreen.classList.add('active');
                
                // Personalizar interfaz
                displayName.innerText = data.username;
                console.log("Conectado con ID:", data.user_id);
            } else {
                alert("Error: El motor no autorizó el acceso.");
                submitBtn.innerText = "ENTRAR";
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con Railway. Revisa que el motor esté Online.");
            submitBtn.innerText = "ENTRAR";
            submitBtn.disabled = false;
        }
    });

    // 2. LÓGICA DE ENVÍO DE MENSAJES
    const sendMessage = () => {
        const text = messageInput.value.trim();
        if (text !== "") {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            // Crear burbuja de mensaje enviado
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message sent';
            msgDiv.innerHTML = `
                <p>${text}</p>
                <span>${time}</span>
            `;
            
            messageArea.appendChild(msgDiv);
            messageInput.value = ""; // Limpiar input
            messageArea.scrollTop = messageArea.scrollHeight; // Auto-scroll al fondo
            
            // AQUÍ IRÁ LA CONEXIÓN WEBSOCKET MÁS ADELANTE
            console.log("Mensaje listo para enviar al motor central");
        }
    };

    sendBtn.addEventListener('click', sendMessage);

    // Enviar con la tecla Enter
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});
                                         
