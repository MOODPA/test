import Head from 'next/head';
import Header from '../components/header';
import Footer from '../components/footer';
import { useState } from 'react';

export default function Relatorio() {
  const [relatorioCarregado, setRelatorioCarregado] = useState(true);
  
  // Dados de exemplo para o relatório
  const relatorioExemplo = {
    id: 1,
    nome: 'Residência Unifamiliar - Vila Santa Maria',
    data: '15/04/2025',
    status: 'Análise Concluída',
    conformidade: 'Parcial',
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
  };

  // Função para exportar relatório
  const exportarRelatorio = () => {
    alert('Funcionalidade em implementação. A exportação de relatórios estará disponível em breve!');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Relatório de Análise - MOOD.PA</title>
        <meta name="description" content="Relatório detalhado de análise de projeto no MOOD.PA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header currentPage="projetos" />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Relatório de Análise</h1>
                  <p className="text-lg opacity-90">
                    {relatorioExemplo.nome}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                  <button 
                    onClick={exportarRelatorio}
                    className="px-4 py-2 bg-white text-blue-700 rounded-md font-medium hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Exportar PDF
                  </button>
                  <a 
                    href="/projetos"
                    className="px-4 py-2 bg-blue-700 text-white rounded-md font-medium hover:bg-blue-600 transition-colors border border-white/30 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Voltar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Report Content */}
        <section className="py-8 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {relatorioCarregado ? (
                <>
                  {/* Summary Card */}
                  <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Resumo da Análise</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-300">Data da Análise</p>
                        <p className="text-lg font-medium text-gray-800 dark:text-white">{relatorioExemplo.data}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-300">Status</p>
                        <p className="text-lg font-medium text-gray-800 dark:text-white">{relatorioExemplo.status}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-300">Conformidade</p>
                        <p className={`text-lg font-medium ${
                          relatorioExemplo.conformidade === 'Total' ? 'text-green-600 dark:text-green-400' : 
                          relatorioExemplo.conformidade === 'Parcial' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {relatorioExemplo.conformidade}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Atenção</h3>
                          <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                            <p>
                              Este projeto apresenta {relatorioExemplo.observacoes.length} não conformidades que precisam ser corrigidas antes da submissão formal.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Parameters Analysis */}
                  <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Análise de Parâmetros Urbanísticos</h2>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Parâmetro
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Valor do Projeto
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Exigência
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Conformidade
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              Recuo Frontal
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {relatorioExemplo.parametros.recuoFrontal.valor} m
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              Mínimo {relatorioExemplo.parametros.recuoFrontal.minimo} m
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {relatorioExemplo.parametros.recuoFrontal.conforme ? (
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
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              Recuo Lateral
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {relatorioExemplo.parametros.recuoLateral.valor} m
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              Mínimo {relatorioExemplo.parametros.recuoLateral.minimo} m
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {relatorioExemplo.parametros.recuoLateral.conforme ? (
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
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              Taxa de Ocupação
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {relatorioExemplo.parametros.taxaOcupacao.valor}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              Máximo {relatorioExemplo.parametros.taxaOcupacao.maximo}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {relatorioExemplo.parametros.taxaOcupacao.conforme ? (
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
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              Taxa de Permeabilidade
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {relatorioExemplo.parametros.taxaPermeabilidade.valor}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              Mínimo {relatorioExemplo.parametros.taxaPermeabilidade.minimo}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {relatorioExemplo.parametros.taxaPermeabilidade.conforme ? (
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
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              Coeficiente de Aproveitamento
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {relatorioExemplo.parametros.coeficienteAproveitamento.valor}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              Máximo {relatorioExemplo.parametros.coeficienteAproveitamento.maximo}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {relatorioExemplo.parametros.coeficienteAproveitamento.conforme ? (
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
                  
                  {/* Graphic Representation Analysis */}
                  <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Análise de Representação Gráfica</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Elementos Obrigatórios</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <span className={`h-5 w-5 mr-2 rounded-full flex items-center justify-center ${relatorioExemplo.representacaoGrafica.plantaBaixa ? 'bg-green-500' : 'bg-red-500'}`}>
                              {relatorioExemplo.representacaoGrafica.plantaBaixa ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">Planta Baixa</span>
                          </li>
                          <li className="flex items-center">
                            <span className={`h-5 w-5 mr-2 rounded-full flex items-center justify-center ${relatorioExemplo.representacaoGrafica.cortes ? 'bg-green-500' : 'bg-red-500'}`}>
                              {relatorioExemplo.representacaoGrafica.cortes ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">Cortes</span>
                          </li>
                          <li className="flex items-center">
                            <span className={`h-5 w-5 mr-2 rounded-full flex items-center justify-center ${relatorioExemplo.representacaoGrafica.fachadas ? 'bg-green-500' : 'bg-red-500'}`}>
                              {relatorioExemplo.representacaoGrafica.fachadas ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">Fachadas</span>
                          </li>
                          <li className="flex items-center">
                            <span className={`h-5 w-5 mr-2 rounded-full flex items-center justify-center ${relatorioExemplo.representacaoGrafica.implantacao ? 'bg-green-500' : 'bg-red-500'}`}>
                              {relatorioExemplo.representacaoGrafica.implantacao ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">Implantação</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Elementos Complementares</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <span className={`h-5 w-5 mr-2 rounded-full flex items-center justify-center ${relatorioExemplo.representacaoGrafica.cobertura ? 'bg-green-500' : 'bg-red-500'}`}>
                              {relatorioExemplo.representacaoGrafica.cobertura ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">Planta de Cobertura</span>
                          </li>
                          <li className="flex items-center">
                            <span className={`h-5 w-5 mr-2 rounded-full flex items-center justify-center ${relatorioExemplo.representacaoGrafica.cotasNiveis ? 'bg-green-500' : 'bg-red-500'}`}>
                              {relatorioExemplo.representacaoGrafica.cotasNiveis ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">Cotas e Níveis</span>
                          </li>
                          <li className="flex items-center">
                            <span className={`h-5 w-5 mr-2 rounded-full flex items-center justify-center ${relatorioExemplo.representacaoGrafica.escalas ? 'bg-green-500' : 'bg-red-500'}`}>
                              {relatorioExemplo.representacaoGrafica.escalas ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">Escalas</span>
                          </li>
                          <li className="flex items-center">
                            <span className={`h-5 w-5 mr-2 rounded-full flex items-center justify-center ${relatorioExemplo.representacaoGrafica.norte ? 'bg-green-500' : 'bg-red-500'}`}>
                              {relatorioExemplo.representacaoGrafica.norte ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">Indicação do Norte</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Observations */}
                  <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Observações e Recomendações</h2>
                    
                    <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 p-4 rounded mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Não Conformidades Encontradas</h3>
                          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                            <ul className="list-disc pl-5 space-y-1">
                              {relatorioExemplo.observacoes.map((obs, index) => (
                                <li key={index}>{obs}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 p-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Recomendações</h3>
                          <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                            <p>Para corrigir as não conformidades identificadas, recomendamos:</p>
                            <ul className="list-disc pl-5 space-y-1 mt-2">
                              <li>Ajustar o recuo frontal para atender o mínimo de 5,0m exigido pela legislação.</li>
                              <li>Aumentar a área permeável para atingir o mínimo de 20% da área do terreno.</li>
                              <li>Adicionar planta de cobertura ao projeto.</li>
                              <li>Incluir indicação do norte na implantação.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Carregando relatório...</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Por favor, aguarde enquanto processamos os dados do projeto.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
