// ESTADO E LÓGICA: guarda os valores e a simulação. Não mexe em tela nem em serial.
// Sem Arduino, a lógica de selo roda aqui (espelha o sketch .ino).
const Estado = (() => {
  const S = {}, L = {};            // S = botões, L = sinaleiros
  let motor = false, comHardware = false;
  DEVS.forEach(d => S[d.id] = 0);
  LAMPS.forEach(l => L[l.id] = 0);

  // Edite aqui para mudar o comportamento da simulação
  function simular() {
    motor = (S[1] || motor) && !S[2] && !S[3];   // (liga OU motor) E NÃO desliga E NÃO emergência
    L[1] = +motor;
    L[2] = +(S[2] || S[3]);
    L[3] = +(S[4] === 1);
  }
  function atualizar() {
    if (!comHardware) simular();
    Bus.emit('mudou');
  }

  return {
    S, L,
    acionar(id, v) {                 // usuário mexeu num botão na tela
      if (S[id] === v) return;
      S[id] = v;
      Bus.emit('comando', { id, v });
      atualizar();
    },
    doHardware(id, v) { if (id in S) { S[id] = v; Bus.emit('mudou'); } },   // botão físico
    lampada(id, v)    { if (id in L) { L[id] = v; Bus.emit('mudou'); } },   // sinaleiro vindo do Arduino
    usarHardware(b)   { comHardware = b; motor = false; atualizar(); },
    iniciar()         { atualizar(); },
  };
})();
