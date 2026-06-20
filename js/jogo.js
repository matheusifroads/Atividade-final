
const gradeOperacoes = document.getElementById('gradeOperacoes');
const gradeRespostas = document.getElementById('gradeRespostas');
const cronometroEl = document.getElementById('cronometro');
const acertosEl = document.getElementById('acertos');
const errosEl = document.getElementById('erros');
const porcentagemEl = document.getElementById('porcentagem');
const mensagemStatus = document.getElementById('mensagemStatus');
const medalha = document.getElementById('medalha');
const botaoReiniciar = document.getElementById('botaoReiniciar');
const botaoNovaRodada = document.getElementById('botaoNovaRodada');
const infoRodada = document.getElementById('infoRodada');


const totalCasas = 8;
let operacoes = [];
let respostas = [];
let acertos = 0;
let erros = 0;
let combinados = 0;
let idCronometro = null;
let segundos = 0;
let rodadaAtual = 1;
let arrastadoAtual = null;


function iniciarJogo() {
  reiniciarContadores();
  gerarRodada();
  iniciarCronometro();
  atualizarPainel();
}


function reiniciarContadores() {
  acertos = 0;
  erros = 0;
  combinados = 0;
  segundos = 0;
  clearInterval(idCronometro);
  cronometroEl.textContent = formatarTempo(segundos);
  acertosEl.textContent = '0';
  errosEl.textContent = '0';
  porcentagemEl.textContent = 'Aproveitamento: 0%';
  mensagemStatus.textContent = 'Combine todas as operações com os resultados corretos.';
  medalha.style.display = 'none';
}


function iniciarCronometro() {
  clearInterval(idCronometro);
  idCronometro = setInterval(() => {
    segundos += 1;
    cronometroEl.textContent = formatarTempo(segundos);
  }, 1000);
}


function formatarTempo(seg) {
  const min = String(Math.floor(seg / 60)).padStart(2, '0');
  const sec = String(seg % 60).padStart(2, '0');
  return `${min}:${sec}`;
}


function atualizarPainel() {
  acertosEl.textContent = acertos;
  errosEl.textContent = erros;
  const percent = Math.round((acertos / totalCasas) * 100);
  porcentagemEl.textContent = `Aproveitamento: ${percent}%`;
  if (combinados === totalCasas) {
    mostrarMensagemConclusao();
  }
}


function mostrarMensagemConclusao() {
  mensagemStatus.textContent = `Parabéns! Você completou a rodada em ${formatarTempo(segundos)}.`;
  let nomeMedalha = 'Bronze';
  let corMedalha = '#b27d00';
  if (segundos <= 30) {
    nomeMedalha = 'Ouro';
    corMedalha = '#d4af37';
  } else if (segundos <= 60) {
    nomeMedalha = 'Prata';
    corMedalha = '#c0c0c0';
  }
  medalha.style.display = 'inline-flex';
  medalha.textContent = `🏅 ${nomeMedalha}`;
  medalha.style.background = nomeMedalha === 'Ouro' ? 'rgba(255, 223, 93, 0.18)' : nomeMedalha === 'Prata' ? 'rgba(192, 192, 192, 0.18)' : 'rgba(255, 205, 86, 0.16)';
  medalha.style.color = corMedalha;
  tocarTom(440, 0.12, 'sine');
  criarConfete();
}


function gerarRodada() {
  operacoes = [];
  respostas = [];
  infoRodada.textContent = `Rodada ${rodadaAtual}`;

  while (operacoes.length < totalCasas) {
    const isDivisao = Math.random() < 0.5;
    const oper = criarOperacao(isDivisao);
    operacoes.push(oper);
    respostas.push(oper.result);
  }

  respostas = embaralharArray(respostas);
  renderizarOperacoes();
  renderizarRespostas();
}


function criarOperacao(isDivisao) {
  if (isDivisao) {
    const divisor = aleatorioInt(2, 10);
    const quociente = aleatorioInt(2, 12);
    return {
      question: `${divisor * quociente} ÷ ${divisor}`,
      result: quociente,
    };
  }
  const fatorA = aleatorioInt(2, 12);
  const fatorB = aleatorioInt(2, 12);
  return {
    question: `${fatorA} × ${fatorB}`,
    result: fatorA * fatorB,
  };
}


function renderizarOperacoes() {
  gradeOperacoes.innerHTML = '';
  operacoes.forEach((operacao, indice) => {
    const slot = document.createElement('div');
    slot.className = 'drop-zone';
    slot.textContent = operacao.question;
    slot.dataset.result = operacao.result;
    slot.dataset.index = indice;
    slot.addEventListener('dragover', quandoArrastarSobre);
    slot.addEventListener('dragleave', quandoArrastarSair);
    slot.addEventListener('drop', quandoSoltar);
    gradeOperacoes.appendChild(slot);
  });
}


function renderizarRespostas() {
  gradeRespostas.innerHTML = '';
  respostas.forEach((valor) => {
    const item = document.createElement('div');
    item.className = 'result-item';
    item.textContent = valor;
    item.draggable = true;
    item.dataset.value = valor;
    item.addEventListener('dragstart', quandoArrastarComecar);
    item.addEventListener('dragend', quandoArrastarTerminar);
    gradeRespostas.appendChild(item);
  });
}


function quandoArrastarComecar(event) {
  arrastadoAtual = event.target;
  event.dataTransfer.setData('text/plain', event.target.dataset.value);
  event.target.classList.add('dragging');
}


function quandoArrastarTerminar(event) {
  event.target.classList.remove('dragging');
  arrastadoAtual = null;
}


function quandoArrastarSobre(event) {
  event.preventDefault();
  if (!event.currentTarget.classList.contains('correct')) {
    event.currentTarget.classList.add('active');
  }
}


function quandoArrastarSair(event) {
  event.currentTarget.classList.remove('active');
}


function quandoSoltar(event) {
  event.preventDefault();
  const targetSlot = event.currentTarget;
  targetSlot.classList.remove('active');

  if (targetSlot.classList.contains('correct')) {
    return;
  }

  const draggedValue = Number(event.dataTransfer.getData('text/plain'));
  const expectedValue = Number(targetSlot.dataset.result);
  const draggedElement = arrastadoAtual;

  if (draggedValue === expectedValue) {
    tratarAcerto(targetSlot, draggedElement, draggedValue);
  } else {
    tratarErro(targetSlot, draggedElement);
  }
}


function tratarAcerto(targetSlot, draggedElement, valor) {
  if (!draggedElement) return;
  targetSlot.classList.add('correct');
  targetSlot.style.borderStyle = 'solid';
  targetSlot.textContent = `${targetSlot.textContent} = ${valor}`;
  targetSlot.animate(
    [
      { transform: 'scale(0.98)' },
      { transform: 'scale(1.02)' },
      { transform: 'scale(1)' }
    ],
    { duration: 320, easing: 'ease-out' }
  );
  draggedElement.remove();
  acertos += 1;
  combinados += 1;
  tocarTom(660, 0.08, 'triangle');
  atualizarPainel();
}


function tratarErro(targetSlot, draggedElement) {
  if (!draggedElement) return;
  erros += 1;
  targetSlot.classList.add('wrong');
  targetSlot.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-8px)' },
      { transform: 'translateX(8px)' },
      { transform: 'translateX(0)' }
    ],
    { duration: 260, easing: 'ease-out' }
  );
  setTimeout(() => targetSlot.classList.remove('wrong'), 420);
  tocarTom(240, 0.16, 'square');
  atualizarPainel();
}


function tocarTom(frequency, duration, type) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  oscillator.connect(gain);
  gain.connect(audioCtx.destination);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
  oscillator.onended = () => audioCtx.close();
}


function criarConfete() {
  const confettiRoot = document.createElement('div');
  confettiRoot.style.position = 'fixed';
  confettiRoot.style.top = '0';
  confettiRoot.style.left = '0';
  confettiRoot.style.width = '100%';
  confettiRoot.style.height = '100%';
  confettiRoot.style.pointerEvents = 'none';
  document.body.appendChild(confettiRoot);

  for (let i = 0; i < 45; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.background = `hsl(${getRandomInt(0, 360)}, 75%, 60%)`;
    piece.style.left = `${getRandomInt(5, 95)}%`;
    piece.style.top = `${getRandomInt(-10, 10)}%`;
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    piece.style.width = `${getRandomInt(6, 12)}px`;
    piece.style.height = `${getRandomInt(6, 12)}px`;
    piece.style.opacity = '0';
    confettiRoot.appendChild(piece);
    requestAnimationFrame(() => {
      piece.style.opacity = '0.9';
    });
  }

  setTimeout(() => confettiRoot.remove(), 2100);
}


function aleatorioInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function embaralharArray(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}


botaoReiniciar.addEventListener('click', () => {
  reiniciarContadores();
  renderizarOperacoes();
  renderizarRespostas();
  iniciarCronometro();
});


botaoNovaRodada.addEventListener('click', () => {
  rodadaAtual += 1;
  reiniciarContadores();
  gerarRodada();
  iniciarCronometro();
});


window.addEventListener('DOMContentLoaded', iniciarJogo);