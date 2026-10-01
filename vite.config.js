import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const pagina = (caminho) => fileURLToPath(new URL(caminho, import.meta.url));

export default defineConfig({
  base: "/ong-conecta/",
  build: {
    minify: "esbuild",
    cssMinify: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      input: {
        main: pagina("./index.html"),
        projetos: pagina("./html/projetos.html"),
        cadastro: pagina("./html/cadastro.html"),
        doacao: pagina("./html/doacao.html"),
      },
    },
  },
});
