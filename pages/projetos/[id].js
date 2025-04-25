import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useProjetos from '../../hooks/useProjetos';
import useReportExport from '../../hooks/useReportExport';

export default function RelatorioPage() {
  const [projeto, setProjeto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [exportando, setExportando] = useState(false);
  
  const router = useRouter();
  const { id } = router.query;
  const projetosHook = useProjetos();
  const reportExport = useReportExport();
  
  // Carregar projeto quando o ID estiver disponível
  useEffect(() => {
    if (id) {
      carregarProjeto(id);
    }
  }, [id]);
  
  // Carregar projeto e análise
  const carregarProjeto = async (projetoId) => {
    try {
      setLoading(true);
      const result = await projetosHook.getProjetoPorId(projetoId);
      
      if (result.success) {
        setProjeto(result.projeto);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar projeto. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };
  
  // Exportar relatório para PDF
  const handleExportarPDF = async () => {
    try {
      setExportando(true);
      setMessage({ type: '', text: '' });
      
      // Em uma implementação real, isso chamaria uma API para gerar o PDF
      const result = await reportExport.exportarPDF(projeto);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Relatório exportado com sucesso!' });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      setMessage({ type: 'error', text: 'Erro ao exportar relatório. Tente novamente.' });
    } finally {
      setExportando(false);
    }
  };
  
  // Formatar data
  const formatarData = (data) => {
    if (!data) return '';
    
    if (data instanceof Date) {
      return data.toLocaleDateString('pt-BR');
    }
    
    if (data.seconds) {
      return new Date(data.seconds * 1000).toLocaleDateString('pt-BR');
    }
    
    return data;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Carregando relatório...</p>
        </div>
      </div>
    );
  }
  
  if (!projeto) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Projeto não encontrado</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            O projeto solicitado não existe ou você não tem permissão para acessá-lo.
          </p>
          <div className="mt-6">
            <a
              href="/projetos"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Voltar para Projetos
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Cabeçalho */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white" id="projeto-nome">
                {projeto.nome}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {projeto.tipo.charAt(0).toUpperCase() + projeto.tipo.slice(1)} • {projeto.areaTerreno}m² de terreno • {projeto.areaConstruida}m² de área construída
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleExportarPDF}
                disabled={exportando}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${exportando ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {exportando ? 'Exportando...' : 'Exportar PDF'}
              </button>
            </div>
          </div>
          
          {message.text && (
            <div className={`mb-6 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'}`}>
              {message.text}
            </div>
          )}
          
          {/* Resumo da análise */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resumo da Análise</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Data da Análise</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white" id="data-analise">
                  {projeto.analise ? formatarData(projeto.analise.data) : 'Pendente'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white" id="status-analise">
                  {projeto.status}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Conformidade</p>
                <p 
                  className={`text-lg font-medium ${
                    projeto.conformidade === 'Total' 
                      ? 'text-green-600 dark:text-green-400' 
                      : projeto.conformidade === 'Parcial' 
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-gray-600 dark:text-gray-400'
                  }`} 
                  id="conformidade-analise"
                >
                  {projeto.conformidade}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Não Conformidades</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white" id="num-nao-conformidades">
                  {projeto.analise && projeto.analise.observacoes ? projeto.analise.observacoes.length : 0}
                </p>
              </div>
            </div>
          </div>
          
          {/* Parâmetros Urbanísticos */}
          {projeto.analise && projeto.analise.parametros && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Parâmetros Urbanísticos</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Parâmetro
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Valor do Projeto
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Exigência
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                        Conformidade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    <tr id="recuo-frontal">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        Recuo Frontal
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 valor-projeto">
                        {projeto.analise.parametros.recuoFrontal.valor}m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 exigencia">
                        Mínimo {projeto.analise.parametros.recuoFrontal.minimo}m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm conforme">
                        {projeto.analise.parametros.recuoFrontal.conforme ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Conforme
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Não Conforme
                          </span>
                        )}
                      </td>
                    </tr>
                    
                    <tr id="recuo-lateral">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        Recuo Lateral
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 valor-projeto">
                        {projeto.analise.parametros.recuoLateral.valor}m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 exigencia">
                        Mínimo {projeto.analise.parametros.recuoLateral.minimo}m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm conforme">
                        {projeto.analise.parametros.recuoLateral.conforme ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Conforme
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Não Conforme
                          </span>
                        )}
                      </td>
                    </tr>
                    
                    <tr id="taxa-ocupacao">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        Taxa de Ocupação
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 valor-projeto">
                        {projeto.analise.parametros.taxaOcupacao.valor}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 exigencia">
                        Máximo {projeto.analise.parametros.taxaOcupacao.maximo}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm conforme">
                        {projeto.analise.parametros.taxaOcupacao.conforme ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Conforme
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Não Conforme
                          </span>
                        )}
                      </td>
                    </tr>
                    
                    <tr id="taxa-permeabilidade">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        Taxa de Permeabilidade
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 valor-projeto">
                        {projeto.analise.parametros.taxaPermeabilidade.valor}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 exigencia">
                        Mínimo {projeto.analise.parametros.taxaPermeabilidade.minimo}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm conforme">
                        {projeto.analise.parametros.taxaPermeabilidade.conforme ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Conforme
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Não Conforme
                          </span>
                        )}
                      </td>
                    </tr>
                    
                    <tr id="coeficiente-aproveitamento">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        Coeficiente de Aproveitamento
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 valor-projeto">
                        {projeto.analise.parametros.coeficienteAproveitamento.valor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 exigencia">
                        Máximo {projeto.analise.parametros.coeficienteAproveitamento.maximo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm conforme">
                        {projeto.analise.parametros.coeficienteAproveitamento.conforme ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Conforme
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Não Conforme
                          </span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Representação Gráfica */}
          {projeto.analise && projeto.analise.representacaoGrafica && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Representação Gráfica</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-700" id="planta-baixa">
                  <div className="flex items-center">
                    <div className={`status-icon h-5 w-5 mr-2 rounded-full flex items-center justify-center ${projeto.analise.representacaoGrafica.plantaBaixa ? 'bg-green-500' : 'bg-red-500'}`}>
                      {projeto.analise.representacaoGrafica.plantaBaixa ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Planta Baixa</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-700" id="cortes">
                  <div className="flex items-center">
                    <div className={`status-icon h-5 w-5 mr-2 rounded-full flex items-center justify-center ${projeto.analise.representacaoGrafica.cortes ? 'bg-green-500' : 'bg-red-500'}`}>
                      {projeto.analise.representacaoGrafica.cortes ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Cortes</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-700" id="fachadas">
                  <div className="flex items-center">
                    <div className={`status-icon h-5 w-5 mr-2 rounded-full flex items-center justify-center ${projeto.analise.representacaoGrafica.fachadas ? 'bg-green-500' : 'bg-red-500'}`}>
                      {projeto.analise.representacaoGrafica.fachadas ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Fachadas</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-700" id="implantacao">
                  <div className="flex items-center">
                    <div className={`status-icon h-5 w-5 mr-2 rounded-full flex items-center justify-center ${projeto.analise.representacaoGrafica.implantacao ? 'bg-green-500' : 'bg-red-500'}`}>
                      {projeto.analise.representacaoGrafica.implantacao ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Implantação</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-700" id="cobertura">
                  <div className="flex items-center">
                    <div className={`status-icon h-5 w-5 mr-2 rounded-full flex items-center justify-center ${projeto.analise.representacaoGrafica.cobertura ? 'bg-green-500' : 'bg-red-500'}`}>
                      {projeto.analise.representacaoGrafica.cobertura ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Planta de Cobertura</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-700" id="cotas-niveis">
                  <div className="flex items-center">
                    <div className={`status-icon h-5 w-5 mr-2 rounded-full flex items-center justify-center ${projeto.analise.representacaoGrafica.cotasNiveis ? 'bg-green-500' : 'bg-red-500'}`}>
                      {projeto.analise.representacaoGrafica.cotasNiveis ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Cotas e Níveis</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-700" id="escalas">
                  <div className="flex items-center">
                    <div className={`status-icon h-5 w-5 mr-2 rounded-full flex items-center justify-center ${projeto.analise.representacaoGrafica.escalas ? 'bg-green-500' : 'bg-red-500'}`}>
                      {projeto.analise.representacaoGrafica.escalas ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Escalas</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-700" id="norte">
                  <div className="flex items-center">
                    <div className={`status-icon h-5 w-5 mr-2 rounded-full flex items-center justify-center ${projeto.analise.representacaoGrafica.norte ? 'bg-green-500' : 'bg-red-500'}`}>
                      {projeto.analise.representacaoGrafica.norte ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Indicação do Norte</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Observações */}
          {projeto.analise && projeto.analise.observacoes && projeto.analise.observacoes.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Observações</h2>
              
              <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300" id="observacoes-list">
                {projeto.analise.observacoes.map((obs, index) => (
                  <li key={index}>{obs}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Arquivos do Projeto */}
          {projeto.arquivosUrls && projeto.arquivosUrls.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Arquivos do Projeto</h2>
              
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {projeto.arquivosUrls.map((url, index) => {
                  const fileName = url.split('/').pop();
                  return (
                    <li key={index} className="py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{fileName}</span>
                      </div>
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                      >
                        Visualizar
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          
          {/* Botões de Ação */}
          <div className="flex justify-between mt-8">
            <a
              href="/projetos"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Voltar para Projetos
            </a>
            
            <button
              onClick={handleExportarPDF}
              disabled={exportando}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${exportando ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {exportando ? 'Exportando...' : 'Exportar PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
