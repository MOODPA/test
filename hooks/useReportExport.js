import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Hook para exportação de relatórios
export default function useReportExport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const storage = getStorage();
  
  // Exportar relatório para PDF
  const exportarPDF = async (projeto) => {
    try {
      setLoading(true);
      setError(null);
      
      // Criar um novo documento PDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Adicionar cabeçalho
      doc.setFontSize(18);
      doc.setTextColor(0, 51, 153);
      doc.text('MOOD.PA - Relatório de Análise', 105, 20, { align: 'center' });
      
      // Adicionar informações do projeto
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`Projeto: ${projeto.nome}`, 20, 35);
      
      doc.setFontSize(10);
      doc.text(`Tipo: ${projeto.tipo.charAt(0).toUpperCase() + projeto.tipo.slice(1)}`, 20, 45);
      doc.text(`Área do Terreno: ${projeto.areaTerreno}m²`, 20, 50);
      doc.text(`Área Construída: ${projeto.areaConstruida}m²`, 20, 55);
      doc.text(`Data da Análise: ${formatarData(projeto.analise?.data)}`, 20, 60);
      
      // Adicionar status e conformidade
      doc.setFontSize(12);
      doc.text(`Status: ${projeto.status}`, 20, 70);
      doc.text(`Conformidade: ${projeto.conformidade}`, 20, 75);
      
      // Adicionar parâmetros urbanísticos
      if (projeto.analise && projeto.analise.parametros) {
        doc.setFontSize(14);
        doc.setTextColor(0, 51, 153);
        doc.text('Parâmetros Urbanísticos', 20, 90);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        const params = projeto.analise.parametros;
        
        // Recuo Frontal
        doc.text(`Recuo Frontal: ${params.recuoFrontal.valor}m`, 20, 100);
        doc.text(`Mínimo Exigido: ${params.recuoFrontal.minimo}m`, 80, 100);
        doc.text(`Conformidade: ${params.recuoFrontal.conforme ? 'Conforme' : 'Não Conforme'}`, 140, 100);
        
        // Recuo Lateral
        doc.text(`Recuo Lateral: ${params.recuoLateral.valor}m`, 20, 105);
        doc.text(`Mínimo Exigido: ${params.recuoLateral.minimo}m`, 80, 105);
        doc.text(`Conformidade: ${params.recuoLateral.conforme ? 'Conforme' : 'Não Conforme'}`, 140, 105);
        
        // Taxa de Ocupação
        doc.text(`Taxa de Ocupação: ${params.taxaOcupacao.valor}%`, 20, 110);
        doc.text(`Máximo Permitido: ${params.taxaOcupacao.maximo}%`, 80, 110);
        doc.text(`Conformidade: ${params.taxaOcupacao.conforme ? 'Conforme' : 'Não Conforme'}`, 140, 110);
        
        // Taxa de Permeabilidade
        doc.text(`Taxa de Permeabilidade: ${params.taxaPermeabilidade.valor}%`, 20, 115);
        doc.text(`Mínimo Exigido: ${params.taxaPermeabilidade.minimo}%`, 80, 115);
        doc.text(`Conformidade: ${params.taxaPermeabilidade.conforme ? 'Conforme' : 'Não Conforme'}`, 140, 115);
        
        // Coeficiente de Aproveitamento
        doc.text(`Coef. Aproveitamento: ${params.coeficienteAproveitamento.valor}`, 20, 120);
        doc.text(`Máximo Permitido: ${params.coeficienteAproveitamento.maximo}`, 80, 120);
        doc.text(`Conformidade: ${params.coeficienteAproveitamento.conforme ? 'Conforme' : 'Não Conforme'}`, 140, 120);
      }
      
      // Adicionar representação gráfica
      if (projeto.analise && projeto.analise.representacaoGrafica) {
        doc.setFontSize(14);
        doc.setTextColor(0, 51, 153);
        doc.text('Representação Gráfica', 20, 135);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        const rep = projeto.analise.representacaoGrafica;
        
        // Elementos obrigatórios
        doc.text('Elementos Obrigatórios:', 20, 145);
        doc.text(`Planta Baixa: ${rep.plantaBaixa ? 'Presente' : 'Ausente'}`, 40, 150);
        doc.text(`Cortes: ${rep.cortes ? 'Presente' : 'Ausente'}`, 40, 155);
        doc.text(`Fachadas: ${rep.fachadas ? 'Presente' : 'Ausente'}`, 40, 160);
        doc.text(`Implantação: ${rep.implantacao ? 'Presente' : 'Ausente'}`, 40, 165);
        
        // Elementos complementares
        doc.text('Elementos Complementares:', 110, 145);
        doc.text(`Planta de Cobertura: ${rep.cobertura ? 'Presente' : 'Ausente'}`, 130, 150);
        doc.text(`Cotas e Níveis: ${rep.cotasNiveis ? 'Presente' : 'Ausente'}`, 130, 155);
        doc.text(`Escalas: ${rep.escalas ? 'Presente' : 'Ausente'}`, 130, 160);
        doc.text(`Indicação do Norte: ${rep.norte ? 'Presente' : 'Ausente'}`, 130, 165);
      }
      
      // Adicionar observações
      if (projeto.analise && projeto.analise.observacoes && projeto.analise.observacoes.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0, 51, 153);
        doc.text('Observações', 20, 180);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        projeto.analise.observacoes.forEach((obs, index) => {
          doc.text(`${index + 1}. ${obs}`, 20, 190 + (index * 5));
          
          // Se a página estiver ficando cheia, adicionar nova página
          if (190 + (index * 5) > 270) {
            doc.addPage();
            doc.setFontSize(14);
            doc.setTextColor(0, 51, 153);
            doc.text('Observações (continuação)', 20, 20);
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
          }
        });
      }
      
      // Adicionar rodapé
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`MOOD.PA - Analisador Técnico de Projetos Arquitetônicos | Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
        doc.text(`Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 105, 295, { align: 'center' });
      }
      
      // Adicionar marca d'água
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(60);
        doc.setTextColor(230, 230, 230);
        doc.text('MOOD.PA', 105, 150, { align: 'center', angle: 45 });
      }
      
      // Salvar o PDF
      const pdfBlob = doc.output('blob');
      
      // Fazer upload do PDF para o Firebase Storage
      const storageRef = ref(storage, `relatorios/${projeto.id}_${Date.now()}.pdf`);
      await uploadBytes(storageRef, pdfBlob);
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(storageRef);
      
      // Abrir o PDF em uma nova aba
      window.open(downloadURL, '_blank');
      
      return { 
        success: true, 
        message: 'Relatório exportado com sucesso!',
        url: downloadURL
      };
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      setError('Erro ao exportar relatório. Tente novamente.');
      return { success: false, message: 'Erro ao exportar relatório. Tente novamente.' };
    } finally {
      setLoading(false);
    }
  };
  
  // Exportar relatório para Excel
  const exportarExcel = async (projeto) => {
    try {
      setLoading(true);
      setError(null);
      
      // Em uma implementação real, isso usaria uma biblioteca como SheetJS
      // para criar um arquivo Excel com os dados do projeto
      
      // Simulação de exportação para Excel
      const excelData = {
        nome: projeto.nome,
        tipo: projeto.tipo,
        areaTerreno: projeto.areaTerreno,
        areaConstruida: projeto.areaConstruida,
        status: projeto.status,
        conformidade: projeto.conformidade,
        parametros: projeto.analise?.parametros,
        representacaoGrafica: projeto.analise?.representacaoGrafica,
        observacoes: projeto.analise?.observacoes
      };
      
      // Converter para JSON
      const jsonString = JSON.stringify(excelData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Fazer upload do arquivo para o Firebase Storage
      const storageRef = ref(storage, `relatorios/${projeto.id}_${Date.now()}.json`);
      await uploadBytes(storageRef, blob);
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(storageRef);
      
      // Criar link de download
      const a = document.createElement('a');
      a.href = downloadURL;
      a.download = `relatorio_${projeto.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      return { 
        success: true, 
        message: 'Dados exportados com sucesso!',
        url: downloadURL
      };
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      setError('Erro ao exportar dados. Tente novamente.');
      return { success: false, message: 'Erro ao exportar dados. Tente novamente.' };
    } finally {
      setLoading(false);
    }
  };
  
  // Gerar relatório comparativo
  const gerarRelatorioComparativo = async (projetos) => {
    try {
      setLoading(true);
      setError(null);
      
      // Criar um novo documento PDF
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Adicionar cabeçalho
      doc.setFontSize(18);
      doc.setTextColor(0, 51, 153);
      doc.text('MOOD.PA - Relatório Comparativo', 150, 20, { align: 'center' });
      
      // Adicionar informações dos projetos
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Comparação de Projetos', 20, 35);
      
      // Tabela de comparação
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      // Cabeçalho da tabela
      doc.setFillColor(240, 240, 240);
      doc.rect(20, 45, 250, 10, 'F');
      doc.text('Nome do Projeto', 25, 51);
      doc.text('Área Terreno', 100, 51);
      doc.text('Área Construída', 130, 51);
      doc.text('Taxa Ocupação', 165, 51);
      doc.text('Permeabilidade', 200, 51);
      doc.text('Conformidade', 235, 51);
      
      // Linhas da tabela
      projetos.forEach((projeto, index) => {
        const y = 55 + (index * 10);
        
        // Alternar cores das linhas
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(20, y, 250, 10, 'F');
        }
        
        doc.text(projeto.nome.substring(0, 30), 25, y + 6);
        doc.text(`${projeto.areaTerreno}m²`, 100, y + 6);
        doc.text(`${projeto.areaConstruida}m²`, 130, y + 6);
        
        const taxaOcupacao = projeto.analise?.parametros?.taxaOcupacao?.valor || 
                            Math.round((projeto.areaConstruida / projeto.areaTerreno) * 100);
        doc.text(`${taxaOcupacao}%`, 165, y + 6);
        
        const permeabilidade = projeto.analise?.parametros?.taxaPermeabilidade?.valor || 'N/A';
        doc.text(`${permeabilidade}${permeabilidade !== 'N/A' ? '%' : ''}`, 200, y + 6);
        
        doc.text(projeto.conformidade || 'Pendente', 235, y + 6);
      });
      
      // Adicionar gráfico (simulação)
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 153);
      doc.text('Análise Comparativa', 150, 120, { align: 'center' });
      
      // Desenhar eixos do gráfico
      doc.setDrawColor(0, 0, 0);
      doc.line(50, 200, 250, 200); // Eixo X
      doc.line(50, 200, 50, 130); // Eixo Y
      
      // Legendas dos eixos
      doc.setFontSize(8);
      doc.text('Projetos', 150, 210);
      doc.text('Taxa de Ocupação (%)', 40, 165, { angle: 90 });
      
      // Barras do gráfico (simulação)
      const barWidth = 200 / (projetos.length * 2);
      
      projetos.forEach((projeto, index) => {
        const taxaOcupacao = projeto.analise?.parametros?.taxaOcupacao?.valor || 
                            Math.round((projeto.areaConstruida / projeto.areaTerreno) * 100);
        
        const barHeight = taxaOcupacao * 0.7; // Escala para o gráfico
        const x = 50 + (index * barWidth * 2) + barWidth;
        const y = 200 - barHeight;
        
        // Desenhar barra
        doc.setFillColor(0, 102, 204);
        doc.rect(x, y, barWidth, barHeight, 'F');
        
        // Adicionar valor
        doc.setFontSize(8);
        doc.text(`${taxaOcupacao}%`, x + (barWidth / 2), y - 5, { align: 'center' });
        
        // Adicionar nome do projeto abreviado
        const nomeAbreviado = projeto.nome.substring(0, 10) + (projeto.nome.length > 10 ? '...' : '');
        doc.text(nomeAbreviado, x + (barWidth / 2), 205, { align: 'center' });
      });
      
      // Adicionar rodapé
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`MOOD.PA - Analisador Técnico de Projetos Arquitetônicos | Relatório gerado em ${new Date().toLocaleDateString('pt-BR')}`, 150, 290, { align: 'center' });
      
      // Salvar o PDF
      const pdfBlob = doc.output('blob');
      
      // Fazer upload do PDF para o Firebase Storage
      const storageRef = ref(storage, `relatorios/comparativo_${Date.now()}.pdf`);
      await uploadBytes(storageRef, pdfBlob);
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(storageRef);
      
      // Abrir o PDF em uma nova aba
      window.open(downloadURL, '_blank');
      
      return { 
        success: true, 
        message: 'Relatório comparativo gerado com sucesso!',
        url: downloadURL
      };
    } catch (error) {
      console.error('Erro ao gerar relatório comparativo:', error);
      setError('Erro ao gerar relatório comparativo. Tente novamente.');
      return { success: false, message: 'Erro ao gerar relatório comparativo. Tente novamente.' };
    } finally {
      setLoading(false);
    }
  };
  
  // Gerar relatório estatístico
  const gerarRelatorioEstatistico = async (projetos) => {
    try {
      setLoading(true);
      setError(null);
      
      // Calcular estatísticas
      const totalProjetos = projetos.length;
      const projetosConformes = projetos.filter(p => p.conformidade === 'Total').length;
      const projetosParciais = projetos.filter(p => p.conformidade === 'Parcial').length;
      const projetosPendentes = projetos.filter(p => p.conformidade === 'Pendente').length;
      
      const taxaConformidade = (projetosConformes / totalProjetos) * 100;
      const taxaParcial = (projetosParciais / totalProjetos) * 100;
      const taxaPendente = (projetosPendentes / totalProjetos) * 100;
      
      // Calcular médias
      const areasTerrenoTotal = projetos.reduce((sum, p) => sum + p.areaTerreno, 0);
      const areasConstruidasTotal = projetos.reduce((sum, p) => sum + p.areaConstruida, 0);
      
      const mediaTerrenoArea = areasTerrenoTotal / totalProjetos;
      const mediaConstruidaArea = areasConstruidasTotal / totalProjetos;
      const mediaTaxaOcupacao = (mediaConstruidaArea / mediaTerrenoArea) * 100;
      
      // Criar um novo documento PDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Adicionar cabeçalho
      doc.setFontSize(18);
      doc.setTextColor(0, 51, 153);
      doc.text('MOOD.PA - Relatório Estatístico', 105, 20, { align: 'center' });
      
      // Adicionar informações gerais
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Estatísticas Gerais', 20, 35);
      
      doc.setFontSize(10);
      doc.text(`Total de Projetos Analisados: ${totalProjetos}`, 20, 45);
      doc.text(`Projetos em Conformidade Total: ${projetosConformes} (${taxaConformidade.toFixed(1)}%)`, 20, 50);
      doc.text(`Projetos em Conformidade Parcial: ${projetosParciais} (${taxaParcial.toFixed(1)}%)`, 20, 55);
      doc.text(`Projetos Pendentes: ${projetosPendentes} (${taxaPendente.toFixed(1)}%)`, 20, 60);
      
      // Adicionar médias
      doc.setFontSize(14);
      doc.text('Médias', 20, 75);
      
      doc.setFontSize(10);
      doc.text(`Área Média de Terreno: ${mediaTerrenoArea.toFixed(2)}m²`, 20, 85);
      doc.text(`Área Média Construída: ${mediaConstruidaArea.toFixed(2)}m²`, 20, 90);
      doc.text(`Taxa Média de Ocupação: ${mediaTaxaOcupacao.toFixed(2)}%`, 20, 95);
      
      // Adicionar gráfico de pizza (simulação)
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 153);
      doc.text('Distribuição de Conformidade', 105, 115, { align: 'center' });
      
      // Desenhar círculo para o gráfico de pizza
      const centerX = 105;
      const centerY = 150;
      const radius = 40;
      
      // Fatia 1: Conformidade Total (verde)
      const angle1 = (taxaConformidade / 100) * 2 * Math.PI;
      doc.setFillColor(0, 153, 51); // Verde
      doc.circle(centerX, centerY, radius, 'F');
      
      // Fatia 2: Conformidade Parcial (amarelo)
      if (taxaParcial > 0) {
        doc.setFillColor(255, 204, 0); // Amarelo
        doc.ellipse(centerX, centerY, radius, radius, {
          start: angle1,
          end: angle1 + ((taxaParcial / 100) * 2 * Math.PI)
        }, 'F');
      }
      
      // Fatia 3: Pendentes (cinza)
      if (taxaPendente > 0) {
        doc.setFillColor(204, 204, 204); // Cinza
        doc.ellipse(centerX, centerY, radius, radius, {
          start: angle1 + ((taxaParcial / 100) * 2 * Math.PI),
          end: 2 * Math.PI
        }, 'F');
      }
      
      // Legenda
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      // Legenda: Conformidade Total
      doc.setFillColor(0, 153, 51);
      doc.rect(20, 200, 10, 10, 'F');
      doc.text(`Conformidade Total (${taxaConformidade.toFixed(1)}%)`, 35, 207);
      
      // Legenda: Conformidade Parcial
      doc.setFillColor(255, 204, 0);
      doc.rect(20, 215, 10, 10, 'F');
      doc.text(`Conformidade Parcial (${taxaParcial.toFixed(1)}%)`, 35, 222);
      
      // Legenda: Pendentes
      doc.setFillColor(204, 204, 204);
      doc.rect(20, 230, 10, 10, 'F');
      doc.text(`Pendentes (${taxaPendente.toFixed(1)}%)`, 35, 237);
      
      // Adicionar rodapé
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`MOOD.PA - Analisador Técnico de Projetos Arquitetônicos | Relatório gerado em ${new Date().toLocaleDateString('pt-BR')}`, 105, 290, { align: 'center' });
      
      // Salvar o PDF
      const pdfBlob = doc.output('blob');
      
      // Fazer upload do PDF para o Firebase Storage
      const storageRef = ref(storage, `relatorios/estatistico_${Date.now()}.pdf`);
      await uploadBytes(storageRef, pdfBlob);
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(storageRef);
      
      // Abrir o PDF em uma nova aba
      window.open(downloadURL, '_blank');
      
      return { 
        success: true, 
        message: 'Relatório estatístico gerado com sucesso!',
        url: downloadURL
      };
    } catch (error) {
      console.error('Erro ao gerar relatório estatístico:', error);
      setError('Erro ao gerar relatório estatístico. Tente novamente.');
      return { success: false, message: 'Erro ao gerar relatório estatístico. Tente novamente.' };
    } finally {
      setLoading(false);
    }
  };
  
  // Função auxiliar para formatar data
  const formatarData = (data) => {
    if (!data) return new Date().toLocaleDateString('pt-BR');
    
    if (data instanceof Date) {
      return data.toLocaleDateString('pt-BR');
    }
    
    if (data.seconds) {
      return new Date(data.seconds * 1000).toLocaleDateString('pt-BR');
    }
    
    return data;
  };
  
  return {
    loading,
    error,
    exportarPDF,
    exportarExcel,
    gerarRelatorioComparativo,
    gerarRelatorioEstatistico
  };
}
