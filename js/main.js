// ---------------- Versão do App automáticA ----------------
let appVersion = "carregando...";

// ⚡ BLOCO MÍNIMO: escuta mensagens do SW e atualiza a splash
navigator.serviceWorker?.addEventListener("message", (event) => {
  if (event.data?.type === "VERSION") {
    appVersion = event.data.version;
    const splashVersion = document.getElementById('splashVersion');
    if (splashVersion) splashVersion.textContent = appVersion;
  }
});

// =======================
// Resto do main.js intacto
// =======================

document.addEventListener('DOMContentLoaded', () => {
  const splashVersion = document.getElementById('splashVersion');
  if (splashVersion) splashVersion.textContent = appVersion;

  const splash = document.getElementById('splashScreen');
  const app = document.getElementById('app');
  if (!splash || !app) return;

  // Inicialmente esconder app principal
  app.style.display = 'none';

  // Temporizador para sumir a splash
  setTimeout(() => {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.style.display = 'none';
      app.style.display = 'flex';
    }, 800);
  }, 1500);
});
