// Script principal para integração das funcionalidades
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar banco de dados local
  if (typeof localStorageDB !== 'undefined') {
    localStorageDB.init();
  }
  
  // Inicializar autenticação
  if (typeof useAuth !== 'undefined') {
    useAuth.init();
  }
  
  // Verificar tema salvo
  const savedTheme = localStorage.getItem('mood-pa-theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    }
  }
  
  // Inicializar ano atual no rodapé
  const yearElements = document.querySelectorAll('#current-year, #footer-year');
  yearElements.forEach(el => {
    if (el) el.textContent = new Date().getFullYear();
  });
  
  // Inicializar página específica
  const currentPage = window.location.pathname;
  
  if (currentPage.includes('projetos.html')) {
    initProjetosPage();
  } else if (currentPage.includes('relatorio.html')) {
    initRelatorioPage();
  } else if (currentPage.includes('login.html')) {
    initLoginPage();
  }
});

// Alternar tema
function toggleTheme() {
  const isDarkMode = document.documentElement.classList.contains('dark');
  if (isDarkMode) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('mood-pa-theme', 'light');
    document.getElementById('theme-toggle').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('mood-pa-theme', 'dark');
    document.getElementById('theme-toggle').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  }
}

// Alternar menu mobile
function toggleMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenu.classList.toggle('hidden');
}

// Inicializar página de projetos
function initProjetosPage() {
  if (typeof localStorageDB === 'undefined') {
    console.error('localStorageDB não está definido');
    return;
  }
  
  // Carregar projetos
  const projetos = localStorageDB.getProjetos();
  renderProjects(projetos);
  
  // Atualizar contador
  const contadorElement = document.getElementById('contador-projetos');
  if (contadorElement) {
    contadorElement.textContent = projetos.length;
  }
}

// Renderizar projetos
function renderProjects(projetos) {
  const tbody = document.getElementById('projetos-tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  if (projetos.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Nenhum projeto encontrado com os critérios de busca.
      </td>
    `;
    tbody.appendChild(tr);
    return;
  }
  
  projetos.forEach(projeto => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors';
    
    tr.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900 dark:text-white">${projeto.nome}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-500 dark:text-gray-300">${projeto.data}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${projeto.status === 'Análise Concluída' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}">
          ${projeto.status}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${projeto.conformidade === 'Total' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
            projeto.conformidade === 'Parcial' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'}">
          ${projeto.conformidade}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <a href="relatorio.html?id=${projeto.id}" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
          Ver Relatório
        </a>
        <button onclick="excluirProjeto(${projeto.id})" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
          Excluir
        </button>
      </td>
    `;
    
    tbody.appendChild(tr);
  });
}

// Filtrar projetos
function filtrarProjetos(e) {
  if (e) e.preventDefault();
  
  const termoBusca = document.getElementById('termo-busca').value.toLowerCase();
  const projetos = localStorageDB.getProjetos();
  
  const resultados = projetos.filter(projeto => 
    projeto.nome.toLowerCase().includes(termoBusca)
  );
  
  renderProjects(resultados);
  
  // Atualizar contador
  const contadorElement = document.getElementById('contador-projetos');
  if (contadorElement) {
    contadorElement.textContent = resultados.length;
  }
}

// Resetar filtros
function resetarFiltros() {
  document.getElementById('termo-busca').value = '';
  const projetos = localStorageDB.getProjetos();
  renderProjects(projetos);
  
  // Atualizar contador
  const contadorElement = document.getElementById('contador-projetos');
  if (contadorElement) {
    contadorElement.textContent = projetos.length;
  }
}

// Alternar formulário
function toggleFormulario() {
  const formulario = document.getElementById('novo-projeto-form');
  formulario.classList.toggle('hidden');
}

// Enviar projeto
function enviarProjeto(e) {
  if (e) e.preventDefault();
  
  // Obter dados do formulário
  const nome = document.querySelector('#novo-projeto-form input[placeholder*="Residência"]').value;
  const tipo = document.querySelector('#novo-projeto-form select').value;
  const areaTerreno = document.querySelector('#novo-projeto-form input[placeholder*="250"]').value;
  const areaConstruida = document.querySelector('#novo-projeto-form input[placeholder*="150"]').value;
  
  // Validar dados
  if (!nome || !tipo || !areaTerreno || !areaConstruida) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }
  
  // Criar novo projeto
  const novoProjeto = {
    nome,
    tipo,
    areaTerreno: parseFloat(areaTerreno),
    areaConstruida: parseFloat(areaConstruida)
  };
  
  // Adicionar ao banco de dados
  const projetoAdicionado = localStorageDB.adicionarProjeto(novoProjeto);
  
  if (projetoAdicionado) {
    alert('Projeto adicionado com sucesso!');
    toggleFormulario();
    initProjetosPage();
  } else {
    alert('Erro ao adicionar projeto. Por favor, tente novamente.');
  }
}

// Excluir projeto
function excluirProjeto(id) {
  if (confirm('Tem certeza que deseja excluir este projeto?')) {
    const sucesso = localStorageDB.removerProjeto(id);
    
    if (sucesso) {
      alert('Projeto excluído com sucesso!');
      initProjetosPage();
    } else {
      alert('Erro ao excluir projeto. Por favor, tente novamente.');
    }
  }
}

// Inicializar página de relatório
function initRelatorioPage() {
  // Obter ID do projeto da URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  
  if (!id) {
    alert('ID do projeto não especificado.');
    window.location.href = 'projetos.html';
    return;
  }
  
  // Obter projeto do banco de dados
  const projeto = localStorageDB.getProjetoPorId(id);
  
  if (!projeto) {
    alert('Projeto não encontrado.');
    window.location.href = 'projetos.html';
    return;
  }
  
  // Atualizar título do projeto
  const tituloElement = document.getElementById('projeto-nome');
  if (tituloElement) {
    tituloElement.textContent = projeto.nome;
  }
  
  // Atualizar dados do resumo
  const dataElement = document.getElementById('data-analise');
  if (dataElement) {
    dataElement.textContent = projeto.data;
  }
  
  const statusElement = document.getElementById('status-analise');
  if (statusElement) {
    statusElement.textContent = projeto.status;
  }
  
  const conformidadeElement = document.getElementById('conformidade-analise');
  if (conformidadeElement) {
    conformidadeElement.textContent = projeto.conformidade;
    
    if (projeto.conformidade === 'Total') {
      conformidadeElement.className = 'text-lg font-medium text-green-600 dark:text-green-400';
    } else if (projeto.conformidade === 'Parcial') {
      conformidadeElement.className = 'text-lg font-medium text-yellow-600 dark:text-yellow-400';
    } else {
      conformidadeElement.className = 'text-lg font-medium text-red-600 dark:text-red-400';
    }
  }
  
  const numNaoConformidadesElement = document.getElementById('num-nao-conformidades');
  if (numNaoConformidadesElement && projeto.observacoes) {
    numNaoConformidadesElement.textContent = projeto.observacoes.length;
  }
  
  // Atualizar parâmetros urbanísticos
  if (projeto.parametros) {
    updateParameterRow('recuo-frontal', projeto.parametros.recuoFrontal);
    updateParameterRow('recuo-lateral', projeto.parametros.recuoLateral);
    updateParameterRow('taxa-ocupacao', projeto.parametros.taxaOcupacao);
    updateParameterRow('taxa-permeabilidade', projeto.parametros.taxaPermeabilidade);
    updateParameterRow('coeficiente-aproveitamento', projeto.parametros.coeficienteAproveitamento);
  }
  
  // Atualizar representação gráfica
  if (projeto.representacaoGrafica) {
    updateGraphicElement('planta-baixa', projeto.representacaoGrafica.plantaBaixa);
    updateGraphicElement('cortes', projeto.representacaoGrafica.cortes);
    updateGraphicElement('fachadas', projeto.representacaoGrafica.fachadas);
    updateGraphicElement('implantacao', projeto.representacaoGrafica.implantacao);
    updateGraphicElement('cobertura', projeto.representacaoGrafica.cobertura);
    updateGraphicElement('cotas-niveis', projeto.representacaoGrafica.cotasNiveis);
    updateGraphicElement('escalas', projeto.representacaoGrafica.escalas);
    updateGraphicElement('norte', projeto.representacaoGrafica.norte);
  }
  
  // Atualizar observações
  const observacoesListElement = document.getElementById('observacoes-list');
  if (observacoesListElement && projeto.observacoes) {
    observacoesListElement.innerHTML = '';
    
    projeto.observacoes.forEach(obs => {
      const li = document.createElement('li');
      li.textContent = obs;
      observacoesListElement.appendChild(li);
    });
  }
}

// Atualizar linha de parâmetro
function updateParameterRow(id, parameter) {
  if (!parameter) return;
  
  const row = document.getElementById(id);
  if (!row) return;
  
  // Valor do projeto
  const valorElement = row.querySelector('.valor-projeto');
  if (valorElement) {
    valorElement.textContent = parameter.valor + (id.includes('taxa') ? '%' : '');
  }
  
  // Exigência
  const exigenciaElement = row.querySelector('.exigencia');
  if (exigenciaElement) {
    if (parameter.minimo) {
      exigenciaElement.textContent = `Mínimo ${parameter.minimo}` + (id.includes('taxa') ? '%' : '');
    } else if (parameter.maximo) {
      exigenciaElement.textContent = `Máximo ${parameter.maximo}` + (id.includes('taxa') ? '%' : '');
    }
  }
  
  // Conformidade
  const conformeElement = row.querySelector('.conforme');
  if (conformeElement) {
    if (parameter.conforme) {
      conformeElement.innerHTML = `
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          Conforme
        </span>
      `;
    } else {
      conformeElement.innerHTML = `
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          Não Conforme
        </span>
      `;
    }
  }
}

// Atualizar elemento de representação gráfica
function updateGraphicElement(id, isPresent) {
  if (isPresent === undefined) return;
  
  const element = document.getElementById(id);
  if (!element) return;
  
  const iconElement = element.querySelector('.status-icon');
  if (!iconElement) return;
  
  if (isPresent) {
    iconElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    `;
    iconElement.className = 'status-icon h-5 w-5 mr-2 rounded-full flex items-center justify-center bg-green-500';
  } else {
    iconElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    `;
    iconElement.className = 'status-icon h-5 w-5 mr-2 rounded-full flex items-center justify-center bg-red-500';
  }
}

// Exportar relatório
function exportarRelatorio() {
  alert('Funcionalidade em implementação. A exportação de relatórios estará disponível em breve!');
}

// Inicializar página de login
function initLoginPage() {
  // Verificar se já está logado
  if (useAuth && useAuth.isAutenticado()) {
    const usuario = useAuth.getUsuarioAtual();
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('usuario-logado').classList.remove('hidden');
    document.getElementById('nome-usuario').textContent = usuario.nome;
  }
}

// Realizar login
function realizarLogin(e) {
  if (e) e.preventDefault();
  
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  
  if (!email || !senha) {
    alert('Por favor, preencha todos os campos.');
    return;
  }
  
  const usuario = useAuth.login(email, senha);
  
  if (usuario) {
    alert('Login realizado com sucesso!');
    window.location.href = 'projetos.html';
  } else {
    alert('Email ou senha incorretos. Por favor, tente novamente.');
  }
}

// Realizar logout
function realizarLogout() {
  useAuth.logout();
  alert('Logout realizado com sucesso!');
  window.location.href = 'index.html';
}
