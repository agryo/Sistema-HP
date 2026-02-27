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

function showMsg(titulo, texto, tipo = "sucesso") {
  document.getElementById("msgTitle").innerText = titulo;
  document.getElementById("msgText").innerText = texto;
  document.getElementById("msgIcon").innerText =
    tipo === "sucesso" ? "✅" : "❌";
  document.getElementById("modalMsg").style.display = "block";
}

function fecharModalMsg() {
  document.getElementById("modalMsg").style.display = "none";
}

// utilities
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// converte "HH:MM" em minutos desde meia-noite
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
    janta: "🍛 Janta",
    lanche: "🥪 Lanche",
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
      // Garante que todas as categorias tenham 'cap' calculado corretamente
      categorias.forEach((cat) => {
        // Sempre recalcula cap baseado em casal e solteiro se eles existem
        const casal = cat.casal || 0;
        const solteiro = cat.solteiro || 0;
        const capCalculado = casal * 2 + solteiro;

        // Se cap não existe, ou se é diferente do calculado, atualiza
        if (!cat.cap || cat.cap !== capCalculado) {
          cat.cap = capCalculado;
        }

        // VALIDAÇÃO: grupo="solteiro" só é válido para UHs com nome contendo "Single" ou nomes específicos
        // Limpa grupo inválido para UHs Triplo, Duplo, etc
        if (
          cat.grupo === "solteiro" &&
          !cat.nome.includes("Single") &&
          cat.cap > 1
        ) {
          delete cat.grupo;
        }
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
  if (modal) {
    modal.style.display = "block";
  } else {
    // Fallback caso o modal não tenha sido injetado por algum motivo
    if (confirm("Deseja realmente excluir este item?")) {
      listaItens = listaItens.filter((i) => i.id !== id);
      renderizarEdicao();
    }
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
  if (cat.casal > 0) {
    texto.push(
      cat.casal > 1 ? `${cat.casal} Camas Casal` : `${cat.casal} Cama Casal`,
    );
  }
  if (cat.solteiro > 0) {
    texto.push(
      cat.solteiro > 1
        ? `${cat.solteiro} Camas Solteiro`
        : `${cat.solteiro} Cama Solteiro`,
    );
  }
  return texto.length > 0 ? ` (${texto.join(" + ")})` : "";
}

function atualizarDoc() {
  // Recarrega valores das refeições do localStorage para garantir que sempre estejam atualizados
  const vAlmoco = localStorage.getItem("plaza_valor_almoco");
  if (vAlmoco) valorAlmocoGlobal = parseFloat(vAlmoco);
  const vJanta = localStorage.getItem("plaza_valor_janta");
  if (vJanta) valorJantaGlobal = parseFloat(vJanta);
  const vLanche = localStorage.getItem("plaza_valor_lanche");
  if (vLanche) valorLancheGlobal = parseFloat(vLanche);

  // load schedule times
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

  document.getElementById("docCliente").innerText =
    document.getElementById("clienteNome").value || "Nome do Cliente";
  document.getElementById("obsValorAlmoco").innerText =
    valorAlmocoGlobal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  document.getElementById("obsValorJanta").innerText =
    valorJantaGlobal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  document.getElementById("obsValorLanche").innerText =
    valorLancheGlobal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  document.getElementById("obsHorCafe").innerText =
    `${horarios.cafe[0]} às ${horarios.cafe[1]}`;
  document.getElementById("obsHorAlmoco").innerText =
    `${horarios.almoco[0]} às ${horarios.almoco[1]}`;
  document.getElementById("obsHorJanta").innerText =
    `${horarios.janta[0]} às ${horarios.janta[1]}`;
  document.getElementById("obsHorLanche").innerText =
    `${horarios.lanche[0]} às ${horarios.lanche[1]}`;

  const d1Input = document.getElementById("dataEntrada").value;
  const d2Input = document.getElementById("dataSaida").value; // values already constrained by handlers
  const horaEnt = document.getElementById("horaEntradaPrev").value || "14:00";
  const horaSai = document.getElementById("horaSaidaPrev").value || "11:00";

  if (!d1Input || !d2Input) return;

  const d1 = new Date(d1Input + "T00:00:00");
  const d2 = new Date(d2Input + "T00:00:00");
  const noites = Math.max(1, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)));

  // arrival/departure minutes
  const [hEnt, mEnt] = horaEnt.split(":").map(Number);
  const [hSai, mSai] = horaSai.split(":").map(Number);
  const arrMin = hEnt * 60 + mEnt;
  const depMin = hSai * 60 + mSai;

  // cálculo de horas ocupadas (entrada com hora, saída com hora)
  const dtArrivalFull = new Date(d1Input + "T" + horaEnt);
  const dtDepartFull = new Date(d2Input + "T" + horaSai);
  // período padrão: 21 horas a partir da chegada
  const occupiedHours = Math.max(
    0,
    (dtDepartFull - dtArrivalFull) / (1000 * 60 * 60),
  );
  const dtStandardEnd = new Date(dtArrivalFull.getTime() + 21 * 60 * 60 * 1000);
  const extraHoursGlobal = Math.max(
    0,
    (dtDepartFull - dtStandardEnd) / (1000 * 60 * 60),
  );
  console.log(
    `DEBUG HORAS: occupiedHours=${occupiedHours.toFixed(2)}, standardEnd=${dtStandardEnd.toISOString()}, extraHoursGlobal=${extraHoursGlobal.toFixed(2)}`,
  );

  document.getElementById("docPeriodo").innerText =
    `${d1.toLocaleDateString("pt-BR")} a ${d2.toLocaleDateString("pt-BR")}`;
  document.getElementById("docNoites").innerText = noites;
  document.getElementById("labelDiaria").innerText =
    noites === 1 ? "diária" : "diárias";
  document.getElementById("checkinData").innerText =
    d1.toLocaleDateString("pt-BR");
  document.getElementById("checkinHora").innerText = horaEnt;
  document.getElementById("checkoutData").innerText =
    d2.toLocaleDateString("pt-BR");
  document.getElementById("checkoutHora").innerText = horaSai;

  const temp = document.getElementById("temporada").value;
  const tabela = document.getElementById("tabelaCorpo");
  let total = 0;
  tabela.innerHTML = "";

  // Preparação para cálculo misto
  const altaInicioStr = localStorage.getItem("plaza_alta_inicio");
  const altaFimStr = localStorage.getItem("plaza_alta_fim");

  listaItens.forEach((item) => {
    const cat = categorias.find((c) => c.id === item.catId);
    if (!cat) return;

    // Validação: se cap está vazio, força recalcular baseado em casal/solteiro
    if (!cat.cap || cat.cap === 0) {
      const casal = cat.casal || 0;
      const solteiro = cat.solteiro || 0;
      cat.cap = casal * 2 + solteiro;
      console.warn(
        `AVISO: ${cat.nome} tinha cap inválido. Recalculado para ${cat.cap}`,
      );
    }

    let somaUnitario = 0;

    if (temp === "auto") {
      // Cálculo dia a dia
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
      const vDia = item.cafe ? p[0] : p[1];
      somaUnitario = vDia * noites;
    }

    // efetiva de capacidade por unidade
    const capEfetiva = cat.grupo === "solteiro" ? 1 : cat.cap || 1;

    // Guarda o total de acomodação (diárias) antes de adicionar refeições
    const baseAccommodationTotal = somaUnitario;

    // Cálculo de refeições de acordo com horários e entrada/saída
    let mealTotal = 0;
    if (item.almoco || item.janta || item.lanche) {
      // contagem direta sem loop para evitar complicação
      const middleDays = Math.max(0, noites - 1);
      if (item.almoco) {
        let count = 0;
        if (arrMin <= parseTime(horarios.almoco[1])) count++;
        if (depMin >= parseTime(horarios.almoco[0])) count++;
        count += middleDays;
        mealTotal += count * valorAlmocoGlobal;
      }
      if (item.janta) {
        let count = 0;
        if (arrMin <= parseTime(horarios.janta[1])) count++;
        if (depMin >= parseTime(horarios.janta[0])) count++;
        count += middleDays;
        mealTotal += count * valorJantaGlobal;
      }
      if (item.lanche) {
        let count = 0;
        if (arrMin <= parseTime(horarios.lanche[1])) count++;
        if (depMin >= parseTime(horarios.lanche[0])) count++;
        count += middleDays;
        mealTotal += count * valorLancheGlobal;
      }
      mealTotal *= capEfetiva;
      somaUnitario += mealTotal;
    }

    const sub = somaUnitario * item.qtd;
    total += sub;

    // cálculo de horas extras: usa a parte de acomodação (baseAccommodationTotal)
    let extraCharge = 0;
    if (extraHoursGlobal > 0 && noites > 0) {
      const baseDaily = baseAccommodationTotal / noites; // valor da diária (acomodação + café se estava incluso)
      const hourlyRate = baseDaily / 21; // valor por hora
      extraCharge = hourlyRate * extraHoursGlobal * item.qtd;
      console.log(
        `DEBUG EXTRA ${cat.nome}: baseDaily=${baseDaily}, hourlyRate=${hourlyRate}, extraCharge=${extraCharge}, qtd=${item.qtd}`,
      );
      total += extraCharge;
    }

    const vDiariaMedia = somaUnitario / noites;

    const infoCamas = formatarCamas(cat);

    const totalComExtra = sub + extraCharge;

    tabela.innerHTML += `<tr>
			<td>${item.qtd}</td>
			<td><strong>${cat.nome}${infoCamas}</strong>${item.cargo ? "<br><small>• " + item.cargo + "</small>" : ""}</td>
			<td>${(item.cafe ? "Com Café" : "Sem Café") + (item.almoco ? " + Almoço" : "") + (item.janta ? " + Janta" : "") + (item.lanche ? " + Lanche" : "")}</td>
			<td>${vDiariaMedia.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
			<td>${sub.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}${extraCharge > 0 ? `<br><small>+ ${extraCharge.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} (${Math.round(extraHoursGlobal)} horas extra)</small>` : ""}</td>
			<td>${totalComExtra.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
		</tr>`;
  });
  document.getElementById("totalGeral").innerText = total.toLocaleString(
    "pt-BR",
    { style: "currency", currency: "BRL" },
  );
}

function exportarOrcamento() {
  const dados = {
    cabecalho: "ORCAMENTO_SALVO_PLAZA",
    cliente: document.getElementById("clienteNome").value,
    temporada: document.getElementById("temporada").value,
    entrada: document.getElementById("dataEntrada").value,
    saida: document.getElementById("dataSaida").value,
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

  setTimeout(() => {
    showMsg("Orçamento Exportado", "O arquivo foi gerado e salvo com sucesso.");
  }, 500);
}

function importarOrcamento(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);

      // VALIDAÇÃO DA ASSINATURA RIGOROSA
      if (!data || data.cabecalho !== "ORCAMENTO_SALVO_PLAZA") {
        showMsg(
          "Arquivo Inválido",
          "Este arquivo não é um orçamento válido do Hotel Plaza.",
          "erro",
        );
        event.target.value = "";
        return;
      }

      // Captura o estado atual da tela para comparação
      const estadoAtual = {
        cabecalho: "ORCAMENTO_SALVO_PLAZA",
        cliente: document.getElementById("clienteNome").value,
        temporada: document.getElementById("temporada").value,
        entrada: document.getElementById("dataEntrada").value,
        saida: document.getElementById("dataSaida").value,
        itens: listaItens,
        valorAlmoco: valorAlmocoGlobal,
      };

      // Compara se o arquivo é idêntico ao que já está na tela
      if (JSON.stringify(estadoAtual) === JSON.stringify(data)) {
        showMsg(
          "Nenhuma Alteração",
          "O orçamento na tela já é idêntico ao arquivo selecionado.",
        );
      } else {
        // Se for diferente, carrega os dados e restaura
        document.getElementById("clienteNome").value = data.cliente || "";
        document.getElementById("temporada").value = data.temporada || "baixa";
        document.getElementById("dataEntrada").value = data.entrada || "";
        document.getElementById("dataSaida").value = data.saida || "";
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
    // CORREÇÃO DO BUG: Limpa o input para permitir selecionar o mesmo arquivo novamente
    event.target.value = "";
  };
  reader.readAsText(file);
}

window.onload = () => {
  carregarConfiguracoes();
  // ensure date constraints
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
  ent.addEventListener("change", adjustDates);
  sai.addEventListener("change", adjustDates);
  // times also affect meal calculations
  document
    .getElementById("horaEntradaPrev")
    .addEventListener("change", atualizarDoc);
  document
    .getElementById("horaSaidaPrev")
    .addEventListener("change", atualizarDoc);

  // Datas padrão (Hoje e Amanhã)
  const hoje = new Date().toISOString().split("T")[0];
  document.getElementById("dataEntrada").value = hoje;
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  document.getElementById("dataSaida").value = amanha
    .toISOString()
    .split("T")[0];

  adicionarLinha();

  // Atualiza documento com os valores carregados
  atualizarDoc();
  updateBulkButtons();
  atualizarDoc();
};

// Listener para recarregar valores na visibilidade da página
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    carregarConfiguracoes();
    atualizarDoc();
  }
});
