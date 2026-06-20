document.addEventListener('DOMContentLoaded', () => {
  const bola = document.getElementById('bolaViewport');
  if (!bola) return;

  function atualizarBola() {
    const w = window.innerWidth;
    bola.classList.remove('desktop','tablet','mobile');
    if (w >= 1024) {
      bola.classList.add('desktop');
      bola.setAttribute('title','Resolução: desktop');
    } else if (w >= 600) {
      bola.classList.add('tablet');
      bola.setAttribute('title','Resolução: tablet');
    } else {
      bola.classList.add('mobile');
      bola.setAttribute('title','Resolução: mobile');
    }
  }

  atualizarBola();
  window.addEventListener('resize', atualizarBola);
  window.addEventListener('orientationchange', atualizarBola);

  const botaoMenu = document.getElementById('botaoMenu');
  const painelMenu = document.getElementById('painelMenu');
  const sobreposicaoMenu = document.getElementById('sobreposicaoMenu');

  function fecharMenu() {
    if (!painelMenu) return;
    painelMenu.classList.remove('is-open');
    if (sobreposicaoMenu) sobreposicaoMenu.classList.remove('active');
    if (botaoMenu) botaoMenu.classList.remove('hidden');
  }

  function abrirMenu() {
    if (!painelMenu) return;
    painelMenu.classList.add('is-open');
    if (sobreposicaoMenu) sobreposicaoMenu.classList.add('active');
    if (botaoMenu) botaoMenu.classList.add('hidden');
  }

  if (botaoMenu && painelMenu) {
    botaoMenu.addEventListener('click', abrirMenu);
  }

  if (sobreposicaoMenu) {
    sobreposicaoMenu.addEventListener('click', fecharMenu);
  }
});
