// SERIAL: fala com o Arduino (Web Serial, Chrome/Edge). Não conhece a tela.
// Protocolo: app->Arduino "B<id>:<v>" e "H" (sinal de vida) | Arduino->app "L<id>:<v>" e "B<id>:<v>"
const Serial = (() => {
  const BAUD = 9600;            // tem que ser igual ao Serial.begin() do sketch
  const SINAL_VIDA_MS = 500;    // o sketch desliga o motor se ficar 2 s sem receber "H"
  let porta = null, writer = null, hb = null;

  async function enviar(t) {
    if (writer) try { await writer.write(new TextEncoder().encode(t + '\n')); } catch (e) {}
  }

  function tratar(linha) {
    const m = /^([BL])(\d+):(\d)$/.exec(linha.trim());
    if (!m) return;
    const id = +m[2], v = +m[3];
    if (m[1] === 'L') Estado.lampada(id, v); else Estado.doHardware(id, v);
  }

  async function conectar() {
    if (!('serial' in navigator)) { Bus.emit('log', 'Este navegador não tem Web Serial. Use Chrome ou Edge.'); return; }
    try {
      porta = await navigator.serial.requestPort();
      await porta.open({ baudRate: BAUD });
      writer = porta.writable.getWriter();
      Estado.usarHardware(true);
      Bus.emit('conexao', true);
      Bus.emit('log', 'Conectado.');
      hb = setInterval(() => enviar('H'), SINAL_VIDA_MS);
      DEVS.forEach(d => enviar(`B${d.id}:${Estado.S[d.id]}`));

      const dec = new TextDecoderStream();
      porta.readable.pipeTo(dec.writable).catch(() => {});
      const rd = dec.readable.getReader();
      let buf = '';
      (async () => {
        try {
          for (;;) {
            const { value, done } = await rd.read();
            if (done) break;
            buf += value;
            let i;
            while ((i = buf.indexOf('\n')) >= 0) { tratar(buf.slice(0, i)); buf = buf.slice(i + 1); }
          }
        } catch (e) {}
        desconectar();
      })();
    } catch (e) { Bus.emit('log', 'Não conectou: ' + e.message); }
  }

  async function desconectar() {
    if (!porta) return;
    clearInterval(hb);
    try { writer && writer.releaseLock(); } catch (e) {}
    try { await porta.close(); } catch (e) {}
    porta = writer = null;
    Estado.usarHardware(false);
    Bus.emit('conexao', false);
    Bus.emit('log', 'Desconectado.');
  }

  function iniciar() {
    Bus.on('pedido:conectar', conectar);
    Bus.on('pedido:desconectar', desconectar);
    Bus.on('comando', ({ id, v }) => enviar(`B${id}:${v}`));
  }
  return { iniciar };
})();
