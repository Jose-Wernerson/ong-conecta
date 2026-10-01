/* templates.js: telas da SPA geradas com Template Literals */
import { idadeEm } from "./validation.js";
import { BASE, projetos, formasPagamento, disponibilidades, buscarProjeto } from "./data.js";

/** Escapa HTML de qualquer dado dinâmico antes de inseri-lo em um template. */
export function escape(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const brl = (n) => Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const percentual = (p) => Math.min(100, Math.round((p.arrecadado / p.meta) * 100));

const imagem = (id, alt = "", sizes = "(min-width: 992px) 33vw, 100vw") =>
  `<img src="${BASE}imagens/projetos/${id}-800.webp"
        srcset="${BASE}imagens/projetos/${id}-480.webp 480w, ${BASE}imagens/projetos/${id}-800.webp 800w, ${BASE}imagens/projetos/${id}-1200.webp 1200w"
        sizes="${sizes}" width="800" height="533" alt="${alt}" loading="lazy">`;

const progresso = (p) => {
  const pct = percentual(p);
  return `
    <div class="progress">
      <div class="progress__track" role="progressbar" aria-label="Meta de ${escape(p.titulo)}"
           aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}">
        <div class="progress__bar" style="--value:${pct}%"></div>
      </div>
      <span>${pct}%</span>
    </div>`;
};

export const cardProjeto = (p, nivel = 3) => `
  <article class="card col-12 col-md-6 col-lg-4">
    ${imagem(p.id)}
    <div class="card__body">
      <p class="badge">${escape(p.categoria)}</p>
      <h${nivel}>${escape(p.titulo)}</h${nivel}>
      <p>${escape(p.descricao)}</p>
      ${progresso(p)}
      <p><strong>${brl(p.arrecadado)}</strong> de ${brl(p.meta)}</p>
      <div class="card__footer btn-group">
        <button type="button" class="btn btn--outline btn--sm" data-action="abrir-projeto" data-id="${escape(p.id)}">Saiba mais</button>
        <a class="btn btn--sm" href="#/doacao?projeto=${encodeURIComponent(p.id)}">Doar</a>
      </div>
    </div>
  </article>`;

export const detalheProjeto = (p) => `
  <p class="badge">${escape(p.categoria)}</p>
  <p>${escape(p.detalhes)}</p>
  ${progresso(p)}
  <p>${p.voluntarios} voluntários ativos.</p>`;

/* ---------- Campos de formulário ---------- */

const campo = ({ id, rotulo, tipo = "text", regras = "", mascara = "", extra = "", valor = "" }) => `
  <div class="field">
    <label for="${id}">${rotulo}</label>
    <input type="${tipo}" id="${id}" name="${id}" value="${escape(valor)}"
           ${regras ? `data-rules="${regras}"` : ""} ${mascara ? `data-mask="${mascara}"` : ""}
           ${extra} aria-describedby="${id}-erro">
    <p id="${id}-erro" class="field__error"></p>
  </div>`;

const selectProjeto = (selecionado = "") => `
  <div class="field">
    <label for="projeto">Projeto</label>
    <select id="projeto" name="projeto" required data-rules="obrigatorio" aria-describedby="projeto-erro">
      <option value="">Selecione…</option>
      ${projetos
        .map(
          (p) =>
            `<option value="${escape(p.id)}"${p.id === selecionado ? " selected" : ""}>${escape(p.titulo)} (${escape(p.categoria)})</option>`
        )
        .join("")}
    </select>
    <p id="projeto-erro" class="field__error"></p>
  </div>`;

/* ---------- Telas ---------- */

export const home = () => `
  <section class="hero" aria-labelledby="hero-titulo">
    <h1 id="hero-titulo" tabindex="-1">Conectamos quem quer ajudar a quem precisa</h1>
    <p>A ONG Conecta divulga projetos sociais, capta doações e reúne voluntários para transformar comunidades.</p>
    <div class="btn-group">
      <a class="btn" href="#/cadastro">Quero ser voluntário</a>
      <a class="btn btn--outline" href="#/doacao">Fazer uma doação</a>
    </div>
  </section>

  <section class="section" aria-labelledby="como-ajudar">
    <h2 id="como-ajudar">Como você pode ajudar</h2>
    <div class="row">
      ${[
        ["voluntario", "Seja voluntário", "Doe seu tempo e talento em ações presenciais ou remotas.", "#/cadastro"],
        ["coracao", "Doe", "Contribuições a partir de R$ 5,00 financiam todos os projetos.", "#/doacao"],
        ["livro", "Acompanhe", "Veja para onde vai cada real na página de transparência.", "#/transparencia"],
      ]
        .map(
          ([icone, titulo, texto, link]) => `
        <article class="card col-12 col-md-4">
          <div class="card__body">
            <img src="${BASE}imagens/icones/${icone}.svg" width="48" height="48" alt="">
            <h3>${titulo}</h3>
            <p>${texto}</p>
            <div class="card__footer"><a href="${link}">Saiba mais</a></div>
          </div>
        </article>`
        )
        .join("")}
    </div>
  </section>

  <section class="section" aria-labelledby="destaques">
    <h2 id="destaques">Projetos em destaque</h2>
    <div class="row">${projetos.map((p) => cardProjeto(p)).join("")}</div>
  </section>`;

export const listaProjetos = () => `
  <h1 tabindex="-1">Nossos projetos</h1>
  <p>Conheça as frentes de atuação da ONG e escolha onde sua ajuda faz mais diferença.</p>
  <div class="row">${projetos.map((p) => cardProjeto(p, 2)).join("")}</div>`;

export const cadastro = (valores = {}, temRascunho = false) => `
  <h1 tabindex="-1">Seja voluntário</h1>
  <p>Preencha os dados abaixo para entrar no time de voluntários.</p>
  ${
    temRascunho
      ? `<div class="alert" role="status">
          <p>Recuperamos o rascunho do seu cadastro. <button type="button" class="btn btn--outline btn--sm" data-action="descartar-rascunho">Descartar rascunho</button></p>
        </div>`
      : ""
  }
  <form id="form-cadastro" data-form="cadastro" action="#" method="post" novalidate>
    <fieldset>
      <legend>Dados pessoais</legend>
      ${campo({ id: "nome", rotulo: "Nome completo", regras: "obrigatorio", extra: 'required autocomplete="name"', valor: valores.nome })}
      ${campo({ id: "email", rotulo: "E-mail", tipo: "email", regras: "obrigatorio,email", extra: 'required autocomplete="email"', valor: valores.email })}
      <div class="form__row">
        ${campo({ id: "cpf", rotulo: "CPF", regras: "obrigatorio,cpf", mascara: "cpf", extra: 'required inputmode="numeric" maxlength="14" placeholder="000.000.000-00"', valor: valores.cpf })}
        ${campo({ id: "telefone", rotulo: "Telefone", tipo: "tel", regras: "obrigatorio,telefone", mascara: "telefone", extra: 'required autocomplete="tel" maxlength="15" placeholder="(11) 91234-5678"', valor: valores.telefone })}
      </div>
      ${campo({ id: "nascimento", rotulo: "Data de nascimento (mínimo 16 anos)", tipo: "date", regras: "obrigatorio,idade", extra: "required", valor: valores.nascimento })}
    </fieldset>
    <fieldset>
      <legend>Participação</legend>
      ${selectProjeto(valores.projeto)}
      <fieldset class="fieldset--inner">
        <legend>Disponibilidade</legend>
        ${disponibilidades
          .map(
            (d) => `
          <label class="check"><input type="checkbox" name="disponibilidade" value="${d.valor}"${
            (valores.disponibilidade || []).includes(d.valor) ? " checked" : ""
          }> ${d.rotulo}</label>`
          )
          .join("")}
      </fieldset>
      <div class="field">
        <label class="check"><input type="checkbox" id="termos" name="termos" required data-rules="obrigatorio" aria-describedby="termos-erro"> Aceito receber contato da ONG.</label>
        <p id="termos-erro" class="field__error"></p>
      </div>
    </fieldset>
    <div class="btn-group">
      <button class="btn" type="submit">Enviar cadastro</button>
    </div>
  </form>`;

export const doacao = (params = {}) => `
  <h1 tabindex="-1">Faça uma doação</h1>
  <p>Qualquer valor ajuda. Doação mínima de R$ 5,00.</p>
  <form id="form-doacao" data-form="doacao" action="#" method="post" novalidate>
    <fieldset>
      <legend>Dados da doação</legend>
      ${campo({ id: "nome", rotulo: "Nome", regras: "obrigatorio", extra: 'required autocomplete="name"' })}
      ${campo({ id: "email", rotulo: "E-mail", tipo: "email", regras: "obrigatorio,email", extra: 'required autocomplete="email"' })}
      <div class="form__row">
        ${campo({ id: "valor", rotulo: "Valor (R$)", tipo: "number", regras: "obrigatorio,valorMinimo", extra: 'required min="5" step="0.01" inputmode="decimal"' })}
        ${selectProjeto(buscarProjeto(params.projeto) ? params.projeto : "")}
      </div>
    </fieldset>
    <fieldset>
      <legend>Forma de pagamento</legend>
      ${formasPagamento
        .map(
          (f, i) => `
        <label class="check"><input type="radio" name="pagamento" value="${f.valor}" required${
          i === 0 ? ' data-rules="obrigatorio" aria-describedby="pagamento-erro"' : ""
        }> ${f.rotulo}</label>`
        )
        .join("")}
      <p id="pagamento-erro" class="field__error"></p>
    </fieldset>
    <div class="btn-group">
      <button class="btn" type="submit">Confirmar doação</button>
    </div>
  </form>`;

export const transparencia = () => {
  const total = projetos.reduce((soma, p) => soma + p.arrecadado, 0);
  const meta = projetos.reduce((soma, p) => soma + p.meta, 0);
  return `
  <h1 tabindex="-1">Transparência</h1>
  <p>Acompanhe quanto cada projeto já arrecadou em relação à sua meta.</p>
  <div class="row">
    <div class="col-12 col-md-4"><div class="alert"><p><strong>Total arrecadado</strong><br>${brl(total)}</p></div></div>
    <div class="col-12 col-md-4"><div class="alert"><p><strong>Meta somada</strong><br>${brl(meta)}</p></div></div>
    <div class="col-12 col-md-4"><div class="alert"><p><strong>Voluntários ativos</strong><br>${projetos.reduce((s, p) => s + p.voluntarios, 0)}</p></div></div>
  </div>
  <figure class="grafico">
    <canvas id="grafico-arrecadacao" role="img" aria-label="Gráfico de barras com o valor arrecadado e a meta de cada projeto. Os mesmos dados estão na tabela abaixo."></canvas>
    <figcaption>Arrecadado e meta por projeto, em reais.</figcaption>
  </figure>
  <div id="grafico-aviso"></div>
  <details id="dados-tabela">
    <summary>Ver os dados em tabela</summary>
    <div class="table-wrap">
    <table class="table">
      <caption>Arrecadação por projeto</caption>
      <thead><tr><th scope="col">Projeto</th><th scope="col">Arrecadado</th><th scope="col">Meta</th><th scope="col">Progresso</th></tr></thead>
      <tbody>
        ${projetos
          .map(
            (p) =>
              `<tr><th scope="row">${escape(p.titulo)}</th><td>${brl(p.arrecadado)}</td><td>${brl(p.meta)}</td><td>${percentual(p)}%</td></tr>`
          )
          .join("")}
      </tbody>
    </table>
    </div>
  </details>`;
};

export const naoEncontrado = () => `
  <h1 tabindex="-1">Página não encontrada</h1>
  <div class="alert alert--error" role="alert"><p>O endereço que você abriu não existe nesta aplicação.</p></div>
  <p><a class="btn" href="#/">Voltar para o início</a></p>`;

const dataBr = (iso) => new Date(iso).toLocaleDateString("pt-BR");

const mascararCpf = (cpf) => (cpf ? `***.***.${String(cpf).slice(8)}` : "");

export const meusCadastros = (voluntarios = [], doacoes = []) => `
  <h1 tabindex="-1">Meus cadastros</h1>
  <p>Registros salvos neste navegador (localStorage). Nenhum dado é enviado a servidores.</p>

  <section class="section" aria-labelledby="titulo-voluntarios">
    <h2 id="titulo-voluntarios">Voluntários (${voluntarios.length})</h2>
    ${
      voluntarios.length
        ? `<div class="table-wrap"><table class="table">
      <caption class="sr-only">Cadastros de voluntários</caption>
      <thead><tr><th scope="col">Nome</th><th scope="col">E-mail</th><th scope="col">CPF</th><th scope="col">Idade</th><th scope="col">Projeto</th><th scope="col">Data</th><th scope="col">Ações</th></tr></thead>
      <tbody>
        ${voluntarios
          .map(
            (v) => `<tr>
          <th scope="row">${escape(v.nome)}</th>
          <td>${escape(v.email)}</td>
          <td>${escape(mascararCpf(v.cpf))}</td>
          <td data-nascimento="${escape(v.nascimento)}">${idadeEm(v.nascimento)} anos</td>
          <td>${escape(buscarProjeto(v.projeto)?.titulo ?? v.projeto)}</td>
          <td><time datetime="${escape(v.criadoEm)}">${dataBr(v.criadoEm)}</time></td>
          <td><button type="button" class="btn btn--outline btn--sm" data-action="remover" data-tipo="voluntarios" data-id="${escape(v.id)}" data-nome="${escape(v.nome)}">Remover<span class="sr-only"> ${escape(v.nome)}</span></button></td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table></div>`
        : '<div class="alert"><p>Nenhum voluntário cadastrado ainda. <a href="#/cadastro">Faça o primeiro cadastro</a>.</p></div>'
    }
  </section>

  <section class="section" aria-labelledby="titulo-doacoes">
    <h2 id="titulo-doacoes">Doações (${doacoes.length})</h2>
    ${
      doacoes.length
        ? `<div class="table-wrap"><table class="table">
      <caption class="sr-only">Doações registradas</caption>
      <thead><tr><th scope="col">Doador</th><th scope="col">Valor</th><th scope="col">Projeto</th><th scope="col">Pagamento</th><th scope="col">Data</th><th scope="col">Ações</th></tr></thead>
      <tbody>
        ${doacoes
          .map(
            (d) => `<tr>
          <th scope="row">${escape(d.nome)}</th>
          <td>${brl(d.valor)}</td>
          <td>${escape(buscarProjeto(d.projeto)?.titulo ?? d.projeto)}</td>
          <td>${escape(d.pagamento)}</td>
          <td><time datetime="${escape(d.criadoEm)}">${dataBr(d.criadoEm)}</time></td>
          <td><button type="button" class="btn btn--outline btn--sm" data-action="remover" data-tipo="doacoes" data-id="${escape(d.id)}" data-nome="${escape(d.nome)}">Remover<span class="sr-only"> doação de ${escape(d.nome)}</span></button></td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table></div>`
        : '<div class="alert"><p>Nenhuma doação registrada ainda. <a href="#/doacao">Faça uma doação</a>.</p></div>'
    }
  </section>`;
