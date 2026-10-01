# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e versionamento [SemVer](https://semver.org/lang/pt-BR/).

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

