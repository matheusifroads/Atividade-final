document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formContato');
  const aviso = document.getElementById('avisoToast');
  const listaSubmissoes = document.getElementById('listaSubmissoes');


  function mostrarAviso(msg = 'Mensagem enviada') {
    aviso.textContent = msg;
    aviso.style.display = 'block';
    setTimeout(() => aviso.style.display = 'none', 2200);
  }

  function limparTelefone(valor) {
    return (valor || '').replace(/[^\d]/g, '');
  }

  function formatarTelefoneBr(valor) {
    const digitos = limparTelefone(valor).slice(0, 11);
    if (digitos.length <= 2) {
      return digitos;
    }
    if (digitos.length <= 6) {
      return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
    }
    if (digitos.length <= 10) {
      return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
    }
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }

  function carregarUltimo() {
    const last = localStorage.getItem('last_contact');
    if (!last) return;
    try {
      const obj = JSON.parse(last);
      if (form.elements.name) form.elements.name.value = obj.name || '';
      if (form.elements.email) form.elements.email.value = obj.email || '';
      if (form.elements.subject) form.elements.subject.value = obj.subject || '';
      if (form.elements.message) form.elements.message.value = obj.message || '';
      if (form.elements.contactDate) form.elements.contactDate.value = obj.contactDate || '';
      if (form.elements.contactNumber) form.elements.contactNumber.value = obj.contactNumber || '';
      if (form.elements.reason) form.elements.reason.value = obj.reason || '';
      if (obj.replyPref){
        const r = document.querySelector(`input[name="replyPref"][value="${obj.replyPref}"]`);
        if (r) r.checked = true;
      }
      if (form.elements.newsletter) form.elements.newsletter.checked = Boolean(obj.newsletter);
      if (form.elements.terms) form.elements.terms.checked = Boolean(obj.terms);
    } catch (e) {

    }
  }

  function renderizarSubmissoes() {
    const raw = localStorage.getItem('contact_submissions');
    listaSubmissoes.innerHTML = '';
    if (!raw) return;
    try {
      const arr = JSON.parse(raw);
      arr.slice().reverse().forEach(s => {
        const li = document.createElement('li');
        li.textContent = `${s.name} — ${s.subject} — ${s.email} — ${s.contactNumber || '-'} — ${s.reason || '-'} — ${new Date(s.at).toLocaleString()}`;
        listaSubmissoes.appendChild(li);
      });
    } catch (e) {

    }
  }



  carregarUltimo();
  renderizarSubmissoes();

  const hoje = new Date().toISOString().split('T')[0];
  if (form.elements.contactDate) {
    form.elements.contactDate.max = hoje;
  }

  if (form.elements.contactNumber) {
    form.elements.contactNumber.addEventListener('input', () => {
      form.elements.contactNumber.value = formatarTelefoneBr(form.elements.contactNumber.value);
    });
  }

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    // Captura TODAS as informações do formulário
    const nome = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const assunto = form.elements.subject.value.trim();
    const mensagem = form.elements.message.value.trim();
    const contatoData = form.elements.contactDate ? form.elements.contactDate.value : '';
    const telefoneFormatado = form.elements.contactNumber ? form.elements.contactNumber.value.trim() : '';
    const telefoneLimpo = limparTelefone(telefoneFormatado);
    const motivo = form.elements.reason ? form.elements.reason.value : '';
    const preferencia = (document.querySelector('input[name="replyPref"]:checked') || {}).value || '';
    const termos = form.elements.terms ? form.elements.terms.checked : false;

    if (nome.length < 5) {
      mostrarAviso('Nome precisa ter pelo menos 5 letras');
      return;
    }
    if (!email) {
      mostrarAviso('Email é obrigatório');
      return;
    }
    if (!contatoData) {
      mostrarAviso('Escolha uma data');
      return;
    }
    if (![10, 11].includes(telefoneLimpo.length)) {
      mostrarAviso('Telefone deve estar no padrão brasileiro e conter 10 ou 11 dígitos');
      return;
    }
    if (!motivo) {
      mostrarAviso('Selecione o motivo');
      return;
    }
    if (!termos) {
      mostrarAviso('É necessário aceitar os termos');
      return;
    }
    if (assunto.length < 4) {
      mostrarAviso('Assunto precisa ter pelo menos 4 caracteres');
      return;
    }
    if (mensagem.length > 400) {
      mostrarAviso('Mensagem pode ter no máximo 400 caracteres');
      return;
    }

    // Se passou em TODAS as validações, constrói objeto de dados
    const data = {
      name: nome,
      email,
      subject: assunto,
      message: mensagem,
      contactDate: contatoData,
      contactNumber: telefoneFormatado,
      reason: motivo,
      replyPref: preferencia,
      newsletter: form.elements.newsletter ? form.elements.newsletter.checked : false,
      terms,
      at: Date.now()
    };

    // Simula envio para servidor: salva em localStorage (em site real, aqui iria POST para /api/contato)
    const raw = localStorage.getItem('contact_submissions');
    let arr = [];
    try { arr = raw ? JSON.parse(raw) : []; } catch (e) { arr = []; }
    arr.push(data);
    localStorage.setItem('contact_submissions', JSON.stringify(arr));

    localStorage.setItem('last_contact', JSON.stringify(data));

    // Atualiza a lista de submissões e mostra confirmação
    renderizarSubmissoes();
    mostrarAviso('Feedback salvo localmente — obrigado!');
  });


  const botaoLimpar = document.getElementById('botaoLimpar');
  if (botaoLimpar) botaoLimpar.addEventListener('click', () => {
    form.elements.name.value = '';
    form.elements.email.value = '';
    form.elements.subject.value = '';
    form.elements.message.value = '';
    if (form.elements.contactDate) form.elements.contactDate.value = '';
    if (form.elements.contactNumber) form.elements.contactNumber.value = '';
    if (form.elements.reason) form.elements.reason.value = '';
    const r = document.querySelector('input[name="replyPref"]:checked'); if (r) r.checked = false;
    if (form.elements.newsletter) form.elements.newsletter.checked = false;
    if (form.elements.terms) form.elements.terms.checked = false;
    localStorage.removeItem('last_contact');
    mostrarAviso('Campos limpos');
  });
});
