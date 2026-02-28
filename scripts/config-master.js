// VARIÁVEIS GLOBAIS
// `categoriasBase` contém a configuração inicial completa (embutida do backup)
const categoriasBase = [
  {
    id: "std_prom",
    nome: "Standard Promocional",
    alta: [154, 121],
    baixa: [130, 89.9],
    cap: 1,
    casal: 0,
    solteiro: 1,
    desc: "Com uma mesa e cadeira para usar ou trabalhar em seu notebook.",
    comodidades: [
      "Wi-Fi Gratuito",
      "TV a Cabo",
      "Banheiro Privativo",
      "Ar-Condicionado",
      "Estacionamento Amplo e Monitorado",
      "Mesa",
    ],
    numeros_uhs: ["15", "16", "17"],
  },
  {
    id: "std_plus",
    nome: "Standard Plus",
    alta: [242, 198],
    baixa: [198, 154],
    cap: 2,
    casal: 0,
    solteiro: 2,
    desc: "Ideal para até 2 pessoas solteiras com camas individuais.",
    comodidades: [
      "Wi-Fi Gratuito",
      "Banheiro Privativo",
      "TV a Cabo",
      "Ar-Condicionado",
      "Frigobar",
      "Armário",
      "Estacionamento Amplo e Monitorado",
    ],
    numeros_uhs: ["11", "13", "14"],
  },
  {
    id: "uh_1769990100266",
    nome: "Standard Triplo",
    alta: [352, 264],
    baixa: [275, 198],
    cap: 3,
    casal: 0,
    solteiro: 3,
    desc: "Ideal para até 3 pessoas solteiras com camas individuais para cada um.",
    comodidades: [
      "Wi-Fi Gratuito",
      "Banheiro Privativo",
      "TV a Cabo",
      "Ar-Condicionado",
      "Armário",
      "Frigobar",
      "Estacionamento Amplo e Monitorado",
    ],
    numeros_uhs: ["02", "05"],
  },
  {
    id: "uh_1769990175555",
    nome: "Suíte Superior (Single)",
    alta: [264, 220],
    baixa: [165, 132],
    cap: 2,
    casal: 1,
    solteiro: 0,
    desc: "Conforto extra com uma cama de casal exclusivamente para 1 pessoa.",
    comodidades: [
      "Wi-Fi Gratuito",
      "Banheiro Privativo",
      "TV a Cabo",
      "Ar-Condicionado",
      "Frigobar",
      "Armário",
      "Chuveiro Elétrico",
      "Estacionamento Amplo e Monitorado",
    ],
    numeros_uhs: ["04", "06", "10", "12"],
    grupo: "solteiro",
  },
  {
    id: "uh_1769990272579",
    nome: "Suíte Superior (Duplo)",
    alta: [297, 242],
    baixa: [209, 154],
    cap: 2,
    casal: 1,
    solteiro: 0,
    desc: "Quarto amplo com armário e conforto extra para um casal.",
    comodidades: [
      "Wi-Fi Gratuito",
      "TV a Cabo",
      "Ar-Condicionado",
      "Armário",
      "Banheiro Privativo",
      "Frigobar",
      "Chuveiro Elétrico",
      "Estacionamento Amplo e Monitorado",
    ],
    numeros_uhs: ["04", "06", "12", "10"],
  },
  {
    id: "uh_1769990299539",
    nome: "Suíte Master",
    alta: [330, 275],
    baixa: [231, 165],
    cap: 2,
    casal: 1,
    solteiro: 0,
    desc: "Apartamento com iluminação ambiente romântica para casais.",
    comodidades: [
      "Wi-Fi Gratuito",
      "Banheiro Privativo",
      "TV a Cabo",
      "Frigobar",
      "Armário",
      "Ar-Condicionado",
      "Chuveiro Elétrico",
      "Iluminação Ambiente",
      "Mesa",
      "Mesas de Cabeceira na Cama",
      "2 Cadeiras",
      "Carpete",
      "Estacionamento Amplo e Monitorado",
    ],
    numeros_uhs: ["07", "08"],
  },
  {
    id: "uh_1769990321522",
    nome: "Suíte Triplo",
    alta: [352, 286],
    baixa: [253, 176],
    cap: 3,
    casal: 1,
    solteiro: 1,
    desc: "Ideal para uma família pequena com até um filho(a).",
    comodidades: [
      "Wi-Fi Gratuito",
      "Banheiro Privativo",
      "TV a Cabo",
      "Frigobar",
      "Ar-Condicionado",
      "Armário",
      "Chuveiro Elétrico",
      "Estacionamento Amplo e Monitorado",
    ],
    numeros_uhs: ["03"],
  },
  {
    id: "uh_1769990349819",
    nome: "Suíte Deluxe",
    alta: [385, 380],
    baixa: [330, 275],
    cap: 2,
    casal: 1,
    solteiro: 0,
    desc: "Ideal para comemorações românticas e com banheira de hidromassagem.\nCom opção de escolha de um espumante ou vinho.",
    comodidades: [
      "Wi-Fi Gratuito",
      "Banheiro Privativo",
      "TV a Cabo",
      "Estacionamento Amplo e Monitorado",
      "Frigobar",
      "Ar-Condicionado",
      "Poltrona",
      "Mesa",
      "2 Cadeiras",
      "2 Mesas de Cabeceira na Cama",
      "Espelho",
      "Roupa de Banho",
      "Iluminação Ambiente",
      "Chuveiro Elétrico",
      "Arara para Roupas",
      "Carpete",
      "Banheira de Hidromassagem",
    ],
    numeros_uhs: ["09"],
  },
];

// Horários padrão das refeições (serão usados como configuração inicial)
const horariosBase = {
  cafe: ["07:00", "09:00", true],
  almoco: ["11:00", "13:00", true],
  lanche: ["15:00", "17:00", true], // lanche da tarde
  janta: ["18:00", "20:00", true],
};

let horariosRefeicoes = {};

let categoriasAtuais = [];
let comodidadesGlobais = [
  "Wi-Fi Gratuito",
  "Estacionamento Amplo",
  "Banheiro Privativo",
  "TV a Cabo",
  "Ar-Condicionado",
];
let idUHSelecionada = null;
let ultimoBlobUrlExport = null;

// HELPERS DE FORMATAÇÃO (MOEDA BRASIL)
function formatMoney(val) {
  let n = parseFloat(val);
  if (isNaN(n)) n = 0;
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseMoney(val) {
  if (typeof val === "number") return val;
  if (!val) return 0;
  // Remove ponto de milhar e troca vírgula por ponto decimal
  let clean = val.toString().replace(/\./g, "").replace(",", ".");
  let n = parseFloat(clean);
  return isNaN(n) ? 0 : n;
}

function abrirFileImport() {
  const f = document.getElementById("fileIn");
  if (!f) return;
  try {
    f.value = "";
  } catch (e) {}
  f.click();
}

// INICIALIZAÇÃO
window.onload = () => {
  carregarDadosBase();
  const fest = localStorage.getItem("plaza_festividade") || "Carnaval 2026";
  const label = document.getElementById("labelFest");
  if (label) label.innerText = "Carga: " + fest;
};

function carregarDadosBase() {
  const salvos = localStorage.getItem("plaza_tarifario");
  const comodSalvas = localStorage.getItem("plaza_comodidades_mestre");
  const horSalvos = localStorage.getItem("plaza_horarios_refeicoes");

  if (salvos) {
    categoriasAtuais = JSON.parse(salvos);
  } else {
    categoriasAtuais = JSON.parse(JSON.stringify(categoriasBase));
  }

  if (comodSalvas) {
    comodidadesGlobais = comodSalvas.split(",").map((s) => s.trim());
  }

  if (horSalvos) {
    try {
      horariosRefeicoes = JSON.parse(horSalvos);
    } catch (e) {
      horariosRefeicoes = JSON.parse(JSON.stringify(horariosBase));
    }
  } else {
    horariosRefeicoes = JSON.parse(JSON.stringify(horariosBase));
  }
}

// ACESSO E SEGURANÇA
function verificarAcessoConfig() {
  const senhaSalva = localStorage.getItem("plaza_senha_sistema");
  if (!senhaSalva) {
    abrirModal();
    return;
  }
  document.getElementById("modalSenha").style.display = "block";
  document.getElementById("input_senha_acesso").focus();
}

function confirmarSenhaAcesso() {
  const senhaDigitada = document.getElementById("input_senha_acesso").value;
  if (senhaDigitada === localStorage.getItem("plaza_senha_sistema")) {
    fecharModalSenha();
    abrirModal();
  } else {
    showMsg("Erro", "Senha incorreta!", "erro");
  }
}

// MODAL E RENDERIZAÇÃO PRINCIPAL
function abrirModal() {
  carregarDadosBase();
  document.getElementById("cfg_fest").value =
    localStorage.getItem("plaza_festividade") || "Carnaval 2026";
  document.getElementById("cfg_alm").value = formatMoney(
    localStorage.getItem("plaza_valor_almoco") || 30.0,
  );
  document.getElementById("cfg_janta").value = formatMoney(
    localStorage.getItem("plaza_valor_janta") || 25.0,
  );
  document.getElementById("cfg_lanche").value = formatMoney(
    localStorage.getItem("plaza_valor_lanche") || 15.0,
  );
  document.getElementById("cfg_kwh").value = formatMoney(
    localStorage.getItem("plaza_valor_kwh") || 1.8,
  );
  document.getElementById("cfg_alta_inicio").value =
    localStorage.getItem("plaza_alta_inicio") || "";
  document.getElementById("cfg_alta_fim").value =
    localStorage.getItem("plaza_alta_fim") || "";
  document.getElementById("cfg_total_uhs").value =
    localStorage.getItem("plaza_total_uhs") || 17;
  document.getElementById("cfg_comodidades_globais").value =
    comodidadesGlobais.join(", ");

  // Preenche o campo de senha com a senha atual (se houver) para visualização
  document.getElementById("cfg_senha_input").value =
    localStorage.getItem("plaza_senha_sistema") || "";

  // Preenche campos de horários
  try {
    document.getElementById("cfg_hor_cafe_start").value =
      horariosRefeicoes.cafe[0] || "07:00";
    document.getElementById("cfg_hor_cafe_end").value =
      horariosRefeicoes.cafe[1] || "09:00";
    document.getElementById("cfg_check_cafe").checked =
      horariosRefeicoes.cafe[2] !== false;
    document.getElementById("cfg_hor_almoco_start").value =
      horariosRefeicoes.almoco[0] || "11:00";
    document.getElementById("cfg_hor_almoco_end").value =
      horariosRefeicoes.almoco[1] || "13:00";
    document.getElementById("cfg_check_almoco").checked =
      horariosRefeicoes.almoco[2] !== false;
    document.getElementById("cfg_hor_lanche_start").value =
      horariosRefeicoes.lanche[0] || "15:00";
    document.getElementById("cfg_hor_lanche_end").value =
      horariosRefeicoes.lanche[1] || "17:00";
    document.getElementById("cfg_check_lanche").checked =
      horariosRefeicoes.lanche[2] !== false;
    document.getElementById("cfg_hor_janta_start").value =
      horariosRefeicoes.janta[0] || "18:00";
    document.getElementById("cfg_hor_janta_end").value =
      horariosRefeicoes.janta[1] || "20:00";
    document.getElementById("cfg_check_janta").checked =
      horariosRefeicoes.janta[2] !== false;
  } catch (e) {}

  // Carrega Promoções
  const elPromo = document.getElementById("cfg_promo_ativo");
  if (elPromo) {
    elPromo.checked = localStorage.getItem("plaza_promo_ativa") === "true";
    document.getElementById("cfg_promo_porcentagem").value =
      localStorage.getItem("plaza_promo_porcentagem") || "";
    document.getElementById("cfg_promo_min_diarias").value =
      localStorage.getItem("plaza_promo_min_diarias") || "";
    document.getElementById("cfg_promo_texto").value =
      localStorage.getItem("plaza_promo_texto") || "";
    const elPromoAlta = document.getElementById("cfg_promo_somente_alta");
    if (elPromoAlta) {
      elPromoAlta.checked =
        localStorage.getItem("plaza_promo_somente_alta") === "true";
    }
    const elPromoMsgBaixa = document.getElementById("cfg_promo_msg_baixa");
    if (elPromoMsgBaixa) {
      elPromoMsgBaixa.checked =
        localStorage.getItem("plaza_promo_msg_baixa") === "true";
    }
    atualizarEstadoPromo(); // Atualiza o estado visual (disabled/enabled) ao abrir
  }

  // ========== NOVOS CAMPOS DE TEXTO DO ORÇAMENTO ==========
  document.getElementById("cfg_orc_titulo").value =
    localStorage.getItem("plaza_orc_titulo") || "Orçamento de Hospedagem";
  document.getElementById("cfg_orc_config_titulo").value =
    localStorage.getItem("plaza_orc_config_titulo") ||
    "1. Configuração de Acomodação e Valores";
  document.getElementById("cfg_orc_config_descricao").value =
    localStorage.getItem("plaza_orc_config_descricao") || "";
  document.getElementById("cfg_orc_nota_refeicoes").value =
    localStorage.getItem("plaza_orc_nota_refeicoes") || "";
  document.getElementById("cfg_orc_cronograma").value =
    localStorage.getItem("plaza_orc_cronograma") || "";
  document.getElementById("cfg_orc_pagamento").value =
    localStorage.getItem("plaza_orc_pagamento") || "";
  document.getElementById("cfg_orc_observacoes").value =
    localStorage.getItem("plaza_orc_observacoes") || "";
  document.getElementById("cfg_orc_rodape").value =
    localStorage.getItem("plaza_orc_rodape") ||
    "Setor de Reservas - Hotel Plaza";
  document.getElementById("cfg_orc_sinal_percentual").value =
    localStorage.getItem("plaza_orc_sinal_percentual") || "50";
  // ========================================================

  renderTabela();
  document.getElementById("modal").style.display = "block";
  if (categoriasAtuais.length > 0) selecionarLinha(0);
}

function renderTabela() {
  const corpo = document.getElementById("corpoTabela");
  corpo.innerHTML = categoriasAtuais
    .map(
      (c, i) => `
        <tr id="linha_${i}" class="clickable-row" onclick="selecionarLinha(${i})">
            <td><input type="text" class="input-nome-uh" value="${c.nome}" oninput="syncNome(${i}, this.value)"></td>
            <td><input type="text" class="input-preco" value="${formatMoney(c.alta[0])}" id="a0_${i}" onchange="this.value = formatMoney(parseMoney(this.value))"></td>
            <td><input type="text" class="input-preco" value="${formatMoney(c.alta[1])}" id="a1_${i}" onchange="this.value = formatMoney(parseMoney(this.value))"></td>
            <td><input type="text" class="input-preco" value="${formatMoney(c.baixa[0])}" id="b0_${i}" onchange="this.value = formatMoney(parseMoney(this.value))"></td>
            <td><input type="text" class="input-preco" value="${formatMoney(c.baixa[1])}" id="b1_${i}" onchange="this.value = formatMoney(parseMoney(this.value))"></td>
            <td><button class="btn-delete" onclick="abrirConfirmExcluir(${i}, event)">🗑️</button></td>
        </tr>
    `,
    )
    .join("");
}

function selecionarLinha(index) {
  idUHSelecionada = index;
  const rows = document.querySelectorAll("#corpoTabela tr");
  rows.forEach((r) => r.classList.remove("selected-row"));

  const row = document.getElementById(`linha_${index}`);
  if (row) row.classList.add("selected-row");

  const uh = categoriasAtuais[index];
  if (!uh) return;

  document.getElementById("detalhe_nome_uh_label").innerText = uh.nome;
  document.getElementById("detalhe_casal").value = uh.casal || 0;
  document.getElementById("detalhe_solteiro").value = uh.solteiro || 0;
  document.getElementById("detalhe_desc").value = uh.desc || "";
  document.getElementById("detalhe_tipo_ocupacao").value =
    uh.grupo || (uh.casal > 0 ? "casal" : "solteiro");

  renderizarChecksComodidades(uh);
  renderizarChecksNumeros();
}

// LÓGICA DE UHs (NÚMEROS E COMODIDADES)
function renderizarChecksNumeros() {
  const total = parseInt(document.getElementById("cfg_total_uhs").value) || 0;
  const container = document.getElementById("listaNumerosUH");
  const uh = categoriasAtuais[idUHSelecionada];

  if (!uh) return;
  if (!uh.numeros_uhs) uh.numeros_uhs = [];

  let html = "";
  for (let i = 1; i <= total; i++) {
    const num = i.toString().padStart(2, "0");
    const checked = uh.numeros_uhs.includes(num) ? "checked" : "";
    html += `
            <div class="uh-number-item">
                <input type="checkbox" ${checked} onchange="toggleNum('${num}')">
                <label>${num}</label>
            </div>`;
  }
  container.innerHTML = html;
}

// Controla a habilitação do checkbox "Msg Baixa" baseado no "Só Alta"
function atualizarEstadoPromo() {
  const chkAlta = document.getElementById("cfg_promo_somente_alta");
  const chkMsg = document.getElementById("cfg_promo_msg_baixa");
  if (chkAlta && chkMsg) {
    chkMsg.disabled = !chkAlta.checked;
    if (!chkAlta.checked) chkMsg.checked = false; // Desmarca se desabilitar
  }
}

function toggleNum(num) {
  const uh = categoriasAtuais[idUHSelecionada];
  const index = uh.numeros_uhs.indexOf(num);
  if (index > -1) uh.numeros_uhs.splice(index, 1);
  else uh.numeros_uhs.push(num);
}

function renderizarChecksComodidades(uh) {
  const container = document.getElementById("listaComodidadesUH");
  // Atualiza lista global com base no input
  comodidadesGlobais = document
    .getElementById("cfg_comodidades_globais")
    .value.split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");

  container.innerHTML = comodidadesGlobais
    .map((comod) => {
      const checked =
        uh.comodidades && uh.comodidades.includes(comod) ? "checked" : "";
      return `
            <div class="comodidade-item">
                <input type="checkbox" ${checked} onchange="toggleComodidade('${comod}')">
                <label>${comod}</label>
            </div>`;
    })
    .join("");
}

function toggleComodidade(comod) {
  const uh = categoriasAtuais[idUHSelecionada];
  if (!uh.comodidades) uh.comodidades = [];
  const index = uh.comodidades.indexOf(comod);
  if (index > -1) uh.comodidades.splice(index, 1);
  else uh.comodidades.push(comod);
}

function atualizarInfoUH() {
  const uh = categoriasAtuais[idUHSelecionada];
  if (!uh) return;
  uh.casal = parseInt(document.getElementById("detalhe_casal").value);
  uh.solteiro = parseInt(document.getElementById("detalhe_solteiro").value);
  uh.desc = document.getElementById("detalhe_desc").value;
  uh.cap = uh.casal * 2 + uh.solteiro;
  // Salva o tipo de ocupação (grupo) se o usuário definir manualmente, ou limpa para automático
  const tipo = document.getElementById("detalhe_tipo_ocupacao").value;
  if (tipo === "" || tipo === null) delete uh.grupo;
  else uh.grupo = tipo;
}

function syncNome(index, valor) {
  categoriasAtuais[index].nome = valor;
  if (idUHSelecionada === index) {
    document.getElementById("detalhe_nome_uh_label").innerText = valor;
  }
}

function adicionarUH() {
  const novo = {
    id: "nova_" + Date.now(),
    nome: "Nova Unidade",
    alta: [0, 0],
    baixa: [0, 0],
    cap: 0,
    casal: 0,
    solteiro: 0,
    desc: "",
    comodidades: [],
    numeros_uhs: [],
  };
  categoriasAtuais.push(novo);
  renderTabela();
  selecionarLinha(categoriasAtuais.length - 1);
}

// EXCLUSÃO
function abrirConfirmExcluir(index, event) {
  event.stopPropagation();
  const modal = document.getElementById("modalConfirm");
  document.getElementById("confirmText").innerText =
    `Deseja excluir a categoria "${categoriasAtuais[index].nome}"?`;
  modal.style.display = "block";
  document.getElementById("btnConfirmDelete").onclick = () => {
    categoriasAtuais.splice(index, 1);
    fecharConfirm();
    renderTabela();
    if (categoriasAtuais.length > 0) selecionarLinha(0);
  };
}

// PERSISTÊNCIA E BACKUP
function salvarAlteracoes() {
  // Garante que os campos do painel de detalhes atualmente exibidos sejam gravados
  if (idUHSelecionada !== null) {
    atualizarInfoUH();
  }
  // Captura preços da tabela
  // Também garante nomes atualizados na tabela (caso editados)
  const nomeInputs = Array.from(
    document.querySelectorAll("#corpoTabela .input-nome-uh"),
  );
  categoriasAtuais.forEach((c, i) => {
    // nome
    if (nomeInputs[i]) c.nome = nomeInputs[i].value;
    // preços
    const a0 = document.getElementById(`a0_${i}`);
    const a1 = document.getElementById(`a1_${i}`);
    const b0 = document.getElementById(`b0_${i}`);
    const b1 = document.getElementById(`b1_${i}`);
    c.alta[0] = a0 ? parseMoney(a0.value) : c.alta[0];
    c.alta[1] = a1 ? parseMoney(a1.value) : c.alta[1];
    c.baixa[0] = b0 ? parseMoney(b0.value) : c.baixa[0];
    c.baixa[1] = b1 ? parseMoney(b1.value) : c.baixa[1];
  });

  localStorage.setItem("plaza_tarifario", JSON.stringify(categoriasAtuais));
  localStorage.setItem(
    "plaza_festividade",
    document.getElementById("cfg_fest").value,
  );
  localStorage.setItem(
    "plaza_valor_almoco",
    parseMoney(document.getElementById("cfg_alm").value),
  );
  localStorage.setItem(
    "plaza_valor_janta",
    parseMoney(document.getElementById("cfg_janta").value),
  );
  localStorage.setItem(
    "plaza_valor_lanche",
    parseMoney(document.getElementById("cfg_lanche").value),
  );
  localStorage.setItem(
    "plaza_valor_kwh",
    parseMoney(document.getElementById("cfg_kwh").value),
  );
  localStorage.setItem(
    "plaza_alta_inicio",
    document.getElementById("cfg_alta_inicio").value,
  );
  localStorage.setItem(
    "plaza_alta_fim",
    document.getElementById("cfg_alta_fim").value,
  );
  localStorage.setItem(
    "plaza_total_uhs",
    document.getElementById("cfg_total_uhs").value,
  );
  localStorage.setItem(
    "plaza_comodidades_mestre",
    document.getElementById("cfg_comodidades_globais").value,
  );

  // Salva Promoções
  const elPromo = document.getElementById("cfg_promo_ativo");
  if (elPromo) {
    localStorage.setItem("plaza_promo_ativa", elPromo.checked);
    localStorage.setItem(
      "plaza_promo_porcentagem",
      document.getElementById("cfg_promo_porcentagem").value,
    );
    localStorage.setItem(
      "plaza_promo_min_diarias",
      document.getElementById("cfg_promo_min_diarias").value,
    );
    localStorage.setItem(
      "plaza_promo_texto",
      document.getElementById("cfg_promo_texto").value,
    );
    const elPromoAlta = document.getElementById("cfg_promo_somente_alta");
    if (elPromoAlta) {
      localStorage.setItem("plaza_promo_somente_alta", elPromoAlta.checked);
    }
    const elPromoMsgBaixa = document.getElementById("cfg_promo_msg_baixa");
    if (elPromoMsgBaixa) {
      localStorage.setItem("plaza_promo_msg_baixa", elPromoMsgBaixa.checked);
    }
  }

  // Salva horários das refeições
  try {
    const h = {
      cafe: [
        document.getElementById("cfg_hor_cafe_start").value,
        document.getElementById("cfg_hor_cafe_end").value,
        document.getElementById("cfg_check_cafe").checked,
      ],
      almoco: [
        document.getElementById("cfg_hor_almoco_start").value,
        document.getElementById("cfg_hor_almoco_end").value,
        document.getElementById("cfg_check_almoco").checked,
      ],
      lanche: [
        document.getElementById("cfg_hor_lanche_start").value,
        document.getElementById("cfg_hor_lanche_end").value,
        document.getElementById("cfg_check_lanche").checked,
      ],
      janta: [
        document.getElementById("cfg_hor_janta_start").value,
        document.getElementById("cfg_hor_janta_end").value,
        document.getElementById("cfg_check_janta").checked,
      ],
    };
    horariosRefeicoes = h;
    localStorage.setItem("plaza_horarios_refeicoes", JSON.stringify(h));
  } catch (e) {}

  // ========== SALVA NOVOS CAMPOS DE TEXTO DO ORÇAMENTO ==========
  localStorage.setItem(
    "plaza_orc_titulo",
    document.getElementById("cfg_orc_titulo").value,
  );
  localStorage.setItem(
    "plaza_orc_config_titulo",
    document.getElementById("cfg_orc_config_titulo").value,
  );
  localStorage.setItem(
    "plaza_orc_config_descricao",
    document.getElementById("cfg_orc_config_descricao").value,
  );
  localStorage.setItem(
    "plaza_orc_nota_refeicoes",
    document.getElementById("cfg_orc_nota_refeicoes").value,
  );
  localStorage.setItem(
    "plaza_orc_cronograma",
    document.getElementById("cfg_orc_cronograma").value,
  );
  localStorage.setItem(
    "plaza_orc_pagamento",
    document.getElementById("cfg_orc_pagamento").value,
  );
  localStorage.setItem(
    "plaza_orc_observacoes",
    document.getElementById("cfg_orc_observacoes").value,
  );
  localStorage.setItem(
    "plaza_orc_rodape",
    document.getElementById("cfg_orc_rodape").value,
  );
  localStorage.setItem(
    "plaza_orc_sinal_percentual",
    document.getElementById("cfg_orc_sinal_percentual").value,
  );
  // ===============================================================

  showMsg(
    "Sucesso",
    "Todas as configurações foram salvas no navegador!",
    "sucesso",
  );
}

function limparCacheSistema() {
  // Abre o modal de confirmação customizado (reutiliza modalConfirm)
  const modal = document.getElementById("modalConfirm");
  const h3 = modal.querySelector("h3");
  const icon = modal.querySelector(".modal-msg-icon");
  document.getElementById("confirmText").innerText =
    "ATENÇÃO: Isso apagará todos os dados salvos no navegador. Deseja continuar?";
  h3.innerText = "Confirmar Limpeza de Cache";
  icon.innerText = "🧹";
  const btn = document.getElementById("btnConfirmDelete");
  btn.innerText = "Sim, Limpar";
  // Ao confirmar, remover somente as chaves de storage (não alterar a tela atual)
  btn.onclick = () => {
    const chaves = [
      "plaza_tarifario",
      "plaza_festividade",
      "plaza_valor_almoco",
      "plaza_valor_janta",
      "plaza_valor_lanche",
      "plaza_valor_kwh",
      "plaza_total_uhs",
      "plaza_comodidades_mestre",
      "plaza_alta_inicio",
      "plaza_alta_fim",
      "plaza_senha_sistema",
      "plaza_promo_ativa",
      "plaza_promo_porcentagem",
      "plaza_promo_min_diarias",
      "plaza_promo_texto",
      "plaza_promo_somente_alta",
      "plaza_promo_msg_baixa",
      "plaza_horarios_refeicoes",
      // ========== NOVAS CHAVES ==========
      "plaza_orc_titulo",
      "plaza_orc_config_titulo",
      "plaza_orc_config_descricao",
      "plaza_orc_nota_refeicoes",
      "plaza_orc_cronograma",
      "plaza_orc_pagamento",
      "plaza_orc_observacoes",
      "plaza_orc_rodape",
      "plaza_orc_sinal_percentual",
      // ==================================
    ];
    chaves.forEach((k) => localStorage.removeItem(k));
    fecharConfirm();
    showMsg(
      "Limpo",
      "O cache foi esvaziado. As informações na tela atual foram preservadas.",
      "sucesso",
    );
  };
  modal.style.display = "block";
}

function exportarBackup() {
  // Garante que os dados exportados sejam EXATAMENTE o que está na tela,
  // mesmo que o usuário não tenha clicado em "Salvar" ainda.

  // 1. Captura preços e nomes atuais da tabela
  const nomeInputs = Array.from(
    document.querySelectorAll("#corpoTabela .input-nome-uh"),
  );
  categoriasAtuais.forEach((c, i) => {
    if (nomeInputs[i]) c.nome = nomeInputs[i].value;
    const a0 = document.getElementById(`a0_${i}`);
    const a1 = document.getElementById(`a1_${i}`);
    const b0 = document.getElementById(`b0_${i}`);
    const b1 = document.getElementById(`b1_${i}`);
    c.alta[0] = a0 ? parseMoney(a0.value) : c.alta[0];
    c.alta[1] = a1 ? parseMoney(a1.value) : c.alta[1];
    c.baixa[0] = b0 ? parseMoney(b0.value) : c.baixa[0];
    c.baixa[1] = b1 ? parseMoney(b1.value) : c.baixa[1];
  });

  // Captura horários (incluindo lanche)
  const hAtual = {
    cafe: [
      document.getElementById("cfg_hor_cafe_start").value,
      document.getElementById("cfg_hor_cafe_end").value,
      document.getElementById("cfg_check_cafe").checked,
    ],
    almoco: [
      document.getElementById("cfg_hor_almoco_start").value,
      document.getElementById("cfg_hor_almoco_end").value,
      document.getElementById("cfg_check_almoco").checked,
    ],
    lanche: [
      document.getElementById("cfg_hor_lanche_start").value,
      document.getElementById("cfg_hor_lanche_end").value,
      document.getElementById("cfg_check_lanche").checked,
    ],
    janta: [
      document.getElementById("cfg_hor_janta_start").value,
      document.getElementById("cfg_hor_janta_end").value,
      document.getElementById("cfg_check_janta").checked,
    ],
  };

  const elPromo = document.getElementById("cfg_promo_ativo");
  const promo = elPromo
    ? {
        ativo: elPromo.checked,
        pct: document.getElementById("cfg_promo_porcentagem").value,
        min: document.getElementById("cfg_promo_min_diarias").value,
        txt: document.getElementById("cfg_promo_texto").value,
        somenteAlta: document.getElementById("cfg_promo_somente_alta")
          ? document.getElementById("cfg_promo_somente_alta").checked
          : false,
        msgBaixa: document.getElementById("cfg_promo_msg_baixa")
          ? document.getElementById("cfg_promo_msg_baixa").checked
          : false,
      }
    : {};

  const dados = {
    cabecalho: "BACKUP_CONFIG_PLAZA",
    t: categoriasAtuais,
    f: document.getElementById("cfg_fest").value,
    a: parseMoney(document.getElementById("cfg_alm").value),
    j: parseMoney(document.getElementById("cfg_janta").value), // valor janta
    l: parseMoney(document.getElementById("cfg_lanche").value), // valor lanche
    k: parseMoney(document.getElementById("cfg_kwh").value),
    ai: document.getElementById("cfg_alta_inicio").value,
    af: document.getElementById("cfg_alta_fim").value,
    u: document.getElementById("cfg_total_uhs").value,
    c: document.getElementById("cfg_comodidades_globais").value.split(","),
    h: hAtual,
    p: promo,
    // Textos do orçamento
    orc_titulo: document.getElementById("cfg_orc_titulo").value,
    orc_config_titulo: document.getElementById("cfg_orc_config_titulo").value,
    orc_config_descricao: document.getElementById("cfg_orc_config_descricao")
      .value,
    orc_nota_refeicoes: document.getElementById("cfg_orc_nota_refeicoes").value,
    orc_cronograma: document.getElementById("cfg_orc_cronograma").value,
    orc_pagamento: document.getElementById("cfg_orc_pagamento").value,
    orc_observacoes: document.getElementById("cfg_orc_observacoes").value,
    orc_rodape: document.getElementById("cfg_orc_rodape").value,
    orc_sinal_percentual: document.getElementById("cfg_orc_sinal_percentual")
      .value,
  };

  const blob = new Blob([JSON.stringify(dados, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `backup_plaza_config_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  if (ultimoBlobUrlExport) {
    try {
      URL.revokeObjectURL(ultimoBlobUrlExport);
    } catch (e) {}
    ultimoBlobUrlExport = null;
  }
  ultimoBlobUrlExport = url;
  showMsg("Sucesso", "Backup exportado com sucesso! Clique em OK.", "sucesso");
}

function importarBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const d = JSON.parse(e.target.result);
      if (d.cabecalho !== "BACKUP_CONFIG_PLAZA")
        throw new Error("Arquivo inválido");

      categoriasAtuais = d.t;
      localStorage.setItem("plaza_tarifario", JSON.stringify(d.t));
      localStorage.setItem("plaza_festividade", d.f);
      localStorage.setItem("plaza_valor_almoco", d.a);
      if (d.j !== undefined) localStorage.setItem("plaza_valor_janta", d.j);
      if (d.k) localStorage.setItem("plaza_valor_kwh", d.k);
      if (d.l !== undefined) localStorage.setItem("plaza_valor_lanche", d.l);
      if (d.ai) localStorage.setItem("plaza_alta_inicio", d.ai);
      if (d.af) localStorage.setItem("plaza_alta_fim", d.af);
      localStorage.setItem("plaza_total_uhs", d.u);
      if (d.c) localStorage.setItem("plaza_comodidades_mestre", d.c.join(","));
      if (d.h)
        localStorage.setItem("plaza_horarios_refeicoes", JSON.stringify(d.h));

      if (d.p) {
        localStorage.setItem("plaza_promo_ativa", d.p.ativo);
        localStorage.setItem("plaza_promo_porcentagem", d.p.pct);
        localStorage.setItem("plaza_promo_min_diarias", d.p.min);
        localStorage.setItem("plaza_promo_texto", d.p.txt);
        localStorage.setItem(
          "plaza_promo_somente_alta",
          d.p.somenteAlta || false,
        );
        localStorage.setItem("plaza_promo_msg_baixa", d.p.msgBaixa || false);
      }

      // ========== RESTAURA NOVOS CAMPOS ==========
      if (d.orc_titulo) localStorage.setItem("plaza_orc_titulo", d.orc_titulo);
      if (d.orc_config_titulo)
        localStorage.setItem("plaza_orc_config_titulo", d.orc_config_titulo);
      if (d.orc_config_descricao)
        localStorage.setItem(
          "plaza_orc_config_descricao",
          d.orc_config_descricao,
        );
      if (d.orc_nota_refeicoes)
        localStorage.setItem("plaza_orc_nota_refeicoes", d.orc_nota_refeicoes);
      if (d.orc_cronograma)
        localStorage.setItem("plaza_orc_cronograma", d.orc_cronograma);
      if (d.orc_pagamento)
        localStorage.setItem("plaza_orc_pagamento", d.orc_pagamento);
      if (d.orc_observacoes)
        localStorage.setItem("plaza_orc_observacoes", d.orc_observacoes);
      if (d.orc_rodape) localStorage.setItem("plaza_orc_rodape", d.orc_rodape);
      if (d.orc_sinal_percentual)
        localStorage.setItem(
          "plaza_orc_sinal_percentual",
          d.orc_sinal_percentual,
        );
      // ===========================================

      abrirModal();
      showMsg("Sucesso", "Dados importados com sucesso!", "sucesso");
    } catch (err) {
      showMsg(
        "Erro",
        "Falha ao importar: arquivo corrompido ou inválido.",
        "erro",
      );
    }
  };
  reader.readAsText(file);
  // Limpa o input para permitir reimportar o mesmo arquivo posteriormente
  try {
    const inp = document.getElementById("fileIn");
    if (inp) inp.value = "";
  } catch (e) {}
}

// SENHA (CONFIRMAÇÃO)
function abrirModalConfirmaSenha() {
  const nova = document.getElementById("cfg_senha_input").value;
  if (nova.length < 4) {
    showMsg("Aviso", "A senha deve ter pelo menos 4 caracteres.", "erro");
    return;
  }
  document.getElementById("modalConfirmaSenha").style.display = "block";
}

function processarMudancaSenha() {
  const nova = document.getElementById("cfg_senha_input").value;
  const confirma = document.getElementById("input_confirma_nova_senha").value;
  if (nova === confirma) {
    localStorage.setItem("plaza_senha_sistema", nova);
    fecharModalConfirmaSenha();
    // Mantém a senha no input para que o usuário veja que está definida
    document.getElementById("input_confirma_nova_senha").value = "";
    showMsg("Sucesso", "Senha do sistema alterada!", "sucesso");
  } else {
    showMsg("Erro", "As senhas não coincidem.", "erro");
  }
}

function removerSenhaSistema() {
  const senhaAtual = localStorage.getItem("plaza_senha_sistema");
  if (!senhaAtual) {
    showMsg("Aviso", "Não há senha configurada para remover.", "erro");
    return;
  }

  const modal = document.getElementById("modalConfirm");
  const h3 = modal.querySelector("h3");
  const icon = modal.querySelector(".modal-msg-icon");
  document.getElementById("confirmText").innerText =
    "Tem certeza que deseja remover a senha de acesso? O sistema ficará desprotegido.";
  h3.innerText = "Remover Senha?";
  icon.innerText = "🔓";
  const btn = document.getElementById("btnConfirmDelete");
  btn.innerText = "Sim, Remover";
  btn.onclick = () => {
    localStorage.removeItem("plaza_senha_sistema");
    document.getElementById("cfg_senha_input").value = "";
    fecharConfirm();
    showMsg("Sucesso", "A senha foi removida com sucesso.", "sucesso");
  };
  modal.style.display = "block";
}

// HELPERS DE INTERFACE
function fecharModalSenha() {
  document.getElementById("modalSenha").style.display = "none";
}
function fecharModalConfirmaSenha() {
  document.getElementById("modalConfirmaSenha").style.display = "none";
}
function fecharConfirm() {
  document.getElementById("modalConfirm").style.display = "none";
}
function fecharModalMsg() {
  document.getElementById("modalMsg").style.display = "none";
  if (ultimoBlobUrlExport) {
    try {
      URL.revokeObjectURL(ultimoBlobUrlExport);
    } catch (e) {}
    ultimoBlobUrlExport = null;
  }
}
function fecharModalEAtualizar() {
  location.reload();
}

function toggleVisibilidadeSenha(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

function showMsg(titulo, texto, tipo) {
  document.getElementById("msgTitle").innerText = titulo;
  document.getElementById("msgText").innerText = texto;
  const icon = document.getElementById("msgIcon");
  icon.innerText = tipo === "sucesso" ? "✅" : "❌";
  icon.style.color = tipo === "sucesso" ? "#25d366" : "#dc3545";
  document.getElementById("modalMsg").style.display = "block";
}
