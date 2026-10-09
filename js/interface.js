// INTERFACE: desenha os dispositivos e trata cliques/teclado. Não conhece serial.
const Interface = (() => {
  const $ = s => document.querySelector(s);

  function criarDispositivo(d) {
    const el = document.createElement('div');
    el.className = 'dev ' + (d.tipo === 'estop' ? 'estop' : d.tipo.startsWith('sel') ? 'sel' : d.tipo);
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', d.nome);
    el.dataset.id = d.id;
    const push = d.tipo === 'pulse' || d.tipo === 'stop';
    el.innerHTML =
      `<div class="plate"><div class="cap ${push ? 'push' : ''}" style="${d.cor ? 'background:' + d.cor : ''}"></div></div>` +
      `<div class="lbl">${d.nome}</div><div class="tag">${d.tag}</div>`;

    const baixo = () => Estado.acionar(d.id, 1), cima = () => Estado.acionar(d.id, 0);
    if (push) {                       // momentâneo: valor 1 enquanto apertado
      el.addEventListener('pointerdown', e => { el.setPointerCapture(e.pointerId); baixo(); });
      el.addEventListener('pointerup', cima);
      el.addEventListener('pointercancel', cima);
      el.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); baixo(); } });
      el.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') cima(); });
    } else {                          // com trava: cada clique alterna
      const alternar = () => {
        const v = Estado.S[d.id];
        Estado.acionar(d.id, d.tipo === 'sel3' ? (v + 1) % 3 : v ? 0 : 1);
      };
      el.addEventListener('click', alternar);
      el.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); alternar(); } });
    }
    return el;
  }

  function desenhar() {
    DEVS.forEach(d => {
      const el = document.querySelector(`.dev[data-id="${d.id}"]`);
      const cap = el.querySelector('.cap'), v = Estado.S[d.id];
      el.classList.toggle('on', !!v && ['pulse', 'stop', 'estop'].includes(d.tipo));
      if (d.tipo === 'sel2') cap.style.transform = `rotate(${v ? 35 : -35}deg)`;
      if (d.tipo === 'sel3') cap.style.transform = `rotate(${[-40, 0, 40][v]}deg)`;
      if (d.tipo === 'key')  cap.style.transform = `rotate(${v ? 90 : 0}deg)`;
      if (d.tipo === 'tog')  cap.style.transform = `translateY(${v ? -6 : 6}px)`;
      el.setAttribute('aria-pressed', !!v);
    });
    LAMPS.forEach(l => $('#L' + l.id).classList.toggle('on', !!Estado.L[l.id]));
  }

  function iniciar() {
    DEVS.forEach(d => $('#painel').append(criarDispositivo(d)));
    LAMPS.forEach(l => {
      const e = document.createElement('div');
      e.className = 'lamp ' + l.cor; e.id = 'L' + l.id;
      e.innerHTML = `<i></i><span>${l.nome}</span>`;
      $('#lamps').append(e);
    });
    $('#conectar').onclick = () => Bus.emit('pedido:conectar');
    $('#desconectar').onclick = () => Bus.emit('pedido:desconectar');

    Bus.on('mudou', desenhar);
    Bus.on('log', m => { const p = $('#log'); p.textContent += m + '\n'; p.scrollTop = 1e9; });
    Bus.on('conexao', on => {
      $('#modo').textContent = on ? 'Arduino conectado' : 'Simulação (sem Arduino)';
      $('#modo').classList.toggle('hw', on);
      $('#conectar').hidden = on;
      $('#desconectar').hidden = !on;
    });
  }
  return { iniciar };
})();
