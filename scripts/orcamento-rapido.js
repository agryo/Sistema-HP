let categorias = [];
// Fallback mínimo caso não haja dados em localStorage
const defaultCategorias = [
  {
    id: "std_prom",
    nome: "Standard Promocional",
    alta: [154, 121],
    baixa: [130, 89.9],
    cap: 1,
    casal: 0,
    solteiro: 1,
    desc: "",
    comodidades: [],
  },
  {
    id: "std_plus",
    nome: "Standard Plus",
    alta: [242, 198],
    baixa: [198, 154],
    cap: 2,
    casal: 1,
    solteiro: 0,
    desc: "",
    comodidades: [],
  },
];
let festividade = "";
let valorAlmocoGlobal = 0;

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

async function carregarConfiguracoes() {
  const dadosSalvos = localStorage.getItem("plaza_tarifario");
  festividade = localStorage.getItem("plaza_festividade") || "Temporada 2026";

  // PUXA O VALOR DO ALMOÇO DO INDEX
  const almocoSalvo = localStorage.getItem("plaza_valor_almoco");
  valorAlmocoGlobal = almocoSalvo ? parseFloat(almocoSalvo) : 0;

  document.getElementById("tituloFest").innerText =
    "🎊 Orçamento " + festividade;

  if (dadosSalvos) {
    try {
      const parsed = JSON.parse(dadosSalvos);
      categorias = parsed.t || parsed || [];
    } catch (err) {
      categorias = [];
    }
  }

  // Se não há categorias no localStorage, tentar carregar backup JSON do projeto
  if (!categorias || categorias.length === 0) {
    // Usar os dados embutidos como configuração inicial
    categorias = defaultCategorias.slice();
  }

  const select = document.getElementById("quarto");
  if (select)
    select.innerHTML = categorias
      .map((c) => `<option value="${c.id}">${c.nome}</option>`)
      .join("");

  document.getElementById("dataEntrada").value = new Date()
    .toISOString()
    .split("T")[0];
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  document.getElementById("dataSaida").value = amanha
    .toISOString()
    .split("T")[0];

  gerarOrcamento();
}

function formatarCamas(q) {
  let p = [];
  if (q.casal > 0) p.push(`${q.casal} Cama${q.casal > 1 ? "s" : ""} Casal`);
  if (q.solteiro > 0)
    p.push(`${q.solteiro} Cama${q.solteiro > 1 ? "s" : ""} Solteiro`);
  return p.length > 0 ? p.join(" + ") : "Configuração sob consulta";
}

function gerarOrcamento() {
  const selectEl = document.getElementById("quarto");
  const idSelecionado = selectEl ? selectEl.value : null;
  const q = idSelecionado
    ? categorias.find((c) => c.id === idSelecionado)
    : null;

  const d1Value = document.getElementById("dataEntrada").value;
  const d2Value = document.getElementById("dataSaida").value;

  if (!d1Value || !d2Value) return;

  const d1 = new Date(d1Value + "T00:00:00");
  const d2 = new Date(d2Value + "T00:00:00");

  if (isNaN(d1.getTime()) || isNaN(d2.getTime()) || d2 <= d1) {
    document.getElementById("previa").innerText = "Selecione datas válidas.";
    return;
  }

  const noites = Math.ceil((d2 - d1) / 86400000);

  if (!q) {
    document.getElementById("previa").innerText =
      "Selecione um tipo de acomodação válido.";
    return;
  }

  // Inferir grupo quando não houver `q.grupo` (mesma lógica usada em tabela-opcoes)
  let grupoFinal;
  if (q.grupo) {
    grupoFinal = q.grupo;
  } else if ((q.solteiro || 0) >= 3 && (q.casal || 0) === 0) {
    grupoFinal = "solteiro";
  } else if ((q.casal || 0) >= 1 && (q.solteiro || 0) >= 1) {
    grupoFinal = "casal";
  } else if ((q.casal || 0) > 0) {
    grupoFinal = "casal";
  } else {
    grupoFinal = "solteiro";
  }

  // CÁLCULO MISTO (ALTA/BAIXA)
  const altaInicioStr = localStorage.getItem("plaza_alta_inicio");
  const altaFimStr = localStorage.getItem("plaza_alta_fim");

  let somaCom = 0;
  let somaSem = 0;
  let diasAlta = 0;
  let diasBaixa = 0;

  // Itera dia a dia para somar o valor correto
  let current = new Date(d1);
  // Ajusta para meia-noite para evitar problemas de fuso/hora
  current.setHours(0, 0, 0, 0);
  const end = new Date(d2);
  end.setHours(0, 0, 0, 0);

  while (current < end) {
    let isAlta = false;
    // Se houver datas configuradas, verifica. Se não, assume ALTA (comportamento padrão antigo do OR)
    if (altaInicioStr && altaFimStr) {
      const dtAltaIni = new Date(altaInicioStr + "T00:00:00");
      const dtAltaFim = new Date(altaFimStr + "T00:00:00");
      if (current >= dtAltaIni && current <= dtAltaFim) {
        isAlta = true;
      }
    } else {
      isAlta = true; // Fallback para Alta se não configurado (Orçamento Rápido padrão)
    }

    if (isAlta) {
      somaCom += q.alta[0];
      somaSem += q.alta[1];
      diasAlta++;
    } else {
      somaCom += q.baixa[0];
      somaSem += q.baixa[1];
      diasBaixa++;
    }
    current.setDate(current.getDate() + 1);
  }

  const totalComFmt = somaCom.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const totalSemFmt = somaSem.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // Define texto da diária (se for misto, mostra média ou indicativo)
  let txtDiariaCom, txtDiariaSem;
  if (diasAlta > 0 && diasBaixa > 0) {
    txtDiariaCom = `${(somaCom / noites).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} (média)`;
    txtDiariaSem = `${(somaSem / noites).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} (média)`;
  } else if (diasAlta > 0) {
    txtDiariaCom = q.alta[0].toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    txtDiariaSem = q.alta[1].toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  } else {
    txtDiariaCom = q.baixa[0].toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    txtDiariaSem = q.baixa[1].toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const listaComodidades =
    q.comodidades && q.comodidades.length > 0
      ? q.comodidades.join(", ")
      : "Completa estrutura";

  let texto = `Olá! Segue orçamento para o *${festividade}*:\n\n`;
  texto += `🏨 *Hotel Plaza - Cruzeta/RN*\n`;
  texto += `🛌 *Acomodação:* ${q.nome}\n`;
  if (q.desc) texto += `✨ _${q.desc}_\n`;
  texto += `🛏️ *Configuração:* ${formatarCamas(q)}\n`;
  // Usar `q.grupo` explícito para indicar UH single-only (ex.: Single com cama de casal para 1 pessoa).
  const capacidadeExibida = q.grupo === "solteiro" ? 1 : q.cap;
  const capacidadeTexto =
    capacidadeExibida === 1
      ? `Apenas ${capacidadeExibida} pessoa`
      : `Até ${capacidadeExibida} pessoas`;
  texto += `👤 *Capacidade:* ${capacidadeTexto}\n`;
  texto += `✅ *Itens inclusos:* ${listaComodidades}.\n\n`;

  texto += `📅 *Período:* ${d1.toLocaleDateString("pt-BR")} a ${d2.toLocaleDateString("pt-BR")}\n`;
  texto += `🌙 *Duração:* ${noites} diária(s)\n\n`;

  texto += `💰 *Valor da diária:*\n`;
  texto += `☕ Com café: ${txtDiariaCom}\n`;
  texto += `🍽️ Sem café: ${txtDiariaSem}\n\n`;

  texto += `💵 *VALOR TOTAL DO PACOTE:*\n`;
  texto += `✅ *COM CAFÉ DA MANHÃ: ${totalComFmt}*\n`;
  texto += `❌ *SEM CAFÉ DA MANHÃ: ${totalSemFmt}*\n\n`;

  texto += `📥 *Check-in:* a partir das 14h\n`;
  texto += `📤 *Check-out:* até as 11h\n\n`;

  // Horários das refeições (configuráveis no painel)
  let horarios = {
    cafe: ["07:00", "09:00", true],
    almoco: ["11:00", "13:00", true],
    janta: ["18:00", "20:00", true],
  };
  try {
    const h = localStorage.getItem("plaza_horarios_refeicoes");
    if (h) horarios = JSON.parse(h);
  } catch (e) {}

  // Verifica visibilidade (índice 2 do array, padrão true se undefined)
  const showCafe = horarios.cafe[2] !== false;
  const showAlmoco = horarios.almoco[2] !== false;
  const showJanta = horarios.janta[2] !== false;

  if (showCafe || showAlmoco || showJanta) {
    texto += `⏰ *Horários das Refeições:*\n`;
    if (showCafe)
      texto += `*- Café da manhã:* ${horarios.cafe[0]} às ${horarios.cafe[1]}\n`;
    if (showAlmoco)
      texto += `*- Almoço:* ${horarios.almoco[0]} às ${horarios.almoco[1]} (opcional)\n`;
    if (showJanta)
      texto += `*- Lanche à Noite:* ${horarios.janta[0]} às ${horarios.janta[1]} (opcional)\n`;
    texto += `\n`;
  }

  texto += `⚠️ _Valores sujeitos a disponibilidade no ato da reserva._\n\n`;
  texto += `*Deseja garantir sua reserva agora?*`;

  document.getElementById("previa").innerText = texto;
}

function copiarTexto() {
  const texto = document.getElementById("previa").innerText;
  // Copia o texto para a área de transferência
  navigator.clipboard
    .writeText(texto)
    .then(() => {
      showMsg("Sucesso!", "Orçamento completo copiado!");
    })
    .catch(() => {
      showMsg("Erro", "Falha ao copiar o texto.", "erro");
    });
}

window.onload = carregarConfiguracoes;
