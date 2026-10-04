
const CLIENT_ID = '1556295412757823558';
const REDIRECT_URI = 'https://tommmyshelby.github.io/Fortnite/';

const GHOSTS_DATA = [
    { id: 'ghost_king', name: 'Geister-König (Trophy)', type: 'Exklusiver Geister-Begleiter', img: 'https://i.imgur.com/vH8b3sF.png' },
    { id: 'ghost_phantom', name: 'Phantom Geist', type: 'Sammelbares Phantom', img: 'https://i.imgur.com/vH8b3sF.png' },
    { id: 'ghost_spectre', name: 'Spektral-Überlebender', type: 'Legendärer Überlebender', img: 'https://i.imgur.com/vH8b3sF.png' },
    { id: 'ghost_ghoul', name: 'Ghoul-Schatten', type: 'Halloween Event Geist', img: 'https://i.imgur.com/vH8b3sF.png' },
    { id: 'ghost_shadow', name: 'Schatten-Geist', type: 'Seltene Erscheinung', img: 'https://i.imgur.com/vH8b3sF.png' },
    { id: 'ghost_wraith', name: 'Wraith-Geist', type: 'Epischer Überlebender', img: 'https://i.imgur.com/vH8b3sF.png' }
];

let currentUser = null;
let userCheckedGhosts = [];

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    renderGhosts();
});

// OAuth2 Auth Workflow
function initAuth() {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get('access_token');

    if (accessToken) {
        // Access Token vorhanden -> Userdaten von Discord abrufen
        fetch('https://discord.com/api/users/@me', {
            headers: { authorization: `Bearer ${accessToken}` }
        })
        .then(res => res.json())
        .then(user => {
            if (user.id) {
                currentUser = user;
                window.location.hash = ''; // Token aus der URL entfernen
                loadUserData();
                updateUI();
            }
        })
        .catch(err => console.error("Discord Auth Fehler:", err));
    } else {
        // Prüfen ob Session im LocalStorage gespeichert ist
        const savedUser = localStorage.getItem('discord_user');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            loadUserData();
            updateUI();
        }
    }

    document.getElementById('login-btn').addEventListener('click', loginWithDiscord);
    document.getElementById('logout-btn').addEventListener('click', logout);
}

function loginWithDiscord() {
    const authUrl = `https://discord.com/oauth2/authorize?client_id=\({CLIENT_ID}&redirect_uri=\){encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify`;
    window.location.href = authUrl;
}

function logout() {
    currentUser = null;
    userCheckedGhosts = [];
    localStorage.removeItem('discord_user');
    updateUI();
    renderGhosts();
}

function loadUserData() {
    if (!currentUser) return;
    localStorage.setItem('discord_user', JSON.stringify(currentUser));
    
    // Gespeicherte Geister pro Discord User-ID laden
    const savedChecks = localStorage.getItem(`ghosts_${currentUser.id}`);
    userCheckedGhosts = savedChecks ? JSON.parse(savedChecks) : [];
}

function saveUserData() {
    if (!currentUser) return;
    localStorage.setItem(`ghosts_${currentUser.id}`, JSON.stringify(userCheckedGhosts));
}

function updateUI() {
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const warning = document.getElementById('auth-warning');

    if (currentUser) {
        loggedOutView.classList.add('hidden');
        loggedInView.classList.remove('hidden');
        warning.classList.add('hidden');

        document.getElementById('user-name').textContent = currentUser.global_name || currentUser.username;
        const avatarUrl = currentUser.avatar 
            ? `https://cdn.discordapp.com/avatars/\({currentUser.id}/\){currentUser.avatar}.png` 
            : `https://cdn.discordapp.com/embed/avatars/0.png`;
        document.getElementById('user-avatar').src = avatarUrl;
    } else {
        loggedOutView.classList.remove('hidden');
        loggedInView.classList.add('hidden');
        warning.classList.remove('hidden');
    }

    updateProgressBar();
}

function toggleGhost(ghostId) {
    if (!currentUser) {
        alert("Bitte melde dich erst mit Discord an!");
        return;
    }

    const index = userCheckedGhosts.indexOf(ghostId);
    if (index > -1) {
        userCheckedGhosts.splice(index, 1);
    } else {
        userCheckedGhosts.push(ghostId);
    }

    saveUserData();
    renderGhosts();
    updateProgressBar();
}

function renderGhosts() {
    const container = document.getElementById('ghosts-container');
    container.innerHTML = '';

    GHOSTS_DATA.forEach(ghost => {
        const isChecked = userCheckedGhosts.includes(ghost.id);

        const card = document.createElement('div');
        card.className = `ghost-card ${isChecked ? 'checked' : ''}`;

        card.innerHTML = `
