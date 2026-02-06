// CONFIGURACIÓN: URL de tu motor en Railway
const RAILWAY_URL = "https://motor-python-production.up.railway.app";

document.addEventListener('DOMContentLoaded', () => {
    // Elementos de Pantalla
    const loginScreen = document.getElementById('login-screen');
    const chatScreen = document.getElementById('chat-screen');
    
    // Elementos de Login
    const loginForm = document.getElementById('login-form');
    
    // Elementos de Contactos
    const contactInput = document.getElementById('contact-email-search');
    const addContactBtn = document.getElementById('add-contact-btn');
    const contactsList = document.getElementById('contacts-list');
    
    // Elementos de Chat
    const displayName = document.getElementById('display-name');
    const chatStatus = document.getElementById('chat-status');
    const chatAvatar = document.getElementById('current-chat-avatar');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const messageArea = document.getElementById('message-area');

    let contactoSeleccionado = null;

    // 1. LÓGICA DE LOGIN (Vercel -> Railway)
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = loginForm.querySelector('button');

        btn.innerText = "Conectando al Motor...";
        btn.disabled = true;

        try {
            const response = await fetch(`${RAILWAY_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (data.status === "success") {
                loginScreen.classList.remove('active');
                chatScreen.classList.add('active');
                console.log("Sesión iniciada. ID:", data.user_id);
            } else {
                alert("Acceso denegado");
                btn.innerText = "ENTRAR AL MOTOR";
                btn.disabled = false;
            }
        } catch (error) {
            alert("Error: El motor central en Railway no responde.");
            btn.innerText = "ENTRAR AL MOTOR";
            btn.disabled = false;
        }
    });

    // 2. BUSCAR Y AGREGAR CONTACTO
    addContactBtn.addEventListener('click', async () => {
        const email = contactInput.value.trim();
        if (!email) return;

        addContactBtn.disabled = true;

        try {
            const response = await fetch(`${RAILWAY_URL}/search_user/${email}`);
            const data = await response.json();

            if (data.status === "found") {
                agregarAvatarALista(data.username, data.email);
                contactInput.value = "";
            } else {
                alert("El usuario no existe en el motor central.");
            }
        } catch (error) {
            alert("Error al buscar en el motor.");
        } finally {
            addContactBtn.disabled = false;
        }
    });

    function agregarAvatarALista(username, email) {
        // Evitar duplicados simples
        if (document.getElementById(`c-${username}`)) return;

        const div = document.createElement('div');
        div.className = 'contact-item';
        div.id = `c-${username}`;
        div.innerHTML = `
            <div class="contact-avatar">${username[0].toUpperCase()}</div>
            <small>${username}</small>
        `;

        div.onclick = () => seleccionarContacto(username, div);
        contactsList.appendChild(div);
    }

    // 3. SELECCIONAR CONTACTO PARA CHATEAR
    function seleccionarContacto(username, elemento) {
        // Quitar activo de otros
        document.querySelectorAll('.contact-item').forEach(i => i.classList.remove('active'));
        elemento.classList.add('active');

        // Actualizar Interfaz
        contactoSeleccionado = username;
        displayName.innerText = username;
        chatStatus.innerText = "En línea (Seguro)";
        chatAvatar.innerText = username[0].toUpperCase();
        chatAvatar.style.background = "#075E54";

        // Desbloquear Chat
        messageInput.disabled = false;
        sendBtn.disabled = false;
        messageInput.placeholder = `Escribir a ${username}...`;
        
        // Limpiar área de mensajes para nueva conversación
        messageArea.innerHTML = `<div class="system-notice"><p>Chat cifrado con ${username}</p></div>`;
    }

    // 4. ENVIAR MENSAJES (Visual)
    const enviarMensaje = () => {
        const texto = messageInput.value.trim();
        if (!texto || !contactoSeleccionado) return;

        const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message sent';
        msgDiv.innerHTML = `<p>${texto}</p><span>${hora}</span>`;

        messageArea.appendChild(msgDiv);
        messageInput.value = "";
        messageArea.scrollTop = messageArea.scrollHeight;
    };

    sendBtn.addEventListener('click', enviarMensaje);
    messageInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') enviarMensaje(); });
});
