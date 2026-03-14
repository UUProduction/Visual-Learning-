function bindMenu() {
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('side-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
  });
  document.addEventListener('click', function(e) {
    if (!menu.contains(e.target) && e.target !== toggle) {
      toggle.classList.remove('open');
      menu.classList.remove('open');
    }
  });
}

function showToast(msg, type) {
  type = type || '';
  var c = document.getElementById('toast-container');
  if (!c) return;
  var t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(function() { t.remove(); }, 3200);
}

function populateUserUI(user) {
  document.querySelectorAll('[data-user-name]').forEach(function(el) {
    el.textContent = user.displayName || 'Student';
  });
  document.querySelectorAll('[data-user-photo]').forEach(function(el) {
    el.src = user.photoURL || 'assets/default-avatar.png';
  });
}

function bindLogout() {
  var btn = document.getElementById('logout-btn');
  if (!btn) return;
  btn.addEventListener('click', function() {
    firebase.auth().signOut().then(function() {
      window.location.href = 'main.html';
    });
  });
}

function requireAuth(redirect) {
  redirect = redirect || 'login.html';
  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) window.location.href = redirect;
  });
}

function redirectIfAuth(to) {
  to = to || 'student-home.html';
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) window.location.href = to;
  });
}
