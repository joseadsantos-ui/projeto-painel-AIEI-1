// CATÁLOGO: só dados. Para criar ou mudar um botão, edite aqui e mais nada.
// tipo: pulse (NA, momentâneo) | stop (NF, momentâneo) | estop (trava)
//       sel2 | sel3 | key | tog
const DEVS = [
  { id: 1, tipo: 'pulse', nome: 'Liga',          tag: 'NA',                     cor: '#1f9d55' },
  { id: 2, tipo: 'stop',  nome: 'Desliga',       tag: 'NF',                     cor: '#d71920' },
  { id: 3, tipo: 'estop', nome: 'Emergência',    tag: 'NF, trava' },
  { id: 4, tipo: 'sel2',  nome: 'Manual / Auto', tag: 'seletor 2 posições' },
  { id: 5, tipo: 'sel3',  nome: 'Esq / 0 / Dir', tag: 'seletor 3 posições' },
  { id: 6, tipo: 'key',   nome: 'Chave',         tag: 'liga/desliga com chave' },
  { id: 7, tipo: 'tog',   nome: 'Alavanca',      tag: 'trava' },
  { id: 8, tipo: 'pulse', nome: 'Reset',         tag: 'NA',                     cor: '#2467c9' },
  { id: 9, tipo: 'pulse', nome: 'Teste',         tag: 'NA',                     cor: '#f2a900' },
];

// cor: vd (verde) | vm (vermelho) | am (amarelo)
const LAMPS = [
  { id: 1, cor: 'vd', nome: 'Motor ligado' },
  { id: 2, cor: 'vm', nome: 'Parado / emergência' },
  { id: 3, cor: 'am', nome: 'Modo automático' },
];
