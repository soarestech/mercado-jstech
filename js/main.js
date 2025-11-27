// ---------------- Versão do App automáticA ----------------

// Pega a versão exposta pelo service worker OU usa um fallback temporário
let appVersion = "carregando...";

if (navigator.serviceWorker && navigator.serviceWorker.controller) {
  // Tenta pegar a versão que o SW expôs
  if ('APP_VERSION' in navigator.serviceWorker.controller) {
    appVersion = navigator.serviceWorker.controller.APP_VERSION;
  }
}

// Quando o SW assumir o controle após atualização:
navigator.serviceWorker?.addEventListener("controllerchange", () => {
  if ('APP_VERSION' in navigator.serviceWorker.controller) {
    appVersion = navigator.serviceWorker.controller.APP_VERSION;

    // Atualiza a versão na splash caso ela ainda esteja visível
    const splashVersion = document.getElementById('splashVersion');
    if (splashVersion) splashVersion.textContent = appVersion;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Setar versão apenas na Splash
  const splashVersion = document.getElementById('splashVersion');
  if (splashVersion) splashVersion.textContent = appVersion;

  // Splash e app principal
  const splash = document.getElementById('splashScreen');
  const app = document.getElementById('app');
  if (!splash || !app) return;

  // Inicialmente esconder app principal
  app.style.display = 'none';

  // Temporizador para sumir a splash
  setTimeout(() => {
    splash.classList.add('fade-out'); // aplica fade
    setTimeout(() => {
      splash.style.display = 'none';
      app.style.display = 'flex';
    }, 800); // duração do fade (CSS)
  }, 1500); // tempo visível da splash
});
