// Utilitário para análise de representação gráfica
const analiseRepresentacaoGrafica = {
  // Verifica se os elementos obrigatórios estão presentes
  verificarElementosObrigatorios: (elementos) => {
    const elementosObrigatorios = ['plantaBaixa', 'cortes', 'fachadas', 'implantacao'];
    const elementosFaltantes = [];
    
    elementosObrigatorios.forEach(elemento => {
      if (!elementos[elemento]) {
        elementosFaltantes.push(elemento);
      }
    });
    
    return {
      conforme: elementosFaltantes.length === 0,
      elementosFaltantes
    };
  },
  
  // Verifica se os elementos complementares estão presentes
  verificarElementosComplementares: (elementos) => {
    const elementosComplementares = ['cobertura', 'cotasNiveis', 'escalas', 'norte'];
    const elementosFaltantes = [];
    
    elementosComplementares.forEach(elemento => {
      if (!elementos[elemento]) {
        elementosFaltantes.push(elemento);
      }
    });
    
    return {
      conforme: elementosFaltantes.length === 0,
      elementosFaltantes
    };
  },
  
  // Gera um relatório completo da análise de representação gráfica
  gerarRelatorio: (elementos) => {
    const obrigatorios = analiseRepresentacaoGrafica.verificarElementosObrigatorios(elementos);
    const complementares = analiseRepresentacaoGrafica.verificarElementosComplementares(elementos);
    
    const observacoes = [];
    
    if (!obrigatorios.conforme) {
      obrigatorios.elementosFaltantes.forEach(elemento => {
        let nomeElemento = '';
        
        switch(elemento) {
          case 'plantaBaixa':
            nomeElemento = 'planta baixa';
            break;
          case 'cortes':
            nomeElemento = 'cortes';
            break;
          case 'fachadas':
            nomeElemento = 'fachadas';
            break;
          case 'implantacao':
            nomeElemento = 'implantação';
            break;
        }
        
        observacoes.push(`Falta ${nomeElemento} conforme exigido nas normas de representação.`);
      });
    }
    
    if (!complementares.conforme) {
      complementares.elementosFaltantes.forEach(elemento => {
        let nomeElemento = '';
        
        switch(elemento) {
          case 'cobertura':
            nomeElemento = 'planta de cobertura';
            break;
          case 'cotasNiveis':
            nomeElemento = 'cotas e níveis';
            break;
          case 'escalas':
            nomeElemento = 'escalas';
            break;
          case 'norte':
            nomeElemento = 'indicação do norte';
            break;
        }
        
        observacoes.push(`Falta ${nomeElemento} conforme exigido nas normas de representação.`);
      });
    }
    
    return {
      conforme: obrigatorios.conforme && complementares.conforme,
      conformidadeObrigatorios: obrigatorios.conforme,
      conformidadeComplementares: complementares.conforme,
      observacoes
    };
  }
};

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = analiseRepresentacaoGrafica;
}
