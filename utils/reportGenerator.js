// Utilitário para geração de relatórios de análise
const reportGenerator = {
  // Gera um relatório completo de análise
  gerarRelatorioCompleto: (projeto, analiseRepresentacao, analiseParametros) => {
    // Determinar conformidade geral
    let conformidade = 'Total';
    const observacoes = [];
    
    // Adicionar observações da análise de representação
    if (analiseRepresentacao && analiseRepresentacao.observacoes && analiseRepresentacao.observacoes.length > 0) {
      observacoes.push(...analiseRepresentacao.observacoes);
      conformidade = 'Parcial';
    }
    
    // Adicionar observações da análise de parâmetros
    if (analiseParametros && analiseParametros.observacoes && analiseParametros.observacoes.length > 0) {
      observacoes.push(...analiseParametros.observacoes);
      conformidade = 'Parcial';
    }
    
    // Se não houver observações, a conformidade é total
    if (observacoes.length === 0) {
      conformidade = 'Total';
    }
    
    // Gerar recomendações baseadas nas observações
    const recomendacoes = reportGenerator.gerarRecomendacoes(observacoes);
    
    // Montar o relatório completo
    return {
      id: projeto.id,
      nome: projeto.nome,
      data: new Date().toLocaleDateString('pt-BR'),
      status: 'Análise Concluída',
      conformidade,
      parametros: analiseParametros ? {
        recuoFrontal: analiseParametros.recuoFrontal,
        recuoLateral: analiseParametros.recuoLateral,
        taxaOcupacao: analiseParametros.taxaOcupacao,
        taxaPermeabilidade: analiseParametros.taxaPermeabilidade,
        coeficienteAproveitamento: analiseParametros.coeficienteAproveitamento
      } : {},
      representacaoGrafica: projeto.representacaoGrafica || {},
      observacoes,
      recomendacoes
    };
  },
  
  // Gera recomendações baseadas nas observações
  gerarRecomendacoes: (observacoes) => {
    const recomendacoes = [];
    
    observacoes.forEach(obs => {
      if (obs.includes('recuo frontal')) {
        recomendacoes.push('Ajustar o recuo frontal para atender o mínimo de 5,0m exigido pela legislação.');
      }
      
      if (obs.includes('recuo lateral')) {
        recomendacoes.push('Ajustar o recuo lateral para atender o mínimo de 1,5m exigido pela legislação.');
      }
      
      if (obs.includes('taxa de ocupação')) {
        recomendacoes.push('Reduzir a área construída para atender a taxa de ocupação máxima de 70% permitida.');
      }
      
      if (obs.includes('taxa de permeabilidade')) {
        recomendacoes.push('Aumentar a área permeável para atingir o mínimo de 20% da área do terreno.');
      }
      
      if (obs.includes('coeficiente de aproveitamento')) {
        recomendacoes.push('Reduzir a área construída total para atender o coeficiente de aproveitamento máximo de 1,5.');
      }
      
      if (obs.includes('planta de cobertura')) {
        recomendacoes.push('Adicionar planta de cobertura ao projeto.');
      }
      
      if (obs.includes('indicação do norte')) {
        recomendacoes.push('Incluir indicação do norte na implantação.');
      }
      
      if (obs.includes('cotas e níveis')) {
        recomendacoes.push('Adicionar cotas e níveis em todas as plantas do projeto.');
      }
      
      if (obs.includes('escalas')) {
        recomendacoes.push('Incluir escalas em todos os desenhos do projeto.');
      }
    });
    
    return recomendacoes;
  },
  
  // Exporta o relatório para PDF (simulação)
  exportarPDF: (relatorio) => {
    console.log('Exportando relatório para PDF:', relatorio.nome);
    return {
      success: true,
      message: 'Relatório exportado com sucesso!',
      filename: `relatorio_${relatorio.id}_${Date.now()}.pdf`
    };
  }
};

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = reportGenerator;
}
