/* main.js: ponto de entrada da SPA */
import { buscarProjeto } from "./data.js";
import * as t from "./templates.js";
import { iniciarRouter, registrarRota, registrarNaoEncontrada } from "./router.js";
import { registerAction, openModal } from "./ui.js";

registrarRota("/", { titulo: "Início", view: t.home });
registrarRota("/projetos", { titulo: "Projetos", view: t.listaProjetos });
registrarRota("/cadastro", { titulo: "Cadastro de voluntário", view: () => t.cadastro() });
registrarRota("/doacao", { titulo: "Doação", view: (params) => t.doacao(params) });
registrarRota("/transparencia", { titulo: "Transparência", view: t.transparencia });
registrarNaoEncontrada({ titulo: "Página não encontrada", view: t.naoEncontrado });

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

iniciarRouter(document.getElementById("app"));
