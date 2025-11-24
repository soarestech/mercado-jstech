// ---------------- Versão do App ----------------
const appVersion = '1.0.0';

window.addEventListener('DOMContentLoaded', () => {
  const versionEl = document.getElementById('mercado-jstech-version');
  if (versionEl) versionEl.textContent = appVersion;
});

// ---------------- Elementos ----------------
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const app = document.getElementById('app');
const changePasswordForm = document.getElementById('changePasswordForm');
const userListScreen = document.getElementById('userListScreen');
const userList = document.getElementById('userList');
const btnBackToApp = document.getElementById('btnBackToApp');
const showUsersBtn = document.getElementById('showUsersBtn');

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const loginMsg = document.getElementById('loginMsg');
const btnGoRegister = document.getElementById('btnGoRegister');

const regUsernameInput = document.getElementById('regUsername');
const regPasswordInput = document.getElementById('regPassword');
const btnRegister = document.getElementById('btnRegister');
const registerMsg = document.getElementById('registerMsg');
const btnGoLogin = document.getElementById('btnGoLogin');

const botao = document.getElementById('botao');
const botaoTema = document.getElementById('tema');
const logoutBtn = document.getElementById('logout');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const deleteUserBtn = document.getElementById('deleteUserBtn');

const newPasswordInput = document.getElementById('newPassword');
const btnChangePassword = document.getElementById('btnChangePassword');
const changePasswordMsg = document.getElementById('changePasswordMsg');
const btnCancelChangePassword = document.getElementById('btnCancelChangePassword');

const mensagem = document.getElementById('mensagem');
const body = document.body;

let db;

// ---------------- IndexedDB ----------------
const request = indexedDB.open('MeuPWA', 1);

request.onupgradeneeded = (event) => {
  db = event.target.result;

  if (!db.objectStoreNames.contains('usuarios')) {
    const store = db.createObjectStore('usuarios', { keyPath: 'username' });
    store.createIndex('username', 'username', { unique: true });
  }
};

request.onsuccess = (event) => {
  db = event.target.result;
  checkLoggedUser();
};

request.onerror = (event) => console.error('Erro IndexedDB', event.target.error);

// ---------------- Funções ----------------
function showScreen(screen) {
  loginForm.style.display = 'none';
  registerForm.style.display = 'none';
  app.style.display = 'none';
  changePasswordForm.style.display = 'none';
  userListScreen.style.display = 'none';

  if (screen === 'login') loginForm.style.display = 'flex';
  if (screen === 'register') registerForm.style.display = 'flex';
  if (screen === 'app') app.style.display = 'flex';
  if (screen === 'changePassword') changePasswordForm.style.display = 'flex';
  if (screen === 'userList') userListScreen.style.display = 'flex';
}

function showApp(user) {
  mensagem.textContent = `Olá, ${user}! 👋`;
  showScreen('app');
}

function verificarLogin(username, password, callback) {
  const tx = db.transaction(['usuarios'], 'readonly');
  const store = tx.objectStore('usuarios');
  const req = store.get(username);

  req.onsuccess = () => {
    callback(req.result && req.result.password === password);
  };
}

function updatePassword(username, newPassword, callback) {
  const tx = db.transaction(['usuarios'], 'readwrite');
  const store = tx.objectStore('usuarios');
  const req = store.get(username);

  req.onsuccess = () => {
    const user = req.result;
    if (user) {
      user.password = newPassword;
      const upd = store.put(user);
      upd.onsuccess = () => callback(true);
      upd.onerror = () => callback(false);
    } else callback(false);
  };
}

function deleteUser(username, callback) {
  const tx = db.transaction(['usuarios'], 'readwrite');
  const store = tx.objectStore('usuarios');
  const req = store.delete(username);

  req.onsuccess = () => callback(true);
  req.onerror = () => callback(false);
}

function checkLoggedUser() {
  const user = localStorage.getItem('loggedUser');
  if (user) showApp(user);
  else showScreen('login');
}

// ---------------- Eventos ----------------
btnLogin.addEventListener('click', () => {
  const user = usernameInput.value;
  const pass = passwordInput.value;

  verificarLogin(user, pass, (success) => {
    if (success) {
      localStorage.setItem('loggedUser', user);
      showApp(user);
    } else {
      loginMsg.textContent = 'Usuário ou senha incorretos!';
    }
  });
});

btnGoRegister.addEventListener('click', () => showScreen('register'));
btnGoLogin.addEventListener('click', () => showScreen('login'));

btnRegister.addEventListener('click', () => {
  const user = regUsernameInput.value.trim();
  const pass = regPasswordInput.value.trim();

  if (!user || !pass) {
    registerMsg.textContent = 'Preencha todos os campos!';
    return;
  }

  const tx = db.transaction(['usuarios'], 'readwrite');
  const store = tx.objectStore('usuarios');
  const req = store.add({ username: user, password: pass });

  req.onsuccess = () => {
    registerMsg.textContent = 'Usuário cadastrado!';
    regUsernameInput.value = '';
    regPasswordInput.value = '';
  };

  req.onerror = () => {
    registerMsg.textContent = 'Erro: usuário já existe!';
  };
});

botao.addEventListener('click', () => {
  mensagem.textContent = 'Você clicou no botão! 🚀';
});

botaoTema.addEventListener('click', () => {
  const newTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
  body.dataset.theme = newTheme;
  localStorage.setItem('theme', newTheme);
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme) body.dataset.theme = savedTheme;

changePasswordBtn.addEventListener('click', () => {
  changePasswordMsg.textContent = '';
  newPasswordInput.value = '';
  showScreen('changePassword');
});

btnCancelChangePassword.addEventListener('click', () => {
  showApp(localStorage.getItem('loggedUser'));
});

btnChangePassword.addEventListener('click', () => {
  const newPass = newPasswordInput.value.trim();

  if (!newPass) {
    changePasswordMsg.textContent = 'Digite a nova senha!';
    return;
  }

  const user = localStorage.getItem('loggedUser');

  updatePassword(user, newPass, (success) => {
    changePasswordMsg.textContent = success ? 'Senha atualizada!' : 'Erro ao atualizar';
    if (success) newPasswordInput.value = '';
  });
});

deleteUserBtn.addEventListener('click', () => {
  const user = localStorage.getItem('loggedUser');

  if (confirm(`Tem certeza que deseja excluir o usuário "${user}"?`)) {
    deleteUser(user, (success) => {
      if (success) {
        alert('Usuário excluído!');
        localStorage.removeItem('loggedUser');
        showScreen('login');
      } else {
        alert('Erro ao excluir usuário.');
      }
    });
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('loggedUser');
  usernameInput.value = '';
  passwordInput.value = '';
  loginMsg.textContent = '';
  showScreen('login');
});

// ---------------- Listar usuários ----------------
function listarUsuarios() {
  userList.innerHTML = '';

  const tx = db.transaction(['usuarios'], 'readonly');
  const store = tx.objectStore('usuarios');
  const req = store.openCursor();

  req.onsuccess = (event) => {
    const cursor = event.target.result;

    if (cursor) {
      const { username, password } = cursor.value;

      const container = document.createElement('div');
      container.style.marginBottom = '15px';

      const userInput = document.createElement('input');
      userInput.value = username;
      userInput.readOnly = true;

      const passInput = document.createElement('input');
      passInput.value = password;
      passInput.type = 'text';
      passInput.readOnly = true;

      container.appendChild(userInput);
      container.appendChild(passInput);
      userList.appendChild(container);

      cursor.continue();
    } else if (!userList.innerHTML) {
      userList.innerHTML = '<p>Nenhum usuário cadastrado.</p>';
    }
  };
}

showUsersBtn.addEventListener('click', () => {
  listarUsuarios();
  showScreen('userList');
});

btnBackToApp.addEventListener('click', () => {
  showApp(localStorage.getItem('loggedUser'));
});

// BOTTOM TABS – Navegação simples
	document.querySelectorAll("#bottomTabs button").forEach(btn => {
	btn.addEventListener("click", () => {
    const page = btn.dataset.page;

    // Remove active de todos
    document.querySelectorAll("#bottomTabs button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Esconde todas as telas
    document.querySelectorAll(".screen").forEach(div => div.style.display = "none");

    // Mostra a tela correspondente
    if (page === "app") {
    document.getElementById("app").style.display = "flex";
    } else {
      window.location.href = "pages/" + page + ".html"; // abre páginas internas
    }
  });
});

// ==================== PULAR SPLASH SE VOLTAR DA HOME ====================
if (localStorage.getItem("skipSplash") === "yes") {
  // Oculta imediatamente a splash
  const splash = document.getElementById("splashScreen");
  if (splash) splash.style.display = "none";

  // Mostra direto a tela correta
  const user = localStorage.getItem("loggedUser");
  if (user) showApp(user);
  else showScreen("login");
}

// ==================== SPLASH SCREEN ====================

// Mostra a versão do app na splash
document.getElementById("splashVersion").textContent = appVersion;

// Some com a splash e mostra login/app
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("splashScreen").style.display = "none";

    // Se já está logado → abre o app
    const user = localStorage.getItem("loggedUser");
    if (user) showApp(user);
    else showScreen("login");
  }, 1500); // tempo da splash: 1.5s (pode ajustar)
});

// ---------------- Service Worker ----------------
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'version') {
      const versionEl = document.getElementById('mercado-jstech-version');
      if (versionEl) versionEl.textContent = event.data.version;
    }
  });

  navigator.serviceWorker.getRegistrations()
    .then((regs) => Promise.all(regs.map((reg) => reg.unregister())))
    .then(() => {
      return navigator.serviceWorker.register('service-worker.js');
    })
    .catch((err) => console.error('Erro SW:', err));
}