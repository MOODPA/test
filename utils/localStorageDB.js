// Utilitário para armazenamento local de dados
const localStorageDB = {
  // Chaves para armazenamento
  KEYS: {
    PROJETOS: 'mood-pa-projetos',
    USUARIO: 'mood-pa-usuario',
    TEMA: 'mood-pa-theme'
  },
  
  // Inicializa o banco de dados local com dados de exemplo se necessário
  init: () => {
    // Verificar se já existem projetos
    const projetos = localStorageDB.getProjetos();
    
    // Se não existirem projetos, adicionar exemplos
    if (!projetos || projetos.length === 0) {
      const projetosExemplo = [
        {
          id: 1,
          nome: 'Residência Unifamiliar - Vila Santa Maria',
          data: '15/04/2025',
          status: 'Análise Concluída',
          conformidade: 'Parcial',
          tipo: 'residencial',
          areaTerreno: 250,
          areaConstruida: 150,
          parametros: {
            recuoFrontal: {
              valor: 3.5,
              minimo: 5.0,
              conforme: false
            },
            recuoLateral: {
              valor: 1.5,
              minimo: 1.5,
              conforme: true
            },
            taxaOcupacao: {
              valor: 65,
              maximo: 70,
              conforme: true
            },
            taxaPermeabilidade: {
              valor: 18,
              minimo: 20,
              conforme: false
            },
            coeficienteAproveitamento: {
              valor: 1.2,
              maximo: 1.5,
              conforme: true
            }
          },
          representacaoGrafica: {
            plantaBaixa: true,
            cortes: true,
            fachadas: true,
            implantacao: true,
            cobertura: false,
            cotasNiveis: true,
            escalas: true,
            norte: false
          },
          observacoes: [
            "O recuo frontal está abaixo do mínimo exigido pela legislação municipal.",
            "A taxa de permeabilidade está abaixo do mínimo exigido.",
            "Falta planta de cobertura conforme exigido nas normas de representação.",
            "Falta indicação do norte na implantação."
          ]
        },
        {
          id: 2,
          nome: 'Edifício Comercial - Centro',
          data: '10/04/2025',
          status: 'Análise Concluída',
          conformidade: 'Total',
          tipo: 'comercial',
          areaTerreno: 500,
          areaConstruida: 350,
          parametros: {
            recuoFrontal: {
              valor: 5.5,
              minimo: 5.0,
              conforme: true
            },
            recuoLateral: {
              valor: 2.0,
              minimo: 1.5,
              conforme: true
            },
            taxaOcupacao: {
              valor: 60,
              maximo: 70,
              conforme: true
            },
            taxaPermeabilidade: {
              valor: 25,
              minimo: 20,
              conforme: true
            },
            coeficienteAproveitamento: {
              valor: 1.4,
              maximo: 1.5,
              conforme: true
            }
          },
          representacaoGrafica: {
            plantaBaixa: true,
            cortes: true,
            fachadas: true,
            implantacao: true,
            cobertura: true,
            cotasNiveis: true,
            escalas: true,
            norte: true
          },
          observacoes: []
        },
        {
          id: 3,
          nome: 'Reforma Residencial - Bairro Graças',
          data: '05/04/2025',
          status: 'Em Análise',
          conformidade: 'Pendente',
          tipo: 'residencial',
          areaTerreno: 300,
          areaConstruida: 180
        }
      ];
      
      localStorageDB.setProjetos(projetosExemplo);
    }
    
    return true;
  },
  
  // Obtém todos os projetos
  getProjetos: () => {
    try {
      const projetos = localStorage.getItem(localStorageDB.KEYS.PROJETOS);
      return projetos ? JSON.parse(projetos) : [];
    } catch (error) {
      console.error('Erro ao obter projetos:', error);
      return [];
    }
  },
  
  // Define todos os projetos
  setProjetos: (projetos) => {
    try {
      localStorage.setItem(localStorageDB.KEYS.PROJETOS, JSON.stringify(projetos));
      return true;
    } catch (error) {
      console.error('Erro ao salvar projetos:', error);
      return false;
    }
  },
  
  // Obtém um projeto específico pelo ID
  getProjetoPorId: (id) => {
    try {
      const projetos = localStorageDB.getProjetos();
      return projetos.find(projeto => projeto.id === parseInt(id));
    } catch (error) {
      console.error('Erro ao obter projeto por ID:', error);
      return null;
    }
  },
  
  // Adiciona um novo projeto
  adicionarProjeto: (projeto) => {
    try {
      const projetos = localStorageDB.getProjetos();
      
      // Gerar novo ID
      const novoId = projetos.length > 0 
        ? Math.max(...projetos.map(p => p.id)) + 1 
        : 1;
      
      // Adicionar data atual e ID
      const novoProjeto = {
        ...projeto,
        id: novoId,
        data: new Date().toLocaleDateString('pt-BR'),
        status: 'Em Análise',
        conformidade: 'Pendente'
      };
      
      projetos.push(novoProjeto);
      localStorageDB.setProjetos(projetos);
      
      return novoProjeto;
    } catch (error) {
      console.error('Erro ao adicionar projeto:', error);
      return null;
    }
  },
  
  // Atualiza um projeto existente
  atualizarProjeto: (id, dadosAtualizados) => {
    try {
      const projetos = localStorageDB.getProjetos();
      const index = projetos.findIndex(projeto => projeto.id === parseInt(id));
      
      if (index !== -1) {
        projetos[index] = { ...projetos[index], ...dadosAtualizados };
        localStorageDB.setProjetos(projetos);
        return projetos[index];
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      return null;
    }
  },
  
  // Remove um projeto
  removerProjeto: (id) => {
    try {
      const projetos = localStorageDB.getProjetos();
      const novosProjetos = projetos.filter(projeto => projeto.id !== parseInt(id));
      
      if (novosProjetos.length !== projetos.length) {
        localStorageDB.setProjetos(novosProjetos);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao remover projeto:', error);
      return false;
    }
  },
  
  // Obtém informações do usuário
  getUsuario: () => {
    try {
      const usuario = localStorage.getItem(localStorageDB.KEYS.USUARIO);
      return usuario ? JSON.parse(usuario) : null;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }
  },
  
  // Define informações do usuário
  setUsuario: (usuario) => {
    try {
      localStorage.setItem(localStorageDB.KEYS.USUARIO, JSON.stringify(usuario));
      return true;
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      return false;
    }
  },
  
  // Remove informações do usuário (logout)
  removerUsuario: () => {
    try {
      localStorage.removeItem(localStorageDB.KEYS.USUARIO);
      return true;
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      return false;
    }
  }
};

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = localStorageDB;
}
