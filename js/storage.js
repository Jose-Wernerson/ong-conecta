/* storage.js: único ponto de acesso ao localStorage (chaves com prefixo "ong:") */

const PREFIXO = "ong:";

function ler(chave, padrao) {
  try {
    const bruto = localStorage.getItem(PREFIXO + chave);
    return bruto === null ? padrao : JSON.parse(bruto);
  } catch {
    return padrao;
  }
}

function gravar(chave, valor) {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

function remover(chave) {
  try {
    localStorage.removeItem(PREFIXO + chave);
  } catch {
    /* ignora: armazenamento indisponível */
  }
}

const novoId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const emitir = (nome, detalhe) => window.dispatchEvent(new CustomEvent(nome, { detail: detalhe }));

function adicionar(chave, evento, dados) {
  const registro = { id: novoId(), criadoEm: new Date().toISOString(), ...dados };
  const lista = ler(chave, []);
  lista.push(registro);
  if (!gravar(chave, lista)) return null;
  emitir(evento, registro);
  return registro;
}

/* Voluntários */
export const listarVoluntarios = () => ler("voluntarios", []);
export const salvarVoluntario = (dados) => adicionar("voluntarios", "voluntario:salvo", dados);

/* Doações */
export const listarDoacoes = () => ler("doacoes", []);
export const salvarDoacao = (dados) => adicionar("doacoes", "doacao:salva", dados);

/** Remove um registro por id. `tipo`: "voluntarios" | "doacoes". */
export function removerRegistro(tipo, id) {
  const lista = ler(tipo, []).filter((item) => item.id !== id);
  if (!gravar(tipo, lista)) return false;
  emitir("dados:alterados", { tipo, id });
  return true;
}

/* Rascunho do formulário de cadastro */
export const lerRascunho = () => ler("rascunho", null);
export const salvarRascunho = (dados) => gravar("rascunho", dados);
export const limparRascunho = () => remover("rascunho");

/* Preferências (tema) */
export const lerPreferencias = () => ler("preferencias", {});
export const salvarPreferencias = (parcial) => gravar("preferencias", { ...lerPreferencias(), ...parcial });
