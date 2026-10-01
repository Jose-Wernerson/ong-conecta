/* ui.js: interações de interface (menu, tema, toasts e modal) */
import { salvarPreferencias } from "./storage.js";

const html = document.documentElement;
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* ---------- Tema ---------- */

function temaAtual() {
  const explicito = html.getAttribute("data-theme");
  if (explicito) return explicito;
  if (matchMedia("(prefers-contrast: more)").matches) return "contrast";
  if (matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

function sincronizarBotoesTema() {
  const atual = temaAtual();
  document.querySelectorAll('[data-action="set-theme"]').forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.themeValue === atual));
  });
}

export function setTheme(valor) {
  html.setAttribute("data-theme", valor);
  salvarPreferencias({ tema: valor });
  sincronizarBotoesTema();
}

/* ---------- Menu ---------- */

const menuBtn = () => document.querySelector(".menu-toggle");
const menuNav = () => document.getElementById("menu-principal");

export function toggleMenu(forcar) {
  const nav = menuNav();
  const btn = menuBtn();
  if (!nav || !btn) return;
  const abrir = typeof forcar === "boolean" ? forcar : !nav.classList.contains("is-open");
  nav.classList.toggle("is-open", abrir);
  btn.setAttribute("aria-expanded", String(abrir));
  btn.querySelector(".sr-only").textContent = abrir ? "Fechar menu" : "Abrir menu";
}

export const closeMenu = () => toggleMenu(false);

/* ---------- Toasts ---------- */

export function showToast(mensagem, tipo = "success", duracao = 5000) {
  const regiao = document.getElementById("toasts");
  if (!regiao) return;
  const toast = document.createElement("div");
  toast.className = `toast toast--${tipo}`;
  toast.textContent = mensagem;
  regiao.append(toast);
  setTimeout(() => toast.remove(), duracao);
}

/* ---------- Modal ---------- */

let modalAberto = null;
let focoAnterior = null;

export function closeModal() {
  if (!modalAberto) return;
  modalAberto.remove();
  modalAberto = null;
  focoAnterior?.focus();
  focoAnterior = null;
}

/**
 * Abre um diálogo modal acessível.
 * `body` é HTML confiável (use escape() de templates.js para dados do usuário).
 * `actions`: [{ label, variant, onClick }]; sem onClick apenas fecha.
 */
export function openModal({ title, body = "", actions = [{ label: "Fechar" }] }) {
  closeModal();
  focoAnterior = document.activeElement;

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
      <h2 id="modal-titulo"></h2>
      <div class="modal__body">${body}</div>
      <div class="modal__actions"></div>
    </div>`;
  backdrop.querySelector("#modal-titulo").textContent = title;

  const area = backdrop.querySelector(".modal__actions");
  actions.forEach((acao) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `btn ${acao.variant ? `btn--${acao.variant}` : "btn--outline"}`;
    btn.textContent = acao.label;
    btn.addEventListener("click", () => {
      closeModal();
      acao.onClick?.();
    });
    area.append(btn);
  });

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.getElementById("modal-root").append(backdrop);
  modalAberto = backdrop;
  backdrop.querySelector(FOCUSABLE)?.focus();
}

function prenderFoco(e) {
  const itens = [...modalAberto.querySelectorAll(FOCUSABLE)];
  if (!itens.length) return;
  const primeiro = itens[0];
  const ultimo = itens[itens.length - 1];
  if (e.shiftKey && document.activeElement === primeiro) {
    e.preventDefault();
    ultimo.focus();
  } else if (!e.shiftKey && document.activeElement === ultimo) {
    e.preventDefault();
    primeiro.focus();
  }
}

/* ---------- Eventos ---------- */

const acoes = new Map();

/** Permite que outros módulos registrem ações data-action sem acoplar ao ui.js. */
export function registerAction(nome, fn) {
  acoes.set(nome, fn);
}

function onClick(e) {
  const alvo = e.target.closest("[data-action]");
  if (!alvo) return;
  switch (alvo.dataset.action) {
    case "toggle-menu":
      toggleMenu();
      break;
    case "set-theme":
      setTheme(alvo.dataset.themeValue);
      break;
    default:
      acoes.get(alvo.dataset.action)?.(alvo, e);
  }
}

function onKeydown(e) {
  if (e.key === "Escape") {
    if (modalAberto) {
      closeModal();
    } else if (menuNav()?.classList.contains("is-open")) {
      closeMenu();
      menuBtn()?.focus();
    }
  } else if (e.key === "Tab" && modalAberto) {
    prenderFoco(e);
  }
}

/* Formulários de demonstração (páginas de fallback sem SPA) */
function onSubmitDemo(e) {
  const form = e.target.closest("form[data-demo]");
  if (!form) return;
  e.preventDefault();
  showToast(form.dataset.demo);
  form.reset();
}

function onDoacaoSalva(e) {
  const valor = Number(e.detail.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  showToast(`Obrigado! Sua doação de ${valor} foi registrada.`);
}

export function initUI() {
  sincronizarBotoesTema();
  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeydown);
  document.addEventListener("submit", onSubmitDemo);
  window.addEventListener("doacao:salva", onDoacaoSalva);
  window.addEventListener("voluntario:salvo", () => showToast("Cadastro salvo! Em breve entraremos em contato."));
}

initUI();
