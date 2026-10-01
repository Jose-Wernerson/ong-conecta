/* main.js: ponto de entrada da SPA */
import { buscarProjeto } from "./data.js";
import * as t from "./templates.js";
import { iniciarRouter, registrarRota, registrarNaoEncontrada } from "./router.js";
import { registerAction, openModal, showToast } from "./ui.js";
import { ligarValidacao, validarFormulario } from "./validation.js";
import {
  listarVoluntarios,
  listarDoacoes,
  salvarVoluntario,
  salvarDoacao,
  removerRegistro,
  lerRascunho,
  salvarRascunho,
  limparRascunho,
} from "./storage.js";

/* ---------- Formulários ---------- */

function coletarDados(form) {
  const dados = {};
  for (const chave of new Set(new FormData(form).keys())) {
    const valores = new FormData(form).getAll(chave);
    dados[chave] = valores.length > 1 || chave === "disponibilidade" ? valores : valores[0];
  }
  delete dados.termos;
  return dados;
}

function aoEnviar(e) {
  const form = e.target.closest("form[data-form]");
  if (!form) return;
  e.preventDefault();
  if (form.dataset.enviando) return;

  const { valido } = validarFormulario(form);
  if (!valido) {
    showToast("Corrija os campos destacados antes de enviar.", "error");
    return;
  }

  form.dataset.enviando = "true";
  const botao = form.querySelector('button[type="submit"]');
  botao.disabled = true;

  const dados = coletarDados(form);
  if (form.dataset.form === "cadastro") {
    salvarVoluntario(dados);
    limparRascunho();
  } else {
    salvarDoacao({ ...dados, valor: Number(dados.valor) });
  }
  form.reset();
  form.querySelectorAll("[data-tocado]").forEach((campo) => delete campo.dataset.tocado);

  setTimeout(() => {
    delete form.dataset.enviando;
    botao.disabled = false;
  }, 800);
}

function montarFormulario(app) {
  const cadastro = app.querySelector("#form-cadastro");
  if (cadastro) {
    let temporizador;
    cadastro.addEventListener("input", () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => salvarRascunho(coletarDados(cadastro)), 300);
    });
  }
}

/* ---------- Rotas ---------- */

registrarRota("/", { titulo: "Início", view: t.home });
registrarRota("/projetos", { titulo: "Projetos", view: t.listaProjetos });
registrarRota("/cadastro", {
  titulo: "Cadastro de voluntário",
  view: () => {
    const rascunho = lerRascunho();
    return t.cadastro(rascunho ?? {}, Boolean(rascunho));
  },
  mount: montarFormulario,
});
registrarRota("/doacao", {
  titulo: "Doação",
  view: (params) => t.doacao(params),
  mount: montarFormulario,
});
registrarRota("/transparencia", { titulo: "Transparência", view: t.transparencia });
registrarRota("/meus-cadastros", {
  titulo: "Meus cadastros",
  view: () => t.meusCadastros(listarVoluntarios(), listarDoacoes()),
});
registrarNaoEncontrada({ titulo: "Página não encontrada", view: t.naoEncontrado });

/* ---------- Ações (data-action) ---------- */

registerAction("abrir-projeto", (alvo) => {
  const projeto = buscarProjeto(alvo.dataset.id);
  if (!projeto) return;
  openModal({
    title: projeto.titulo,
    body: t.detalheProjeto(projeto),
    actions: [
      { label: "Fechar" },
      { label: "Quero doar", variant: "primary", onClick: () => (location.hash = `#/doacao?projeto=${projeto.id}`) },
    ],
  });
});

registerAction("remover", (alvo) => {
  const { tipo, id, nome } = alvo.dataset;
  openModal({
    title: "Remover registro?",
    body: `<p>Deseja remover o registro de <strong>${nome}</strong>? Esta ação não pode ser desfeita.</p>`,
    actions: [
      { label: "Cancelar" },
      {
        label: "Remover",
        variant: "danger",
        onClick: () => {
          if (removerRegistro(tipo, id)) showToast("Registro removido.");
        },
      },
    ],
  });
});

registerAction("descartar-rascunho", () => {
  limparRascunho();
  showToast("Rascunho descartado.");
  location.hash = "#/cadastro";
  window.dispatchEvent(new CustomEvent("dados:alterados"));
});

/* Delegação: os listeners ficam no #app (que nunca é recriado) e são ligados uma única vez */
const app = document.getElementById("app");
ligarValidacao(app);
app.addEventListener("submit", aoEnviar);

iniciarRouter(app);
