const RAILWAY_URL = "https://motor-python-production.up.railway.app";

document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DE PANTALLAS Y LOGIN ---
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const btn = loginForm.querySelector('button');
        btn.disabled = true;

        try {
            const res = await fetch(`${RAILWAY_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: document.getElementById('password').value })
            });
            const data = await res.json();
            if (data.status === "success") {
                localStorage.setItem('username', data.username);
                document.getElementById('display-name').innerText = data.username;
                document.getElementById('login-screen').classList.remove('active');
                document.getElementById('chat-screen').classList.add('active');
            }
        } catch (err) { alert("Error de conexión con Railway"); btn.disabled = false; }
    });

    // --- LÓGICA DE PERFIL (MODAL) ---
    const profileModal = document.getElementById('profile-modal');
    const myAvatarTrigger = document.getElementById('my-profile-trigger');
    const closeProfile = document.getElementById('close-profile');

    myAvatarTrigger.onclick = () => {
        profileModal.style.display = 'flex';
        document.getElementById('edit-username').value = document.getElementById('display-name').innerText;
    };

    closeProfile.onclick = () => profileModal.style.display = 'none';

    // Previsualizar Foto
    document.getElementById('upload-pic').addEventListener('change', function(e) {
        const reader = new FileReader();
        reader.onload = function() {
            document.getElementById('profile-preview').innerHTML = `<img src="${reader.result}">`;
            // Actualizar también el avatar del header
            myAvatarTrigger.innerHTML = `<img src="${reader.result}" style="width:100%;height:100%;border-radius:50%">`;
        }
        reader.readAsDataURL(e.target.files[0]);
    });

    document.getElementById('save-profile-btn').onclick = () => {
        const newName = document.getElementById('edit-username').value;
        document.getElementById('display-name').innerText = newName;
        profileModal.style.display = 'none';
        alert("Perfil actualizado (Localmente)");
    };

    // --- BÚSQUEDA DE CONTACTOS ---
    const addBtn = document.getElementById('add-contact-btn');
    addBtn.onclick = async () => {
        const email = document.getElementById('contact-email-search').value;
        if(!email) return;
        try {
            const res = await fetch(`${RAILWAY_URL}/search_user/${email}`);
            const data = await res.json();
            if(data.status === "found") {
                const item = document.createElement('div');
                item.className = 'contact-item';
                item.innerHTML = `<div class="contact-avatar">${data.username[0].toUpperCase()}</div><small>${data.username}</small>`;
                item.onclick = () => {
                    document.getElementById('message-input').disabled = false;
                    document.getElementById('send-btn').disabled = false;
                    alert("Chateando con " + data.username);
                };
                document.getElementById('contacts-list').appendChild(item);
            } else { alert("Usuario no encontrado"); }
        } catch (e) { console.error(e); }
    };
});
            
