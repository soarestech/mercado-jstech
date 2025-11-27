// ---------------- Versão do App automáticA ----------------
let appVersion = "carregando...";

// ⚡ Função para pedir a versão ao Service Worker
function fetchSWVersion() {
  return new Promise((resolve) => {
    if (!navigator.serviceWorker.controller) return resolve(null);

    const msgChannel = new MessageChannel();
    msgChannel.port1.onmessage = (event) => {
      if (event.data?.type === "VERSION") resolve(event.data.version);
      else resolve(null);
    };

    navigator.serviceWorker.controller.postMessage({ type: "GET_VERSION" }, [msgChannel.port2]);
  });
}

// Quando o SW assumir o controle após atualização:
navigator.serviceWorker?.addEventListener("controllerchange", async () => {
  const splashVersion = document.getElementById('splashVersion');
  const swVersion = await fetchSWVersion();
  if (swVersion) appVersion = swVersion;

  if (splashVersion) splashVersion.textContent = appVersion;
});

document.addEventListener('DOMContentLoaded', async () => {
  // ⚡ Pega versão do SW e atualiza a splash
  const splashVersion = document.getElementById('splashVersion');
  const swVersion = await fetchSWVersion();
  if (swVersion) appVersion = swVersion;

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
