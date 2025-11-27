// ---------------- Versão do App manual ----------------
let appVersion = "1.0.2"; // ⚡ Defina a versão manualmente aqui

document.addEventListener('DOMContentLoaded', () => {
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
