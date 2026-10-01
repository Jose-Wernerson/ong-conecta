/* router.js: roteamento por hash (#/, #/projetos, #/cadastro, #/doacao, #/transparencia) */
import { closeMenu } from "./ui.js";

const TITULO_BASE = "ONG Conecta";
const rotas = new Map();
let app = null;
let rotaNaoEncontrada = null;

/** Registra uma rota. `view(params)` devolve HTML; `mount(app, params)` roda após a renderização. */
export function registrarRota(caminho, { titulo, view, mount }) {
  rotas.set(caminho, { titulo, view, mount });
}

export function registrarNaoEncontrada(config) {
  rotaNaoEncontrada = config;
}

function lerHash() {
  const bruto = location.hash.replace(/^#/, "") || "/";
  const [caminho, consulta = ""] = bruto.split("?");
  const normalizado = caminho.length > 1 ? caminho.replace(/\/$/, "") : caminho;
  return { caminho: normalizado, params: Object.fromEntries(new URLSearchParams(consulta)) };
}

function marcarLinkAtivo(caminho) {
  document.querySelectorAll('#menu-principal a[href^="#"]').forEach((link) => {
    const alvo = link.getAttribute("href").slice(1);
    if (alvo === caminho) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

/** Renderiza a rota atual. Com `moverFoco=false` preserva o foco (ex.: atualização de dados). */
export async function renderizar({ moverFoco = true } = {}) {
  const { caminho, params } = lerHash();
  const rota = rotas.get(caminho) ?? rotaNaoEncontrada;

  app.innerHTML = rota.view(params);
  document.title = `${rota.titulo} | ${TITULO_BASE}`;
  marcarLinkAtivo(rotas.has(caminho) ? caminho : null);
  closeMenu();

  await rota.mount?.(app, params);

  if (moverFoco) {
    const titulo = app.querySelector("h1");
    if (titulo) {
      titulo.setAttribute("tabindex", "-1");
      titulo.focus({ preventScroll: true });
    } else {
      app.focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0 });
  }
}

export function iniciarRouter(elemento) {
  app = elemento;
  window.addEventListener("hashchange", () => renderizar());
  window.addEventListener("dados:alterados", () => renderizar({ moverFoco: false }));
  return renderizar({ moverFoco: false });
}
