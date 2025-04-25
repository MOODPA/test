// Utilitário para cálculo de parâmetros urbanísticos
const calculoParametrosUrbanisticos = {
  // Verifica o recuo frontal
  verificarRecuoFrontal: (valor, minimo = 5.0) => {
    return {
      valor,
      minimo,
      conforme: valor >= minimo
    };
  },
  
  // Verifica o recuo lateral
  verificarRecuoLateral: (valor, minimo = 1.5) => {
    return {
      valor,
      minimo,
      conforme: valor >= minimo
    };
  },
  
  // Verifica a taxa de ocupação
  verificarTaxaOcupacao: (valor, maximo = 70) => {
    return {
      valor,
      maximo,
      conforme: valor <= maximo
    };
  },
  
  // Verifica a taxa de permeabilidade
  verificarTaxaPermeabilidade: (valor, minimo = 20) => {
    return {
      valor,
      minimo,
      conforme: valor >= minimo
    };
  },
  
  // Verifica o coeficiente de aproveitamento
  verificarCoeficienteAproveitamento: (valor, maximo = 1.5) => {
    return {
      valor,
      maximo,
      conforme: valor <= maximo
    };
  },
  
  // Gera um relatório completo da análise de parâmetros urbanísticos
  gerarRelatorio: (parametros) => {
    const recuoFrontal = calculoParametrosUrbanisticos.verificarRecuoFrontal(
      parametros.recuoFrontal.valor,
      parametros.recuoFrontal.minimo
    );
    
    const recuoLateral = calculoParametrosUrbanisticos.verificarRecuoLateral(
      parametros.recuoLateral.valor,
      parametros.recuoLateral.minimo
    );
    
    const taxaOcupacao = calculoParametrosUrbanisticos.verificarTaxaOcupacao(
      parametros.taxaOcupacao.valor,
      parametros.taxaOcupacao.maximo
    );
    
    const taxaPermeabilidade = calculoParametrosUrbanisticos.verificarTaxaPermeabilidade(
      parametros.taxaPermeabilidade.valor,
      parametros.taxaPermeabilidade.minimo
    );
    
    const coeficienteAproveitamento = calculoParametrosUrbanisticos.verificarCoeficienteAproveitamento(
      parametros.coeficienteAproveitamento.valor,
      parametros.coeficienteAproveitamento.maximo
    );
    
    const observacoes = [];
    
    if (!recuoFrontal.conforme) {
      observacoes.push(`O recuo frontal está abaixo do mínimo exigido pela legislação municipal.`);
    }
    
    if (!recuoLateral.conforme) {
      observacoes.push(`O recuo lateral está abaixo do mínimo exigido pela legislação municipal.`);
    }
    
    if (!taxaOcupacao.conforme) {
      observacoes.push(`A taxa de ocupação está acima do máximo permitido pela legislação municipal.`);
    }
    
    if (!taxaPermeabilidade.conforme) {
      observacoes.push(`A taxa de permeabilidade está abaixo do mínimo exigido.`);
    }
    
    if (!coeficienteAproveitamento.conforme) {
      observacoes.push(`O coeficiente de aproveitamento está acima do máximo permitido pela legislação municipal.`);
    }
    
    return {
      recuoFrontal,
      recuoLateral,
      taxaOcupacao,
      taxaPermeabilidade,
      coeficienteAproveitamento,
      conforme: recuoFrontal.conforme && recuoLateral.conforme && taxaOcupacao.conforme && 
                taxaPermeabilidade.conforme && coeficienteAproveitamento.conforme,
      observacoes
    };
  }
};

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = calculoParametrosUrbanisticos;
}
