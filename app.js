// Constantes de Elementos da Interface
const inputs = document.querySelectorAll('.input-tracking');
const progressText = document.getElementById('progresso-texto');
const progressBar = document.getElementById('progresso-barra');
const historySection = document.getElementById('history-section');
const historyList = document.getElementById('history-list');
const historyCount = document.getElementById('history-count');
const divResultado = document.getElementById('resultado');
const divInstrucoes = document.getElementById('instrucoes-iniciais');

// Matriz de Scripts Finais (Fase 3: A Passagem Imediata)
const scriptsPassagem = {
  mqlStandard: (lead) => `"Cara, perfeito. Gerenciar ${lead.tecnicos} técnicos na rua usando apenas ${lead.sistemaTexto} é um ralo de dinheiro em termos de retrabalho. 
A Field Control foi feita exatamente para matar esse papel e centralizar tudo. Para não perdermos tempo, eu acabei de acionar nosso Consultor de Produtividade aqui no painel e ele está disponível neste exato momento para abrir a tela com você e te mostrar a prática. 
Estou puxando ele para a linha agora mesmo. Segura só um segundo!"`,

  mqlEnterprise: (lead) => `"Entendi perfeitamente. Operações do tamanho da ${lead.empresa} lidando com ${lead.sistemaTexto} precisam de controle de SLAs rigoroso.
Diante do tamanho da sua operação, eu notifiquei o nosso Executivo de Grandes Contas no chat interno neste exato segundo. Ele acabou de me dar o 'OK' e está online agora para iniciarmos o seu desenho de diagnóstico imediatamente. Vou fazer a nossa ponte de conexão na sala agora mesmo, combinado?"`,

  potencial: (lead) => `"Perfeito. Olha, para entender se conseguimos te ajudar a gargalar menos a operação que hoje roda via ${lead.sistemaTexto}, vamos resolver isso agora.
Vou te conectar em tempo real com um dos nossos especialistas de plantão para uma validação relâmpago de 5 minutos, direto ao ponto. Ele já está me esperando liberar o acesso. Vou te transferir agora, ok?"`,

  reprovado: (lead) => `"Perfeito, ${lead.nome}. Analisando o modelo atual da ${lead.empresa}, percebi que nosso foco estrito em equipes de rua não vai te entregar o valor máximo agora. Para não tomarmos o seu tempo na linha, estou te mandando neste exato momento no WhatsApp um link com o nosso Kit de Gestão gratuito. Ele vai te ajudar a estruturar essa fase! Obrigado pela atenção!"`
};

// 1. Monitoramento e Controle do Checklist
function updateProgress() {
    let completed = 0;
    const total = inputs.length;

    inputs.forEach(input => {
        const parentDiv = input.closest('.group');
        const statusIndicator = parentDiv.querySelector('.status-check');
        
        if (input.value.trim() !== "") {
            completed++;
            statusIndicator.textContent = "🟢";
            parentDiv.classList.add('border-emerald-500/30');
            parentDiv.classList.remove('border-slate-700');
        } else {
            statusIndicator.textContent = "⚪";
            parentDiv.classList.remove('border-emerald-500/30');
            parentDiv.classList.add('border-slate-700');
        }
    });

    const percentage = (completed / total) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${completed}/${total} Concluídos`;
}

inputs.forEach(input => {
    input.addEventListener('input', updateProgress);
});

// 2. Processamento do Formulário (Qualificar + Salvar)
document.getElementById('lead-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const inputTecnicos = parseInt(document.getElementById('tecnicos').value);
    const inputSegmento = document.getElementById('segmento').value;
    const inputSistema = document.getElementById('sistema').value;
    
    const lead = {
        nome: document.getElementById('lead').value,
        empresa: document.getElementById('empresa').value,
        tecnicos: inputTecnicos,
        sistemaTexto: document.getElementById('sistema').options[document.getElementById('sistema').selectedIndex].text
    };

    // Lógica do Motor de Pontuação Field Control
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

    if (inputSistema === 'manual') score += 25; 
    else if (inputSistema === 'sistema_antigo') score += 15; 

    // Destinação do Lead
    let status = "";
    let badgeClass = "";
    let scriptFase3 = "";

    if (isEnterpriseTrigger && score >= 50) {
        status = "🏢 MQL ENTERPRISE (Transferência Imediata)";
        badgeClass = "bg-blue-950 text-blue-300 border border-blue-500/30";
        scriptFase3 = scriptsPassagem.mqlEnterprise(lead);
    } else if (score >= 65) {
        status = "🔥 MQL FIELD SERVICE (Passagem Quente Agora)";
        badgeClass = "bg-emerald-950 text-emerald-300 border border-emerald-500/30";
        scriptFase3 = scriptsPassagem.mqlStandard(lead);
    } else if (score >= 40) {
        status = "⏳ LEAD POTENCIAL (Conexão Rápida)";
        badgeClass = "bg-amber-950 text-amber-300 border border-amber-500/30";
        scriptFase3 = scriptsPassagem.potencial(lead);
    } else {
        status = "🌱 FORA DO PERFIL (Drop Rápido)";
        badgeClass = "bg-rose-950 text-rose-300 border border-rose-500/30";
        scriptFase3 = scriptsPassagem.reprovado(lead);
    }

    const scriptFase2 = `"Perfeito, ${lead.nome}. Só para garantir que eu entendi 100% do seu cenário e não te tomar tempo à toa: hoje a ${lead.empresa} conta com uma operação de ${lead.tecnicos} técnicos na rua, e o maior gargalo de vocês é tentar organizar essa rotina usando ${lead.sistemaTexto}. É exatamente esse o cenário de vocês hoje, correto?"`;

    // Renderiza a interface do Playbook na direita
    divInstrucoes.classList.add('hidden');
    divResultado.classList.remove('hidden');
    divResultado.innerHTML = `
        <div class="bg-slate-850 p-4 rounded-lg border border-slate-700">
            <div class="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Diagnóstico Comercial</div>
            <h2 class="text-xl font-bold text-indigo-400">${lead.empresa}</h2>
            <div class="mt-2 ${badgeClass} text-xs px-2.5 py-1 rounded-md inline-block font-bold">${status} | Score: ${score} pts</div>
        </div>

        <div class="bg-slate-850 p-4 rounded-lg border border-slate-700 space-y-2">
            <div class="flex items-center gap-2 text-sm font-bold text-slate-300">
                <span class="bg-indigo-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">2</span>
                Fase de Validação (O "Micro-Sim")
            </div>
            <p class="text-xs text-amber-400 italic">🗣️ Leia este trecho na linha e aguarde a confirmação do cliente:</p>
            <div class="bg-slate-900 p-3 rounded border border-indigo-500/30 text-sm leading-relaxed text-slate-200">
                ${scriptFase2}
            </div>
        </div>

        <div class="bg-slate-850 p-4 rounded-lg border border-slate-700 space-y-2">
            <div class="flex items-center gap-2 text-sm font-bold text-slate-300">
                <span class="bg-indigo-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">3</span>
                Passagem Quente Imediata
            </div>
            <p class="text-xs text-amber-400 italic">🗣️ Emendando a confirmação, execute este pitch imediato sem dar brechas:</p>
            <textarea readonly id="textoPassagem" class="w-full h-32 bg-slate-900 border border-slate-600 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500">${scriptFase3}</textarea>
            <button onclick="copyPitch()" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded text-xs transition-all">
                📋 Copiar Script de Transferência
            </button>
        </div>
    `;

    // --- SALVAR NO LOCALSTORAGE ---
    const leadData = {};
    inputs.forEach(input => {
        leadData[input.id] = input.value.trim();
    });
    leadData.score = score;
    leadData.status = status;
    leadData.timestamp = new Date().toLocaleString('pt-BR');

    let history = JSON.parse(localStorage.getItem('pocket_leads_history')) || [];
    history.unshift(leadData);
    localStorage.setItem('pocket_leads_history', JSON.stringify(history));

    loadHistory();
});

// 3. Gerenciamento de Cópia e Histórico Local
function copyFormattedText(event) {
    const getVal = (id, fallback = "Não informado") => document.getElementById(id).value.trim() || fallback;
    
    const formatted = `📋 *DADOS DE CADASTRO - NOVO LEAD*
────────────────────────
📍 Lead (Nome): ${getVal('lead')}
🏢 Empresa: ${getVal('empresa')}
💼 Segmento: ${getVal('segmento')}
👷 Técnicos: ${getVal('tecnicos')}
🌐 Sistema Atual: ${getVal('sistema')}
📌 Internos: ${getVal('internos')}
📄 Contratos: ${getVal('contratos')}
📎 O.S. por dia: ${getVal('os')}
⚠️ Ponto de Dor: ${getVal('dor')}
📞 Telefone: ${getVal('telefone')}
✉️ Email: ${getVal('email')}
📌 Agendamento: ${getVal('agendamento')}
📝 Informações Extras: ${getVal('extras')}
────────────────────────`;

    navigator.clipboard.writeText(formatted).then(() => {
        const targetBtn = event.target;
        const originalText = targetBtn.innerHTML;
        targetBtn.innerHTML = "✅ Copiado!";
        setTimeout(() => { targetBtn.innerHTML = originalText; }, 1500);
    });
}

function copyPitch() {
    const txt = document.getElementById('textoPassagem').value;
    navigator.clipboard.writeText(txt).then(() => { alert("Script de Hot Call copiado com sucesso!"); });
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('pocket_leads_history')) || [];
    historyCount.textContent = history.length;
    
    if (history.length === 0) {
        historyList.innerHTML = `<p class="text-[11px] text-slate-500 text-center py-2">Nenhum lead no histórico.</p>`;
        return;
    }

    historyList.innerHTML = history.map((lead, index) => `
        <div class="bg-slate-900 p-2 rounded text-xs flex justify-between items-center border border-slate-700 hover:border-indigo-500 transition-all">
            <div class="truncate mr-2 cursor-pointer" onclick="loadLeadIntoForm(${index})" title="Reabrir Lead">
                <span class="font-bold text-indigo-300 block truncate">${lead.lead || "Sem Nome"} (${lead.empresa || "Sem Empresa"})</span>
                <span class="text-[10px] text-slate-400 block">${lead.status.split(' ')[0]} | ${lead.score} pts | ${lead.timestamp}</span>
            </div>
            <button onclick="deleteLead(${index})" class="text-red-400 hover:text-red-300 font-bold px-1">✕</button>
        </div>
    `).join('');
}

function loadLeadIntoForm(index) {
    const history = JSON.parse(localStorage.getItem('pocket_leads_history')) || [];
    const lead = history[index];
    if (lead) {
        inputs.forEach(input => {
            input.value = lead[input.id] || "";
        });
        updateProgress();
        alert(`Lead "${lead.lead}" carregado na tela! Clique em "Qualificar" para reanalisar os scripts.`);
    }
}

function deleteLead(index) {
    let history = JSON.parse(localStorage.getItem('pocket_leads_history')) || [];
    history.splice(index, 1);
    localStorage.setItem('pocket_leads_history', JSON.stringify(history));
    loadHistory();
}

function clearAllHistory() {
    if (confirm("Deseja apagar TODO o histórico salvo?")) {
        localStorage.removeItem('pocket_leads_history');
        loadHistory();
    }
}

function clearForm() {
    if (confirm("Limpar os campos atuais? (Não afeta o histórico)")) {
        document.getElementById('lead-form').reset();
        divResultado.classList.add('hidden');
        divInstrucoes.classList.remove('hidden');
        updateProgress();
    }
}

function toggleHistory() {
    historySection.classList.toggle('hidden');
}

// Inicializadores
document.addEventListener("DOMContentLoaded", () => {
    updateProgress();
    loadHistory();
});