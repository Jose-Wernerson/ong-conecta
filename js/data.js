/* data.js: dados estáticos da ONG (projetos, categorias e pagamentos) */

export const BASE = import.meta.env.BASE_URL;

export const projetos = [
  {
    id: "educacao",
    titulo: "Semear Saber",
    categoria: "Educação",
    descricao:
      "Reforço escolar, leitura e informática para crianças e jovens, de segunda a sexta, em contraturno escolar.",
    detalhes:
      "Atendemos 200 estudantes com monitores voluntários, biblioteca comunitária e laboratório de informática. Os recursos pagam material didático, lanches e a manutenção do espaço.",
    meta: 20000,
    arrecadado: 13400,
    voluntarios: 24,
    icone: "livro",
  },
  {
    id: "alimentacao",
    titulo: "Mesa Cheia",
    categoria: "Alimentação",
    descricao:
      "Cestas básicas e refeições semanais para famílias em situação de vulnerabilidade social.",
    detalhes:
      "Mais de 300 famílias recebem cestas e refeições toda semana. Cada R$ 50 garante uma cesta completa. Também realizamos oficinas de aproveitamento integral dos alimentos.",
    meta: 30000,
    arrecadado: 24600,
    voluntarios: 41,
    icone: "prato",
  },
  {
    id: "saude",
    titulo: "Saúde na Praça",
    categoria: "Saúde",
    descricao:
      "Mutirões de atendimento, vacinação e orientação preventiva nos bairros atendidos.",
    detalhes:
      "Ações mensais com profissionais voluntários: aferição de pressão, glicemia, orientação nutricional e encaminhamento para a rede pública de saúde.",
    meta: 15000,
    arrecadado: 6200,
    voluntarios: 17,
    icone: "coracao",
  },
];

export const formasPagamento = [
  { valor: "pix", rotulo: "Pix" },
  { valor: "cartao", rotulo: "Cartão de crédito" },
  { valor: "boleto", rotulo: "Boleto" },
];

export const disponibilidades = [
  { valor: "semana", rotulo: "Dias úteis" },
  { valor: "fds", rotulo: "Fins de semana" },
  { valor: "noite", rotulo: "Período noturno" },
];

export const buscarProjeto = (id) => projetos.find((p) => p.id === id);
