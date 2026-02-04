# 🏨 Sistema-HP: Gestão de Orçamentos e Tarifário

O **Sistema-HP** é uma suíte de ferramentas web desenvolvida para agilizar o setor de reservas do hotel. O sistema centraliza a configuração de tarifas, gera orçamentos rápidos para WhatsApp e cria propostas formais detalhadas para grupos e eventos.

## 🚀 Módulos e Funcionalidades

### ⚙️ Painel Master (Configurações)
*   **Gestão de Tarifário:** Cadastro completo de categorias de acomodação (Standard, Luxo, Suítes, etc.) com preços diferenciados para **Alta** e **Baixa** temporada.
*   **Controle de Comodidades:** Definição de itens inclusos (Wi-Fi, Ar-condicionado, etc.) por tipo de quarto.
*   **Horários de Refeições:** Configuração dos horários de Café, Almoço e Jantar exibidos nos orçamentos.
*   **Backup e Segurança:** Exportação/Importação das configurações via arquivo JSON e proteção de acesso via senha.

### ⚡ Orçamento Rápido (WhatsApp)
*   **Foco em Agilidade:** Selecione o quarto e as datas para gerar instantaneamente um texto formatado com emojis.
*   **Cálculo Automático:** Identifica automaticamente se o período cai em alta ou baixa temporada (ou misto).
*   **Pronto para Enviar:** Botão de cópia para colar diretamente no WhatsApp do cliente.

### 📄 Orçamento Oficial
*   **Propostas Detalhadas:** Ideal para bandas, empresas e grandes grupos. Permite adicionar múltiplos itens, quantidades e definir funções (ex: Staff, Produção).
*   **Cálculo de Alimentação:** Inclusão opcional de almoço/jantar no cálculo da diária.
*   **Persistência:** Salve e carregue orçamentos complexos através de arquivos JSON assinados digitalmente pelo sistema.
*   **Impressão:** Layout otimizado para gerar PDFs ou imprimir a proposta formal.

### 📋 Tabela de Opções
*   **Comparativo:** Gera uma lista com múltiplas opções de quartos selecionados para oferecer ao cliente.
*   **Filtros Inteligentes:** Separação visual entre opções para Solteiros e Casais/Famílias.

## �️ Tecnologias Utilizadas

*   **Frontend:** HTML5, CSS3 (Design Responsivo).
*   **Lógica:** JavaScript (Vanilla ES6+).
*   **Armazenamento:** `localStorage` para persistência de dados no navegador sem necessidade de banco de dados.
*   **Manipulação de Arquivos:** `File API` e `Blob` para geração e leitura de backups JSON.

## 📦 Como usar

O sistema é uma aplicação **client-side** pura (não requer servidor backend).

1.  Baixe o projeto.
2.  Abra o arquivo `index.html` (ou a página inicial correspondente) em seu navegador.
3.  Configure as tarifas no **Painel Master** antes de gerar os primeiros orçamentos.