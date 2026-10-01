/* charts.js: Chart.js e Day.js carregados sob demanda via CDN (jsDelivr) */

const CHART_URL = "https://cdn.jsdelivr.net/npm/chart.js@4/auto/+esm";
const DAYJS_URL = "https://cdn.jsdelivr.net/npm/dayjs@1/+esm";
const DAYJS_PTBR_URL = "https://cdn.jsdelivr.net/npm/dayjs@1/esm/locale/pt-br/+esm";

/* ---------- Chart.js ---------- */

let grafico = null;

export function destruirGrafico() {
  grafico?.destroy();
  grafico = null;
}

/** Desenha o gráfico de barras de arrecadação por projeto no <canvas> informado. */
export async function renderizarGrafico(canvas, projetos) {
  destruirGrafico();
  const { default: Chart } = await import(/* @vite-ignore */ CHART_URL);

  const estilo = getComputedStyle(document.documentElement);
  const cor = (nome) => estilo.getPropertyValue(nome).trim();

  grafico = new Chart(canvas, {
    type: "bar",
    data: {
      labels: projetos.map((p) => p.titulo),
      datasets: [
        { label: "Arrecadado (R$)", data: projetos.map((p) => p.arrecadado), backgroundColor: cor("--brand") },
        { label: "Meta (R$)", data: projetos.map((p) => p.meta), backgroundColor: cor("--secondary") },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom", labels: { color: cor("--text") } } },
      scales: {
        x: { ticks: { color: cor("--text") }, grid: { color: cor("--border") } },
        y: {
          ticks: { color: cor("--text"), callback: (v) => `R$ ${Number(v).toLocaleString("pt-BR")}` },
          grid: { color: cor("--border") },
        },
      },
    },
  });
}

/* ---------- Day.js (pt-br) ---------- */

let dayjsPronto = null;

export function carregarDayjs() {
  dayjsPronto ??= (async () => {
    const [{ default: dayjs }, { default: ptBr }] = await Promise.all([
      import(/* @vite-ignore */ DAYJS_URL),
      import(/* @vite-ignore */ DAYJS_PTBR_URL),
    ]);
    dayjs.locale(ptBr);
    return dayjs;
  })();
  return dayjsPronto;
}

export async function formatarData(iso) {
  const dayjs = await carregarDayjs();
  return dayjs(iso).format("D [de] MMMM [de] YYYY");
}

export async function idadeEmAnos(nascimento) {
  const dayjs = await carregarDayjs();
  return dayjs().diff(dayjs(nascimento), "year");
}
