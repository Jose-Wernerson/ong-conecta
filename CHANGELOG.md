# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e versionamento [SemVer](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-09-30

### Changed
- **BREAKING:** `index.html` virou um app shell; o conteúdo é renderizado por `js/main.js` e a navegação usa rotas por hash (`#/`, `#/projetos`, `#/cadastro`, `#/doacao`, `#/transparencia`, 404).

### Added
- Roteador (`js/router.js`) que atualiza `document.title`, move o foco para o `<h1>`, marca `aria-current` e fecha o menu mobile.
- Templates com Template Literals e função `escape()` (`js/templates.js`) e dados dos projetos (`js/data.js`).
- Vite, ESLint e scripts `dev`, `build`, `preview` e `lint`.
- Workflows de CI e de deploy no GitHub Pages e template de pull request.
- Páginas de fallback sem JavaScript mantidas em `html/`.

## [0.3.0] - 2026-09-30

### Added
- Menu hambúrguer (`aria-expanded`/`aria-controls`) que vira horizontal em 992px, com submenu dropdown via `:hover` e `:focus-within`.
- Formulários com `fieldset`, `:user-valid`/`:user-invalid` e mensagens de erro ligadas por `aria-describedby`.
- Alertas, toasts (`aria-live="polite"`) e modal (`role="dialog"`, `aria-modal`, focus trap e Esc).
- Seletor de tema com `aria-pressed`, preferência salva em `localStorage` e aplicada no `<head>` antes da renderização.

## [0.2.0] - 2026-09-30

### Added
- Design system em `css/variables.css`: paleta, escala tipográfica 1.25, espaçamentos de 8px e temas claro, escuro e alto contraste.
- Suporte a `prefers-color-scheme`, `prefers-contrast` e `forced-colors`.
- Grid de 12 colunas mobile-first (breakpoints 576, 768, 992, 1200 e 1400px) e Flexbox em header, cards e footer.
- Componentes iniciais: botões, cards, badges e barra de progresso.

## [0.1.0] - 2026-09-30

### Added
- `index.html` com estrutura semântica (`header`, `nav`, `main`, `footer`) e link "Pular para o conteúdo".
- Páginas de fallback sem JavaScript em `html/` (projetos, cadastro, doação) com validação nativa.
- Imagens placeholder WebP (480/800/1200px) e SVGs de logo e ícones em `public/imagens/`.

