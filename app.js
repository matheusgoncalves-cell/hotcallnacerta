// Matriz de Scripts Finais (Fase 3: A Passagem)
const scriptsPassagem = {
  mqlStandard: (lead) => `"Cara, perfeito. Gerenciar ${lead.tecnicos} técnicos na rua usando apenas ${lead.processoTexto} é um ralo de dinheiro em termos de retrabalho. 
A Field Control foi feita exatamente para matar esse papel e centralizar tudo. Para não perdermos tempo, eu acabei de acionar nosso Consultor de Produtividade aqui no painel e ele está disponível neste exato momento para abrir a tela com você e te mostrar a prática. 
Estou puxando ele para a linha agora mesmo. Segura só um segundo!"`,

  mqlEnterprise: (lead) => `"Entendi perfeitamente. Operações do tamanho da ${lead.empresa} lidando com ${lead.processoTexto} precisam de controle de SLAs rigoroso.
Diante do tamanho da sua operação, eu notifiquei o nosso Executivo de Grandes Contas no chat interno neste exato segundo. Ele acabou de me dar o 'OK' e está online agora para iniciarmos o seu desenho de diagnóstico imediatamente. Vou fazer a nossa ponte de conexão na sala agora mesmo, combinado?"`,

  potencial: (lead) => `"Perfeito. Olha, para entender se conseguimos te ajudar a gargalar menos a operação que hoje roda via ${lead.processoTexto}, vamos resolver isso agora.
Vou te conectar em tempo real com um dos nossos especialistas de plantão para uma validação relâmpago de 5 minutos, direto ao ponto. Ele já está me esperando liberar o acesso. Vou te transferir agora, ok?"`,

  reprovado: (lead) => `"Perfeito, ${lead.nome}. Analisando o modelo atual da ${lead.empresa}, percebi que nosso foco estrito em equipes de rua não vai te entregar o valor máximo agora. Para não tomarmos o seu tempo na linha, estou te mandando neste exato momento no WhatsApp um link com o nosso Kit de Gestão gratuito. Ele vai te ajudar a estruturar essa fase! Obrigado pela atenção!"`
};

document.getElementById('formFieldControl').addEventListener('submit', function(event) {
  event.preventDefault();

  const inputTecnicos = parseInt(document.getElementById('tecnicos').value);
  const inputSegmento = document.getElementById('segmento').value;
  const inputProcesso = document.getElementById('processo').value;
  
  const lead = {
    nome: document.getElementById('nome').value,
    empresa: document.getElementById('empresa').value,
    tecnicos: inputTecnicos,
    processoTexto: document.getElementById('processo').options[document.getElementById('processo').selectedIndex].text.split(',')[0].trim() // Pega a parte principal do processo
  };

  // Lógica de Score (Igual a anterior)
  let score = 0;
  let isEnterpriseTrigger = false;

  if (inputTecnicos >= 3 && inputTecnicos <= 50) score += 40; 
  else if (inputTecnicos > 50) { score += 45; isEnterpriseTrigger = true; } 
  else if (inputTecnicos > 0 && inputTecnicos < 3) score += 10; 

  if (inputSegmento === 'top') score += 35; 
  else if (inputSegmento === 'field_service' || inputSegmento === 'enterprise') {
    score += 25;
    if (inputSegmento === 'enterprise') isEnterpriseTrigger = true;
  } else score += 5; 

  if (inputProcesso === 'manual') score += 25; 
  else if (inputProcesso === 'sistema_antigo') score += 15; 

  // Definição do Caminho
  let status = "";
  let classeCSS = "";
  let scriptFase3 = "";

  if (isEnterpriseTrigger && score >= 50) {
    status = "🏢 MQL ENTERPRISE (Transferência Imediata)";
    classeCSS = "sucesso";
    scriptFase3 = scriptsPassagem.mqlEnterprise(lead);
  } else if (score >= 65) {
    status = "🔥 MQL FIELD SERVICE (Passagem Quente Agora)";
    classeCSS = "sucesso";
    scriptFase3 = scriptsPassagem.mqlStandard(lead);
  } else if (score >= 40) {
    status = "⏳ LEAD POTENCIAL (Conexão Rápida)";
    classeCSS = "alerta";
    scriptFase3 = scriptsPassagem.potencial(lead);
  } else {
    status = "🌱 FORA DO PERFIL (Drop Rápido)";
    classeCSS = "perigo";
    scriptFase3 = scriptsPassagem.reprovado(lead);
  }

  // GERAÇÃO DA FASE 2: Validação (Micro-Sim) - Funciona para todos os cenários
  const scriptFase2 = `"Perfeito, ${lead.nome}. Só para garantir que eu entendi 100% do seu cenário e não te tomar tempo à toa: hoje a ${lead.empresa} tem ${lead.tecnicos} técnicos na rua, e o maior gargalo de vocês é tentar organizar toda essa operação usando ${lead.processoTexto}. É exatamente esse o cenário de vocês hoje, correto?"`;

  // Renderiza a interface das Fases 2 e 3
  const divResultado = document.getElementById('resultado');
  divResultado.className = `fase ${classeCSS}`;
  divResultado.style.display = "block";
  
  divResultado.innerHTML = `
    <div class="fase-titulo"><span>2</span> Validação (O "Micro-Sim")</div>
    <div class="dica-sdr">🗣️ Leia o texto abaixo e espere o cliente dizer "Sim".</div>
    <div class="script-box">
        ${scriptFase2}
    </div>

    <hr style="border:0; border-top:1px solid #e2e8f0; margin: 25px 0;">

    <div class="fase-titulo"><span>3</span> Passagem Quente & Ação</div>
    <div class="status-badge">${status} (Score: ${score})</div>
    <div class="dica-sdr">🗣️ Assim que ele confirmar, leia o fechamento abaixo e transfira a ligação.</div>
    
    <textarea readonly id="textoPassagem">${scriptFase3}</textarea>
    
    <div style="margin-top: 15px; display: flex; gap: 10px;">
        <button class="btn-copy" onclick="copiarTexto()">📋 Copiar Pitch para o Chat Interno</button>
    </div>
  `;

  // Rola a tela para baixo suavemente para o SDR ver o script
  divResultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Função auxiliar para o botão de copiar
function copiarTexto() {
    const texto = document.getElementById("textoPassagem").value;
    navigator.clipboard.writeText(texto);
    alert("Script copiado! Mande no grupo da equipe e transfira a call.");
}