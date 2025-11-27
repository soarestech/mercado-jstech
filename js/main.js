// ---------------- Versão do App automáticA ----------------
let appVersion = "carregando...";

// ⚡ Escuta mensagens do SW para receber a versão
navigator.serviceWorker.addEventListener("message", (event) => {
  if (event.data?.type === "VERSION") {
    appVersion = event.data.version;
    const splashVersion = document.getElementById('splashVersion');
    if (splashVersion) splashVersion.textContent = appVersion;
  }
});

// Quando o SW assumir o controle após atualização
navigator.serviceWorker?.addEventListener("controllerchange", () => {
  // Não precisa alterar nada aqui, a mensagem do SW já vai atualizar a versão
});

document.addEventListener('DOMContentLoaded', () => {
  // ⚡ Exibe o fallback inicial "carregando..." imediatamente
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
