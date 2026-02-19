# 🏨 Sistema-HP: Gestão de Orçamentos e Tarifário

O **Sistema-HP** é uma suíte de ferramentas web desenvolvida para agilizar o setor de reservas do hotel. O sistema centraliza a configuração de tarifas, gera orçamentos rápidos para WhatsApp, cria propostas formais detalhadas para grupos e calcula custos de recarga elétrica (Wallbox).

## 🚀 Módulos e Funcionalidades

### ⚙️ Configurações Gerais

- **Gestão de Tarifário:** Cadastro completo de categorias de acomodação (Standard, Luxo, Suítes, etc.) com preços diferenciados para **Alta** e **Baixa** temporada.
- **Motor de Promoções:** Configuração de descontos automáticos (porcentagem) baseados no número mínimo de diárias, com regras de aplicação (apenas alta, mensagem na baixa, etc.).
- **Parâmetros Globais:** Definição de horários de refeições (Café, Almoço, Jantar), valor do almoço extra e **custo do kWh**.
- **Backup e Segurança:** Exportação/Importação das configurações via arquivo JSON e proteção de acesso ao painel via senha.

### ⚡ Orçamento Rápido (WhatsApp)

- **Foco em Agilidade:** Selecione o quarto e as datas para gerar instantaneamente um texto formatado com emojis.
- **Cálculo Inteligente:** Identifica automaticamente alta/baixa temporada (ou períodos mistos) calculando a média exata.
- **Aplicação de Promoções:** Verifica automaticamente se o período elegível ativa o desconto promocional configurado.
- **Pronto para Enviar:** Botão de cópia para colar diretamente no WhatsApp do cliente.

### 📄 Orçamento Oficial

- **Propostas Detalhadas:** Ideal para bandas, empresas e grandes grupos. Permite adicionar múltiplos itens, quantidades e definir funções (ex: Staff, Produção).
- **Cálculo de Alimentação:** Inclusão opcional de almoço/jantar no cálculo da diária.
- **Persistência:** Salve e carregue orçamentos complexos através de arquivos JSON assinados e validados pelo sistema.
- **Impressão:** Layout otimizado para gerar PDFs ou imprimir a proposta formal.

### 📋 Tabela de Opções

- **Comparativo:** Gera uma lista com múltiplas opções de quartos selecionados para oferecer ao cliente.
- **Filtros Inteligentes:** Separação visual entre opções para Solteiros e Casais/Famílias.
- **Previsão Completa:** Exibe valores totais com e sem café, além de aplicar regras de promoção quando elegível.

### 📊 Tabela de Preços

- **Visualização Clara:** Gera tabelas de preços formatadas para impressão ou envio em PDF.
- **Separação por Temporada:** Alterna facilmente entre visualização de Alta e Baixa temporada.
- **Agrupamento Inteligente:** Agrupa automaticamente UHs similares (mesmo preço e capacidade) para simplificar a leitura.

### 🔌 Calculadora Wallbox

- **Controle de Energia:** Ferramenta para cálculo de custo de recarga de veículos elétricos.
- **Tarifa Integrada:** Utiliza o valor do kWh configurado no Painel Master para fornecer o valor exato a ser cobrado do hóspede.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3 (Design Responsivo).
- **Lógica:** JavaScript (Vanilla ES6+).
- **Armazenamento:** `localStorage` para persistência de dados no navegador sem necessidade de banco de dados.
- **Manipulação de Arquivos:** `File API` e `Blob` para geração e leitura de backups JSON.

## 📦 Como usar

O sistema é uma aplicação **client-side** pura (não requer servidor backend).

1.  Baixe o projeto.
2.  Abra o arquivo `index.html` (ou a página inicial correspondente) em seu navegador.
3.  Acesse o **Painel Master** para configurar tarifas, promoções e valor do kWh.
4.  Utilize os módulos conforme a necessidade de atendimento.
