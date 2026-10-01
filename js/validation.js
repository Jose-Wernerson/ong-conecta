/* validation.js: regras, máscaras e exibição de erros dos formulários */

const IDADE_MINIMA = 16;
const VALOR_MINIMO = 5;

/* ---------- Máscaras ---------- */

const soDigitos = (v) => v.replace(/\D/g, "");

export function mascaraCpf(valor) {
  const d = soDigitos(valor).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export function mascaraTelefone(valor) {
  const d = soDigitos(valor).slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const mascaras = { cpf: mascaraCpf, telefone: mascaraTelefone };

/* ---------- Funções de apoio ---------- */

export function cpfValido(valor) {
  const d = soDigitos(valor);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digito = (base) => {
    let soma = 0;
    for (let i = 0; i < base; i += 1) soma += Number(d[i]) * (base + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(d[9]) && digito(10) === Number(d[10]);
}

export function idadeEm(dataIso, hoje = new Date()) {
  const nasc = new Date(`${dataIso}T00:00:00`);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const aindaNaoFez =
    hoje.getMonth() < nasc.getMonth() || (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate());
  if (aindaNaoFez) idade -= 1;
  return idade;
}

/* ---------- Regras: retornam "" quando válido ou a mensagem de erro ---------- */

const regras = {
  obrigatorio(valor, campo) {
    if (campo.type === "checkbox") return campo.checked ? "" : "É necessário aceitar para continuar.";
    if (campo.type === "radio") {
      const marcado = campo.form.querySelector(`input[name="${campo.name}"]:checked`);
      return marcado ? "" : "Selecione uma opção.";
    }
    return valor.trim() ? "" : "Preencha este campo.";
  },
  email: (valor) => (!valor || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor) ? "" : "Informe um e-mail válido."),
  cpf: (valor) => (!valor || cpfValido(valor) ? "" : "CPF inválido. Confira os dígitos."),
  telefone: (valor) =>
    !valor || /^\(\d{2}\) \d{4,5}-\d{4}$/.test(valor) ? "" : "Use o formato (11) 91234-5678.",
  idade(valor) {
    if (!valor) return "";
    if (new Date(`${valor}T00:00:00`) > new Date()) return "A data não pode estar no futuro.";
    return idadeEm(valor) >= IDADE_MINIMA ? "" : `É preciso ter pelo menos ${IDADE_MINIMA} anos.`;
  },
  valorMinimo(valor) {
    if (!valor) return "";
    const numero = Number(valor);
    if (Number.isNaN(numero)) return "Informe um valor numérico.";
    return numero >= VALOR_MINIMO ? "" : "O valor mínimo é R$ 5,00.";
  },
};

/* ---------- Exibição de erros ---------- */

function mostrarErro(campo, mensagem) {
  const idErro = campo.getAttribute("aria-describedby");
  const alvo = idErro ? document.getElementById(idErro) : null;
  if (alvo) alvo.textContent = mensagem;
  if (mensagem) campo.setAttribute("aria-invalid", "true");
  else campo.removeAttribute("aria-invalid");
}

/** Valida um campo conforme data-rules. Devolve true quando válido. */
export function validarCampo(campo) {
  const nomes = (campo.dataset.rules || "").split(",").filter(Boolean);
  let mensagem = "";
  for (const nome of nomes) {
    mensagem = regras[nome]?.(campo.value, campo) ?? "";
    if (mensagem) break;
  }
  mostrarErro(campo, mensagem);
  return !mensagem;
}

/** Valida todos os campos do formulário e foca o primeiro inválido. */
export function validarFormulario(form) {
  const campos = [...form.querySelectorAll("[data-rules]")];
  const invalidos = campos.filter((campo) => !validarCampo(campo));
  invalidos[0]?.focus();
  return { valido: invalidos.length === 0, primeiroInvalido: invalidos[0] ?? null };
}

/* ---------- Eventos: blur, input e submit ---------- */

/** Liga máscara e validação (blur/input) em um contêiner. */
export function ligarValidacao(raiz) {
  raiz.addEventListener("input", (e) => {
    const campo = e.target;
    if (!(campo instanceof HTMLInputElement || campo instanceof HTMLSelectElement)) return;
    const mascara = mascaras[campo.dataset.mask];
    if (mascara) campo.value = mascara(campo.value);
    if (campo.dataset.rules && (campo.dataset.tocado || campo.getAttribute("aria-invalid"))) validarCampo(campo);
  });

  raiz.addEventListener("focusout", (e) => {
    const campo = e.target;
    if (!campo.dataset?.rules) return;
    campo.dataset.tocado = "true";
    validarCampo(campo);
  });
}
