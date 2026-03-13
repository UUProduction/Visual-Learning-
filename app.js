import { auth, onAuth, logout } from './firebase.js';

// Auth state guard — call on protected pages
export function requireAuth(redirectTo = 'login.html') {
  return new Promise((resolve) => {
    onAuth(user => {
      if (!user) {
        window.location.href = redirectTo;
      } else {
        resolve(user);
      }
    });
  });
}

// Redirect if already logged in
export function redirectIfAuth(to = 'student-home.html') {
  onAuth(user => {
    if (user) window.location.href = to;
  });
}

// Populate user info into elements with data-user-* attrs
export function populateUserUI(user) {
  document.querySelectorAll('[data-user-name]').forEach(el => {
    el.textContent = user.displayName || 'Student';
  });
  document.querySelectorAll('[data-user-photo]').forEach(el => {
    el.src = user.photoURL || 'assets/default-avatar.png';
  });
  document.querySelectorAll('[data-user-email]').forEach(el => {
    el.textContent = user.email || '';
  });
}

// Logout button handler
export function bindLogout(selector = '#logout-btn') {
  const btn = document.querySelector(selector);
  if (btn) btn.addEventListener('click', async () => {
    await logout();
    window.location.href = 'main.html';
  });
}

// Menu toggle (hamburger)
export function bindMenu(toggleSel = '#menu-toggle', menuSel = '#side-menu') {
  const toggle = document.querySelector(toggleSel);
  const menu = document.querySelector(menuSel);
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && e.target !== toggle) {
      menu.classList.remove('open');
    }
  });
}
