let valorAlmocoGlobal = 30.0;
let valorJantaGlobal = 25.0;
let valorLancheGlobal = 15.0;
let categorias = [
  {
    id: "std_prom",
    nome: "Standard Promocional",
    alta: [154, 121],
    baixa: [130, 89.9],
    cap: 1,
    casal: 0,
    solteiro: 1,
  },
  {
    id: "std_plus",
    nome: "Standard Plus",
    alta: [242, 198],
    baixa: [198, 154],
    cap: 2,
    casal: 1,
    solteiro: 0,
  },
];
let listaItens = [];
let idParaExcluir = null;

// Variáveis para textos do orçamento
let orcTitulo = "Orçamento de Hospedagem";
let orcConfigTitulo = "1. Configuração de Acomodação e Valores";
let orcConfigDescricao = "";
let orcNotaRefeicoes = "";
let orcCronograma = "";
let orcPagamento = "";
let orcObservacoes = "";
let orcRodape = "Setor de Reservas - Hotel Plaza";
let orcSinalPercentual = 50;

function showMsg(titulo, texto, tipo = "sucesso") {
  const elMsgTitle = document.getElementById("msgTitle");
  const elMsgText = document.getElementById("msgText");
  const elMsgIcon = document.getElementById("msgIcon");
  const elModalMsg = document.getElementById("modalMsg");
  if (elMsgTitle) elMsgTitle.innerText = titulo;
  if (elMsgText) elMsgText.innerText = texto;
  if (elMsgIcon) {
    elMsgIcon.innerText = tipo === "sucesso" ? "✅" : "❌";
    elMsgIcon.style.color = tipo === "sucesso" ? "#25d366" : "#dc3545";
  }
  if (elModalMsg) elModalMsg.style.display = "block";
}

function fecharModalMsg() {
  const modal = document.getElementById("modalMsg");
  if (modal) modal.style.display = "none";
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function parseTime(str) {
  const [h, m] = (str || "0:00").split(":").map(Number);
  return h * 60 + m;
}

function toggleAll(meal) {
  const allChecked = listaItens.length > 0 && listaItens.every((i) => i[meal]);
  marcarTodos(meal, !allChecked);
}

function updateBulkButtons() {
  const labels = {
    cafe: "☕ Café",
    almoco: "🍽️ Almoço",
    lanche: "🥪 Lanche",
    janta: "🍛 Janta",
  };
  ["cafe", "almoco", "janta", "lanche"].forEach((meal) => {
    const btn = document.getElementById("btnBulk" + capitalize(meal));
    if (!btn) return;
    const all = listaItens.length > 0 && listaItens.every((i) => i[meal]);
    btn.innerText = all
      ? `Todos sem ${labels[meal]}`
      : `Todos com ${labels[meal]}`;
  });
}

function carregarConfiguracoes() {
  const precos = localStorage.getItem("plaza_tarifario");
  if (precos) {
    try {
      const parsed = JSON.parse(precos);
      categorias = parsed.t || parsed;
      categorias.forEach((cat) => {
        const casal = cat.casal || 0;
        const solteiro = cat.solteiro || 0;
        const capCalculado = casal * 2 + solteiro;
        if (!cat.cap || cat.cap !== capCalculado) cat.cap = capCalculado;
        if (
          cat.grupo === "solteiro" &&
          !cat.nome.includes("Single") &&
          cat.cap > 1
        )
          delete cat.grupo;
      });
    } catch (err) {
      categorias = [];
    }
  }
  const vAlmoco = localStorage.getItem("plaza_valor_almoco");
  if (vAlmoco) valorAlmocoGlobal = parseFloat(vAlmoco);
  const vJanta = localStorage.getItem("plaza_valor_janta");
  if (vJanta) valorJantaGlobal = parseFloat(vJanta);
  const vLanche = localStorage.getItem("plaza_valor_lanche");
  if (vLanche) valorLancheGlobal = parseFloat(vLanche);

  // Carrega textos do orçamento
  orcTitulo =
    localStorage.getItem("plaza_orc_titulo") || "Orçamento de Hospedagem";
  orcConfigTitulo =
    localStorage.getItem("plaza_orc_config_titulo") ||
    "1. Configuração de Acomodação e Valores";
  orcConfigDescricao = localStorage.getItem("plaza_orc_config_descricao") || "";
  orcNotaRefeicoes = localStorage.getItem("plaza_orc_nota_refeicoes") || "";
  orcCronograma = localStorage.getItem("plaza_orc_cronograma") || "";
  orcPagamento = localStorage.getItem("plaza_orc_pagamento") || "";
  orcObservacoes = localStorage.getItem("plaza_orc_observacoes") || "";
  orcRodape =
    localStorage.getItem("plaza_orc_rodape") ||
    "Setor de Reservas - Hotel Plaza";
  orcSinalPercentual = parseInt(
    localStorage.getItem("plaza_orc_sinal_percentual") || "50",
  );
}

function adicionarLinha() {
  if (categorias.length === 0) return;
  listaItens.push({
    id: Date.now(),
    catId: categorias[0].id,
    qtd: 1,
    cafe: true,
    almoco: false,
    janta: false,
    lanche: false,
    cargo: "",
  });
  renderizarEdicao();
}

function fecharModalConfirmacao() {
  const modal = document.getElementById("modalConfirmDelete");
  if (modal) modal.style.display = "none";
  idParaExcluir = null;
}

function confirmarExclusao() {
  if (idParaExcluir !== null) {
    listaItens = listaItens.filter((i) => i.id !== idParaExcluir);
    renderizarEdicao();
  }
  fecharModalConfirmacao();
}

function removerLinha(id) {
  idParaExcluir = id;
  const modal = document.getElementById("modalConfirmDelete");
  if (modal) modal.style.display = "block";
  else if (confirm("Deseja realmente excluir este item?")) {
    listaItens = listaItens.filter((i) => i.id !== id);
    renderizarEdicao();
  }
}

function editar(id, campo, valor) {
  const item = listaItens.find((i) => i.id === id);
  if (item) {
    item[campo] = valor;
    atualizarDoc();
    updateBulkButtons();
  }
}

function marcarTodos(campo, valor) {
  listaItens.forEach((item) => (item[campo] = valor));
  renderizarEdicao();
}

function renderizarEdicao() {
  const container = document.getElementById("edicaoItens");
  if (!container) return;
  container.innerHTML = listaItens
    .map(
      (item) => `
    <div class="form-row" style="background:#f1f3f4; padding:10px; border-radius:8px; align-items:center; border:1px solid #ddd; margin-bottom:8px;">
      <div style="flex:0.4"><label>Qtd</label><input type="number" class="input-qtd" value="${item.qtd}" min="1" oninput="editar(${item.id}, 'qtd', parseInt(this.value))"></div>
      <div style="flex:2.5"><label>Acomodação</label><select onchange="editar(${item.id}, 'catId', this.value)" style="width:100%">
        ${categorias.map((c) => `<option value="${c.id}" ${item.catId == c.id ? "selected" : ""}>${c.nome}</option>`).join("")}
      </select></div>
      <div style="flex:3.5"><label>Função / Equipe</label><input type="text" value="${item.cargo}" oninput="editar(${item.id}, 'cargo', this.value)" style="width:100%"></div>
      <div style="flex:2; display:flex; gap:10px; padding-top:18px; flex-wrap:wrap;">
        <label style="font-size:11px; display:flex; align-items:center;"><input type="checkbox" ${item.cafe ? "checked" : ""} onchange="editar(${item.id}, 'cafe', this.checked)"> Café</label>
        <label style="font-size:11px; display:flex; align-items:center;"><input type="checkbox" ${item.almoco ? "checked" : ""} onchange="editar(${item.id}, 'almoco', this.checked)"> Almoço</label>
        <label style="font-size:11px; display:flex; align-items:center;"><input type="checkbox" ${item.janta ? "checked" : ""} onchange="editar(${item.id}, 'janta', this.checked)"> Janta</label>
        <label style="font-size:11px; display:flex; align-items:center;"><input type="checkbox" ${item.lanche ? "checked" : ""} onchange="editar(${item.id}, 'lanche', this.checked)"> Lanche</label>
      </div>
      <div style="padding-top:18px;"><button class="btn-remover" style="background:#ff4d4d; color:white; border:none; padding:8px; border-radius:4px; cursor:pointer;" onclick="removerLinha(${item.id})">🗑️</button></div>
    </div>
  `,
    )
    .join("");
  atualizarDoc();
  updateBulkButtons();
}

function formatarCamas(cat) {
  let texto = [];
  if (cat.casal > 0)
    texto.push(
      cat.casal > 1 ? `${cat.casal} Camas Casal` : `${cat.casal} Cama Casal`,
    );
  if (cat.solteiro > 0)
    texto.push(
      cat.solteiro > 1
        ? `${cat.solteiro} Camas Solteiro`
        : `${cat.solteiro} Cama Solteiro`,
    );
  return texto.length > 0 ? ` (${texto.join(" + ")})` : "";
}

function formatarDataBR(dataISO) {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

function substituirPlaceholders(texto) {
  if (!texto) return texto;

  const d1Input = document.getElementById("dataEntrada")?.value;
  const d2Input = document.getElementById("dataSaida")?.value;
  let checkinDataBr = "",
    checkoutDataBr = "";
  if (d1Input) {
    const d1 = new Date(d1Input + "T00:00:00");
    checkinDataBr = d1.toLocaleDateString("pt-BR");
  }
  if (d2Input) {
    const d2 = new Date(d2Input + "T00:00:00");
    checkoutDataBr = d2.toLocaleDateString("pt-BR");
  }

  const vars = {
    // Horários e datas
    checkinHora: document.getElementById("horaEntradaPrev")?.value || "14:00",
    checkoutHora: document.getElementById("horaSaidaPrev")?.value || "11:00",
    checkinData: d1Input || "",
    checkoutData: d2Input || "",
    checkinDataBr: checkinDataBr,
    checkoutDataBr: checkoutDataBr,
    // Valores das refeições
    valorAlmoco: valorAlmocoGlobal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    valorJanta: valorJantaGlobal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    valorLanche: valorLancheGlobal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    // Total calculado
    totalGeral: document.getElementById("totalGeral")?.innerText || "R$ 0,00",
    // Número de diárias
    noites: document.getElementById("docNoites")?.innerText || "0",
    // Nome do cliente
    cliente: document.getElementById("clienteNome")?.value || "",
    // Temporada selecionada
    temporada: document.getElementById("temporada")?.value || "auto",
    // Percentual de sinal configurado
    sinalPercentual: orcSinalPercentual,
    // Promoções (se existirem)
    percentualDesconto: localStorage.getItem("plaza_promo_porcentagem") || "0",
    minimoDiarias: localStorage.getItem("plaza_promo_min_diarias") || "0",
    textoPromocao: localStorage.getItem("plaza_promo_texto") || "",
    // Horas extras (se houver)
    horasExtras: (() => {
      const extra = parseFloat(
        localStorage.getItem("plaza_ultimas_horas_extras") || "0",
      );
      return extra > 0 ? extra.toFixed(0) : "0";
    })(),
    mensagemHorasExtras: (() => {
      const extra = parseFloat(
        localStorage.getItem("plaza_ultimas_horas_extras") || "0",
      );
      return extra > 0
        ? `<strong>Horas Extras (Day Use):</strong> Estão contabilizadas ${extra.toFixed(0)} horas de prolongamento na estadia após o vencimento da diária.`
        : "";
    })(),
  };

  return texto.replace(/{(\w+)}/g, (match, chave) => {
    return vars.hasOwnProperty(chave) ? vars[chave] : match;
  });
}

function atualizarDoc() {
  const vAlmoco = localStorage.getItem("plaza_valor_almoco");
  if (vAlmoco) valorAlmocoGlobal = parseFloat(vAlmoco);
  const vJanta = localStorage.getItem("plaza_valor_janta");
  if (vJanta) valorJantaGlobal = parseFloat(vJanta);
  const vLanche = localStorage.getItem("plaza_valor_lanche");
  if (vLanche) valorLancheGlobal = parseFloat(vLanche);

  carregarConfiguracoes();

  let horarios = {
    cafe: ["07:00", "09:00", true],
    almoco: ["11:00", "13:00", true],
    lanche: ["15:00", "17:00", true],
    janta: ["18:00", "20:00", true],
  };
  try {
    const h = JSON.parse(
      localStorage.getItem("plaza_horarios_refeicoes") || "{}",
    );
    horarios = Object.assign(horarios, h);
  } catch (e) {}

  const elDocCliente = document.getElementById("docCliente");
  if (elDocCliente)
    elDocCliente.innerText =
      document.getElementById("clienteNome")?.value || "Nome do Cliente";

  const elObsValorAlmoco = document.getElementById("obsValorAlmoco");
  if (elObsValorAlmoco)
    elObsValorAlmoco.innerText = valorAlmocoGlobal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  const elObsValorJanta = document.getElementById("obsValorJanta");
  if (elObsValorJanta)
    elObsValorJanta.innerText = valorJantaGlobal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  const elObsValorLanche = document.getElementById("obsValorLanche");
  if (elObsValorLanche)
    elObsValorLanche.innerText = valorLancheGlobal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const elObsHorCafe = document.getElementById("obsHorCafe");
  if (elObsHorCafe)
    elObsHorCafe.innerText = `${horarios.cafe[0]} às ${horarios.cafe[1]}`;
  const elObsHorAlmoco = document.getElementById("obsHorAlmoco");
  if (elObsHorAlmoco)
    elObsHorAlmoco.innerText = `${horarios.almoco[0]} às ${horarios.almoco[1]}`;
  const elObsHorJanta = document.getElementById("obsHorJanta");
  if (elObsHorJanta)
    elObsHorJanta.innerText = `${horarios.janta[0]} às ${horarios.janta[1]}`;
  const elObsHorLanche = document.getElementById("obsHorLanche");
  if (elObsHorLanche)
    elObsHorLanche.innerText = `${horarios.lanche[0]} às ${horarios.lanche[1]}`;

  const d1Input = document.getElementById("dataEntrada")?.value;
  const d2Input = document.getElementById("dataSaida")?.value;
  const horaEnt = document.getElementById("horaEntradaPrev")?.value || "14:00";
  const horaSai = document.getElementById("horaSaidaPrev")?.value || "11:00";

  if (!d1Input || !d2Input) return;

  const d1 = new Date(d1Input + "T00:00:00");
  const d2 = new Date(d2Input + "T00:00:00");
  const noites = Math.max(1, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)));

  const [hEnt, mEnt] = horaEnt.split(":").map(Number);
  const [hSai, mSai] = horaSai.split(":").map(Number);
  const arrMin = hEnt * 60 + mEnt;
  const depMin = hSai * 60 + mSai;

  const dtArrivalFull = new Date(d1Input + "T" + horaEnt);
  const dtDepartFull = new Date(d2Input + "T" + horaSai);
  const dtStandardEnd = new Date(dtArrivalFull.getTime() + 21 * 60 * 60 * 1000);
  const extraHoursGlobal = Math.max(
    0,
    (dtDepartFull - dtStandardEnd) / (1000 * 60 * 60),
  );

  localStorage.setItem(
    "plaza_ultimas_horas_extras",
    extraHoursGlobal.toFixed(2),
  );

  const elDocPeriodo = document.getElementById("docPeriodo");
  if (elDocPeriodo)
    elDocPeriodo.innerText = `${d1.toLocaleDateString("pt-BR")} a ${d2.toLocaleDateString("pt-BR")}`;
  const elDocNoites = document.getElementById("docNoites");
  if (elDocNoites) elDocNoites.innerText = noites;
  const elLabelDiaria = document.getElementById("labelDiaria");
  if (elLabelDiaria)
    elLabelDiaria.innerText = noites === 1 ? "diária" : "diárias";
  const elCheckinData = document.getElementById("checkinData");
  if (elCheckinData) elCheckinData.innerText = d1.toLocaleDateString("pt-BR");
  const elCheckinHora = document.getElementById("checkinHora");
  if (elCheckinHora) elCheckinHora.innerText = horaEnt;
  const elCheckoutData = document.getElementById("checkoutData");
  if (elCheckoutData) elCheckoutData.innerText = d2.toLocaleDateString("pt-BR");
  const elCheckoutHora = document.getElementById("checkoutHora");
  if (elCheckoutHora) elCheckoutHora.innerText = horaSai;

  const temp = document.getElementById("temporada")?.value;
  const tabela = document.getElementById("tabelaCorpo");
  if (!tabela) return;

  let total = 0;
  tabela.innerHTML = "";

  const altaInicioStr = localStorage.getItem("plaza_alta_inicio");
  const altaFimStr = localStorage.getItem("plaza_alta_fim");

  listaItens.forEach((item) => {
    const cat = categorias.find((c) => c.id === item.catId);
    if (!cat) return;

    if (!cat.cap || cat.cap === 0) {
      cat.cap = (cat.casal || 0) * 2 + (cat.solteiro || 0);
    }

    let somaUnitario = 0;

    if (temp === "auto") {
      let current = new Date(d1);
      current.setHours(0, 0, 0, 0);
      const end = new Date(d2);
      end.setHours(0, 0, 0, 0);
      while (current < end) {
        let isAlta = false;
        if (altaInicioStr && altaFimStr) {
          const dtAltaIni = new Date(altaInicioStr + "T00:00:00");
          const dtAltaFim = new Date(altaFimStr + "T00:00:00");
          if (current >= dtAltaIni && current <= dtAltaFim) isAlta = true;
        }
        const pDia = isAlta ? cat.alta : cat.baixa;
        somaUnitario += item.cafe ? pDia[0] : pDia[1];
        current.setDate(current.getDate() + 1);
      }
    } else {
      const p = temp === "alta" ? cat.alta : cat.baixa;
      somaUnitario = (item.cafe ? p[0] : p[1]) * noites;
    }

    const capEfetiva = cat.grupo === "solteiro" ? 1 : cat.cap || 1;
    const baseAccommodationTotal = somaUnitario;

    let mealTotal = 0;
    let countAlmoco = 0,
      countLanche = 0,
      countJanta = 0;
    if (item.almoco || item.lanche || item.janta) {
      const middleDays = Math.max(0, noites - 1);
      if (item.almoco) {
        let count = 0;
        if (arrMin <= parseTime(horarios.almoco[1])) count++;
        if (depMin >= parseTime(horarios.almoco[0])) count++;
        count += middleDays;
        countAlmoco = count;
        mealTotal += count * valorAlmocoGlobal;
      }
      if (item.lanche) {
        let count = 0;
        if (arrMin <= parseTime(horarios.lanche[1])) count++;
        if (depMin >= parseTime(horarios.lanche[0])) count++;
        count += middleDays;
        countLanche = count;
        mealTotal += count * valorLancheGlobal;
      }
      if (item.janta) {
        let count = 0;
        if (arrMin <= parseTime(horarios.janta[1])) count++;
        if (depMin >= parseTime(horarios.janta[0])) count++;
        count += middleDays;
        countJanta = count;
        mealTotal += count * valorJantaGlobal;
      }
      mealTotal *= capEfetiva;
      somaUnitario += mealTotal;
    }

    const sub = somaUnitario * item.qtd;
    total += sub;

    let extraCharge = 0;
    if (extraHoursGlobal > 0 && noites > 0) {
      const baseDaily = baseAccommodationTotal / noites;
      const hourlyRate = baseDaily / 21;
      extraCharge = hourlyRate * extraHoursGlobal * item.qtd;
      total += extraCharge;
    }

    const vDiariaMedia = somaUnitario / noites;
    const infoCamas = formatarCamas(cat);
    const totalComExtra = sub + extraCharge;

    let servicosStr = item.cafe ? "Com Café" : "Sem Café";
    if (countAlmoco > 0)
      servicosStr += ` + ${countAlmoco} Almoço${countAlmoco > 1 ? "s" : ""}`;
    if (countLanche > 0)
      servicosStr += ` + ${countLanche} Lanche${countLanche > 1 ? "s" : ""}`;
    if (countJanta > 0)
      servicosStr += ` + ${countJanta} Janta${countJanta > 1 ? "s" : ""}`;

    tabela.innerHTML += `<tr>
      <td>${item.qtd}</td>
      <td><strong>${cat.nome}${infoCamas}</strong>${item.cargo ? "<br><small>• " + item.cargo + "</small>" : ""}</td>
      <td>${servicosStr}</td>
      <td>${vDiariaMedia.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
      <td>${sub.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}${extraCharge > 0 ? `<br><small>+ ${extraCharge.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} (${Math.round(extraHoursGlobal)} horas extra)</small>` : ""}</td>
      <td>${totalComExtra.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
    </tr>`;
  });

  const elTotalGeral = document.getElementById("totalGeral");
  if (elTotalGeral)
    elTotalGeral.innerText = total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  // Atualiza novos elementos de texto com innerHTML (permite formatação)
  const elDocTitulo = document.getElementById("docTitulo");
  if (elDocTitulo) elDocTitulo.innerHTML = substituirPlaceholders(orcTitulo);

  const elConfigTitulo = document.getElementById("docConfigTitulo");
  if (elConfigTitulo)
    elConfigTitulo.innerHTML = substituirPlaceholders(orcConfigTitulo);
  const elConfigDesc = document.getElementById("docConfigDescricao");
  if (elConfigDesc)
    elConfigDesc.innerHTML = substituirPlaceholders(orcConfigDescricao);

  const elNota = document.getElementById("docNotaRefeicoes");
  if (elNota) elNota.innerHTML = substituirPlaceholders(orcNotaRefeicoes);

  const elDocCronograma = document.getElementById("docCronograma");
  if (elDocCronograma)
    elDocCronograma.innerHTML = substituirPlaceholders(orcCronograma);
  const elDocPagamento = document.getElementById("docPagamento");
  if (elDocPagamento)
    elDocPagamento.innerHTML = substituirPlaceholders(orcPagamento);
  const elDocObservacoes = document.getElementById("docObservacoes");
  if (elDocObservacoes)
    elDocObservacoes.innerHTML = substituirPlaceholders(orcObservacoes);
  const elDocRodape = document.getElementById("docRodape");
  if (elDocRodape) elDocRodape.innerHTML = substituirPlaceholders(orcRodape);
}

function exportarOrcamento() {
  const dados = {
    cabecalho: "ORCAMENTO_SALVO_PLAZA",
    cliente: document.getElementById("clienteNome")?.value || "",
    temporada: document.getElementById("temporada")?.value || "auto",
    entrada: document.getElementById("dataEntrada")?.value || "",
    saida: document.getElementById("dataSaida")?.value || "",
    horaEntrada: document.getElementById("horaEntradaPrev").value || "14:00",
    horaSaida: document.getElementById("horaSaidaPrev").value || "11:00",
    itens: listaItens,
    valorAlmoco: valorAlmocoGlobal,
    valorJanta: valorJantaGlobal,
    valorLanche: valorLancheGlobal,
  };
  const blob = new Blob([JSON.stringify(dados, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    "orcamento_" +
    (dados.cliente.replace(/\s+/g, "_") || "hospedagem") +
    ".json";
  a.click();
  setTimeout(
    () =>
      showMsg(
        "Orçamento Exportado",
        "O arquivo foi gerado e salvo com sucesso.",
      ),
    500,
  );
}

function importarOrcamento(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data || data.cabecalho !== "ORCAMENTO_SALVO_PLAZA") {
        showMsg(
          "Arquivo Inválido",
          "Este arquivo não é um orçamento válido do Hotel Plaza.",
          "erro",
        );
        event.target.value = "";
        return;
      }
      const estadoAtual = {
        cabecalho: "ORCAMENTO_SALVO_PLAZA",
        cliente: document.getElementById("clienteNome")?.value || "",
        temporada: document.getElementById("temporada")?.value || "auto",
        entrada: document.getElementById("dataEntrada")?.value || "",
        saida: document.getElementById("dataSaida")?.value || "",
        horaEntrada:
          document.getElementById("horaEntradaPrev")?.value || "14:00",
        horaSaida: document.getElementById("horaSaidaPrev")?.value || "11:00",
        itens: listaItens,
        valorAlmoco: valorAlmocoGlobal,
      };
      if (JSON.stringify(estadoAtual) === JSON.stringify(data)) {
        showMsg(
          "Nenhuma Alteração",
          "O orçamento na tela já é idêntico ao arquivo selecionado.",
        );
      } else {
        const elCliente = document.getElementById("clienteNome");
        if (elCliente) elCliente.value = data.cliente || "";
        const elTemporada = document.getElementById("temporada");
        if (elTemporada) elTemporada.value = data.temporada || "baixa";
        const elEntrada = document.getElementById("dataEntrada");
        if (elEntrada) elEntrada.value = data.entrada || "";
        const elSaida = document.getElementById("dataSaida");
        if (elSaida) elSaida.value = data.saida || "";
        const elHoraEnt = document.getElementById("horaEntradaPrev");
        if (elHoraEnt) elHoraEnt.value = data.horaEntrada || "14:00";
        const elHoraSai = document.getElementById("horaSaidaPrev");
        if (elHoraSai) elHoraSai.value = data.horaSaida || "11:00";
        listaItens = data.itens || [];
        renderizarEdicao();
        showMsg("Sucesso!", "O orçamento foi carregado e restaurado.");
      }
    } catch (err) {
      showMsg(
        "Erro de Leitura",
        "O arquivo está corrompido ou não é um formato de orçamento válido.",
        "erro",
      );
    }
    event.target.value = "";
  };
  reader.readAsText(file);
}

window.onload = () => {
  carregarConfiguracoes();
  const ent = document.getElementById("dataEntrada");
  const sai = document.getElementById("dataSaida");
  function adjustDates() {
    const d1 = ent.value ? new Date(ent.value + "T00:00:00") : null;
    let d2 = sai.value ? new Date(sai.value + "T00:00:00") : null;
    if (d1) {
      if (!d2 || d2 <= d1) {
        let newd = new Date(d1);
        newd.setDate(newd.getDate() + 1);
        sai.value = newd.toISOString().split("T")[0];
        d2 = newd;
      }
      sai.min = new Date(d1.getTime() + 86400000).toISOString().split("T")[0];
    }
    atualizarDoc();
  }
  if (ent) ent.addEventListener("change", adjustDates);
  if (sai) sai.addEventListener("change", adjustDates);
  const horaEnt = document.getElementById("horaEntradaPrev");
  const horaSai = document.getElementById("horaSaidaPrev");
  if (horaEnt) horaEnt.addEventListener("change", atualizarDoc);
  if (horaSai) horaSai.addEventListener("change", atualizarDoc);

  const hoje = new Date().toISOString().split("T")[0];
  if (ent) ent.value = hoje;
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  if (sai) sai.value = amanha.toISOString().split("T")[0];

  adicionarLinha();
  atualizarDoc();
  updateBulkButtons();
  atualizarDoc();
};

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    carregarConfiguracoes();
    atualizarDoc();
  }
});
