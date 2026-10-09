// Mensageiro entre os arquivos. Os módulos não se chamam diretamente: trocam eventos.
// Eventos usados:
//   'mudou'            estado ou sinaleiro mudou -> interface redesenha
//   'comando' {id,v}   usuário mexeu num botão na tela -> serial envia ao Arduino
//   'log' texto        mensagem para o painel de log
//   'conexao' bool     Arduino conectou (true) ou desconectou (false)
//   'pedido:conectar' / 'pedido:desconectar'   cliques nos botões da barra
const Bus = (() => {
  const h = {};
  return {
    on: (e, f) => (h[e] = h[e] || []).push(f),
    emit: (e, d) => (h[e] || []).forEach(f => f(d)),
  };
})();
