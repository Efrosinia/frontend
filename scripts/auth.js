// auth.js – shared script for login and registration

// Simulated user database using localStorage
const USERS_KEY = 'recomfilm_users';

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Registration
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('newUsername').value.trim();
        const password = document.getElementById('newPassword').value;
        const messageEl = document.getElementById('registerMessage');

        const users = getUsers();

        if (users.some(user => user.username === username)) {
            messageEl.textContent = '❌ A user with this username already exists.';
            return;
        }

        if (password.length < 8) {
            messageEl.textContent = '❌ Password must be at least 8 characters long.';
            return;
        }

        users.push({ username, password });
        saveUsers(users);

        messageEl.textContent = '✅ Registration successful! You can now log in.';
        document.getElementById('registerForm').reset();
    });
}

// Login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const messageEl = document.getElementById('loginMessage');

        const users = getUsers();
        const user = users.find(u => u.username === username);

        if (!user) {
            messageEl.textContent = '❌ No user found with this username.';
            return;
        }

        if (user.password !== password) {
            messageEl.textContent = '❌ Incorrect password.';
            return;
        }

        localStorage.setItem('loggedInUser', username);
        messageEl.textContent = `✅ Welcome, ${username}! You are now logged in.`;

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });
}

// Logout function for index.html
function logout() {
    localStorage.removeItem('loggedInUser');
    location.reload();
}

// Show/hide login/logout elements on index.html
function updateAuthUI() {
    const username = localStorage.getItem('loggedInUser');
    const loginBlock = document.getElementById('authStatus');

    if (loginBlock) {
        if (username) {
            loginBlock.innerHTML = `
                👋 Hello, <strong>${username}</strong> 
                <button onclick="logout()">Logout</button>
            `;
        } else {
            loginBlock.innerHTML = `
                <a href="login.html">Login</a> or 
                <a href="register.html">Register</a>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', updateAuthUI);